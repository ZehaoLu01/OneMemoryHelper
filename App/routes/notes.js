var express = require("express");
var router = express.Router();
var userServices = require("../services/user");
var noteServices = require("../services/note");

// *We don't want to return notes that is modified during reviewing here.
// *Only notes that are not currently being reviewed and is modified since last user update will be returned here.
router.use("/recentlyModified", async function (req, res, next) {
  const isTesting = false;

  try {
    if (req.session.isAuthorized === true) {
      const userId = req.session.idTokenClaims.oid;
      const userData = (await userServices.getUserDataById(userId))[0];

      let showingData = await noteServices.getNotesForFrontendAndUpdate(
        userData,
        isTesting,
        req
      );

      userServices.updateLastUpdateTimeToNow(userData.id);

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
