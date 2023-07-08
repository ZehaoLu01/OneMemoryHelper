const noteData = require("../models/notes");

const taskService = {};

taskService.findAllTasks = async (userId) => {
  try {
    const noteResult = await noteData.getNotesOfStage(userId, 1, 4);
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
