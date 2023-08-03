const mongoose = require("mongoose");
const config = require("../config");

const checkConnection = async () => {
  if (mongoose.connection.readyState != 1) {
    console.log(process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
  }
};

const noteScheme = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdDateTime: {
    type: Date,
    required: true,
  },
  lastModifiedDateTime: {
    type: Date,
    required: true,
  },
  clientUrl: {
    type: String,
  },
  webUrl: {
    type: String,
  },
  parentSectionId: {
    type: String,
    required: true,
  },
  parentSectionTitle: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  reviewStage: {
    type: Number,
    required: true,
    default: 0,
  },
  lastReviewTime: {
    type: Date,
  },
  nextReviewTime: {
    type: Date,
  },
});

const noteModel = mongoose.model("note", noteScheme);

const noteData = {};

noteData.insertNotes = async (notes, ownerId) => {
  try {
    const convertedNotes = notes.map((note) => {
      const convertedNote = {};
      convertedNote.id = note.id;
      convertedNote.title = note.title;
      convertedNote.createdDateTime = note.createdDateTime;
      convertedNote.lastModifiedDateTime = note.lastModifiedDateTime;
      convertedNote.clientUrl = note.links.oneNoteClientUrl.href;
      convertedNote.webUrl = note.links.oneNoteWebUrl.href;
      convertedNote.parentSectionId = note.parentSection.id;
      convertedNote.parentSectionTitle = note.parentSection.displayName;
      convertedNote.ownerId = ownerId;
      return convertedNote;
    });
    await checkConnection();

    const inserted = await noteModel.insertMany(convertedNotes, {
      ordered: false,
    });

    return inserted;
  } catch (err) {
    console.log(err);
  }
};

noteData.upsert = async (notes, ownerId) => {
  try {
    const convertedNotes = notes.map((note) => {
      const convertedNote = {};
      convertedNote.id = note.id;
      convertedNote.title = note.title;
      convertedNote.createdDateTime = new Date(note.createdDateTime);
      convertedNote.lastModifiedDateTime = new Date(note.lastModifiedDateTime);
      convertedNote.clientUrl = note.links.oneNoteClientUrl.href;
      convertedNote.webUrl = note.links.oneNoteWebUrl.href;
      convertedNote.parentSectionId = note.parentSection.id;
      convertedNote.parentSectionTitle = note.parentSection.displayName;
      convertedNote.ownerId = ownerId;
      convertedNote.nextReviewTime = new Date();
      return convertedNote;
    });
    await checkConnection();
    for (const note of convertedNotes) {
      await noteModel.updateOne({ id: note.id }, note, { upsert: true });
    }
    return convertedNotes;
  } catch (err) {
    console.log(err);
  }
};

noteData.setReviewStage = async (id, stage) => {
  try {
    const result = await noteModel.updateOne(
      { id: id },
      { reviewStage: stage }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

noteData.getNotesOfStage = async (oid, min, max) => {
  try {
    const result = await noteModel.find({
      ownerId: oid,
      reviewStage: { $gte: min, $lte: max },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

noteData.getNotesOfStageNeedReviewToday = async (oid, min, max) => {
  try {
    const todayMidnightDateTime = new Date();
    todayMidnightDateTime.setHours(0, 0, 0, 0);
    const tomorrowMidnightDateTime = new Date();
    tomorrowMidnightDateTime.setHours(23, 59, 59, 999);
    const result = await noteModel.find({
      ownerId: oid,
      reviewStage: { $gte: min, $lte: max },
      nextReviewTime: {
        $gte: todayMidnightDateTime,
        $lte: tomorrowMidnightDateTime,
      },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

noteData.getNoteReviewStage = async (noteId) => {
  try {
    const result = await noteModel.findOne({ id: noteId }, ["reviewStage"]);
    if (result) {
      return result.reviewStage;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

noteData.updateReviewTime = async (noteId, currentStage) => {
  try {
    if (
      currentStage == config.ReviewStage.NotForReview ||
      currentStage - 1 > config.reviewInterval.length
    ) {
      return;
    }

    var nextDate = new Date(
      new Date().getTime() +
        config.reviewInterval[config.getIntervalForStage(currentStage)] *
          24 *
          60 *
          60 *
          1000
    );

    const result = await noteModel.updateOne(
      { id: noteId },
      {
        lastReviewTime: Date.now(),
        nextReviewTime: nextDate,
      }
    );

    return result;
  } catch (err) {
    console.log(err);
  }
};

noteData.getNotesOfIds = async (noteIds) => {
  await checkConnection();
  const notes = await noteModel.find({ id: { $in: noteIds } });
  return notes;
};

module.exports = noteData;
