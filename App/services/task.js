const noteData = require("../models/notes");
const config = require("../config");

const taskService = {};

//Task is defined as note that need review on some day.
taskService.findAllTasksToday = async (userId) => {
  try {
    const noteResult = await noteData.getNotesOfStageNeedReviewToday(
      userId,
      config.ReviewStage.First,
      config.ReviewStage.Forth
    );
    const result = noteResult.map((note) => {
      return {
        id: note.id,
        title: note.title,
        section: note.parentSectionTitle,
        clientUrl: note.clientUrl,
        webUrl: note.webUrl,
        stage: note.reviewStage,
      };
    });

    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = taskService;
