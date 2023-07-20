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

noteServices.filterFetchedNotes = async (noteIds) => {
  try {
    const notes = await noteData.getNotesOfIds(noteIds);
    return notes.filter((note) => {
      console.log(note.title);
      console.log(Date.now());
      console.log(note.lastModifiedDateTime.getTime());

      return (
        (note.reviewStage === config.ReviewStage.NotForReview ||
          note.reviewStage === config.ReviewStage.Completed) &&
        Date.now() - note.lastModifiedDateTime.getTime() <=
          config.modifiedNotesShowingPeriod * 60 * 60 * 24 * 1000
      );
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = noteServices;
