const noteData = require("../models/notes");

const noteServices = {};

noteServices.upsertNotes = async (notes, ownerId) => {
  return await noteData.upsert(notes, ownerId);
};

module.exports = noteServices;
