const mongoose = require("mongoose");

const checkConnection = async () => {
  if (mongoose.connection.readyState != 1) {
    await mongoose.connect("mongodb://127.0.0.1:27017/one_memory_helper");
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
    required: true,
    default: Date.now(),
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
    for (const note of convertedNotes) {
      noteModel.updateOne({ id: note.id }, note, { upsert: true });
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

module.exports = noteData;
