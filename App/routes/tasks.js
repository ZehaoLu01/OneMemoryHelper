const express = require("express");
const router = express.Router();

var taskService = require("../services/task");

router.use("/allTasks", async (req, res, next) => {
  const userId = req.session.idTokenClaims?.oid;
  if (!userId) {
    res
      .status(500)
      .json({ reason: "failed to find the user oid from session." });
    return;
  }

  const result = await taskService.findAllTasks(userId);
  res.json(result);
});

module.exports = router;
