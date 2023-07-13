var express = require("express");
var router = express.Router();
var axios = require("axios");
var userServices = require("../services/user");
var noteServices = require("../services/note");

router.use("/recentlyModified", async function (req, res, next) {
  const isTesting = true;

  try {
    if (req.session.isAuthorized === true) {
      const userId = req.session.idTokenClaims.oid;

      const userData = (await userServices.getUserDataById(userId))[0];
      const lastUpdateTime = new Date(userData.lastUpdateTime);

      const requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime ge ${
        isTesting
          ? req.query.lastModifiedDateTime
          : lastUpdateTime.toISOString()
      }`;

      const noteResponse = await axios.get(requestURL, {
        headers: { Authorization: "Bearer " + req.session.accessToken },
      });

      let insertedData = [];

      if (noteResponse.data) {
        insertedData = await noteServices.upsertNotes(
          noteResponse.data.value,
          req.session.idTokenClaims?.oid
        );
      }
      if (insertedData.length != 0) {
        userServices.updateLastUpdateTimeToNow(userData.id);
      }
      res.json({ value: insertedData });
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({});
  }
});

router.put("/setReviewStage", async (req, res, next) => {
  try {
    if (req.body.stage) {
      if (req.body.id) {
        await noteServices.setReviewStage(req.body.id, req.body.stage);
      }
    }
    res.json({});
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
