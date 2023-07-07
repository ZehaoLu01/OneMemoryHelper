const noteData = require("../models/notes");

const noteServices = {};

noteServices.upsertNotes = async (notes, ownerId) => {
  return await noteData.upsert(notes, ownerId);
};

noteServices.setReviewStage = async (id, stage) => {
  try {
    await noteData.setReviewStage(id, stage);
  } catch (err) {
    console.log(err);
  }
};

module.exports = noteServices;
