var express = require("express");
var router = express.Router();
var axios = require("axios");

router.use("/recentModified", async function (req, res, next) {
  try {
    console.log("login state: " + req.session.isAuthorized);
    // const requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime%20ge%202023-05-17`;
    const requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages`;

    const noteResponse = await axios.get(requestURL, {
      headers: { Authorization: "Bearer " + req.session.accessToken },
    });
    res.json(noteResponse);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
