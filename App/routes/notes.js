var express = require("express");
var router = express.Router();
var axios = require("axios");
var userServices = require("../services/user");

router.use("/recentlyModified", async function (req, res, next) {
  try {
    if (req.session.isAuthorized === true) {
      const userId = req.session.idTokenClaims.oid;

      const userData = (await userServices.getUserDataById(userId))[0];
      const lastUpdateTime = new Date(userData.lastUpdateTime);

      const requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime ge ${lastUpdateTime.toISOString()}`;

      const noteResponse = await axios.get(requestURL, {
        headers: { Authorization: "Bearer " + req.session.accessToken },
      });
      res.json(noteResponse.data);
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({});
  }
});

module.exports = router;
