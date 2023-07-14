const express = require("express");
var taskService = require("../services/task");

const router = express.Router();

router.use("/allTasksToday", async (req, res, next) => {
  const userId = req.session.idTokenClaims?.oid;
  if (!userId) {
    res
      .status(500)
      .json({ reason: "failed to find the user oid from session." });
    return;
  }

  const result = await taskService.findAllTasksToday(userId);
  res.json(result);
});

module.exports = router;
