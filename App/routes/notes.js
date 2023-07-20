var express = require("express");
var router = express.Router();
var axios = require("axios");
var userServices = require("../services/user");
var noteServices = require("../services/note");

// *We don't want to return notes that is modified during reviewing here.
// *Only notes that is not currently being reviewed and is modified since last user update will be returned here.
router.use("/recentlyModifiedNotes", async function (req, res, next) {
  const isTesting = true;

  try {
    if (req.session.isAuthorized === true) {
      const userId = req.session.idTokenClaims.oid;

      //==============================
      const userData = (await userServices.getUserDataById(userId))[0];
      const lastUpdateTime = new Date(userData.lastUpdateTime);
      let requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime ge ${
        isTesting
          ? req.query.lastModifiedDateTime
          : lastUpdateTime.toISOString()
      }`;
      let fetchedNotes = [];

      while (requestURL !== undefined) {
        const noteResponse = await axios.get(requestURL, {
          headers: { Authorization: "Bearer " + req.session.accessToken },
        });

        requestURL = undefined;
        if (noteResponse.data) {
          fetchedNotes = fetchedNotes.concat(noteResponse.data.value);
          if (noteResponse.data["@odata.nextLink"]) {
            requestURL = noteResponse.data["@odata.nextLink"];
          }
        }
      }

      let insertedData = [];
      let showingData = [];
      if (fetchedNotes.length != 0) {
        insertedData = await noteServices.upsertNotes(
          fetchedNotes,
          req.session.idTokenClaims?.oid
        );
      }

      if (insertedData.length != 0) {
        userServices.updateLastUpdateTimeToNow(userData.id);
      }

      // We don't want to show notes that is being reviewed, so we need to get rid of those currently getting reviewed.
      // We also want to show these notes for multiple days instead of once.
      showingData = await noteServices.filterFetchedNotes(
        fetchedNotes.map((note) => note.id)
      );

      res.json({ value: showingData });
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.put("/ReviewStage", async (req, res, next) => {
  try {
    if (req.body.stage) {
      if (req.body.id) {
        await noteServices.setReviewStage(
          req.body.id,
          req.body.stage,
          req.body.updateReviewStageToNow
        );
      }
    }
    res.json({});
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
