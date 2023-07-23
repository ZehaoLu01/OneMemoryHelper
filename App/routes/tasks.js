const express = require("express");
var taskService = require("../services/task");

const router = express.Router();

router.use("/today", async (req, res, next) => {
  const userId = req.session.idTokenClaims?.oid;
  if (!userId) {
    res
      .status(401)
      .json({ reason: "failed to find the user oid from session." });
    return;
  }

  const result = await taskService.findAllTasksToday(userId);
  res.json(result);
});

module.exports = router;
