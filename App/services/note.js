const noteData = require("../models/notes");

const config = require("../config");

const noteServices = {};

noteServices.upsertNotes = async (notes, ownerId) => {
  return await noteData.upsert(notes, ownerId);
};

const updateReviewTime = async (id) => {
  try {
    const currentStage = await noteData.getNoteReviewStage(id);
    return await noteData.updateReviewTime(id, currentStage);
  } catch (err) {
    console.log(err);
  }
};

noteServices.setReviewStage = async (
  id,
  targetStage,
  shouldUpdateReviewTime
) => {
  try {
    await noteData.setReviewStage(id, targetStage);
    if (shouldUpdateReviewTime === true) {
      await updateReviewTime(id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = noteServices;
