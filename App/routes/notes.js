var express = require("express");
var router = express.Router();
var axios = require("axios");

router.use("/recentModified", async function (req, res, next) {
  try {
    if (req.session.isAuthorized === true) {
      const lastModifiedDateTime =
        req.query.lastModifiedDateTime === undefined
          ? new Date().toISOString().slice(0, 10)
          : req.query.lastModifiedDateTime;

      const requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime ge ${lastModifiedDateTime}`;

      const noteResponse = await axios.get(requestURL, {
        headers: { Authorization: "Bearer " + req.session.accessToken },
      });
      res.json(noteResponse.data);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
