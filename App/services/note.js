const noteData = require("../models/notes");
const config = require("../config");
var axios = require("axios");

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

noteServices.getNotesForFrontendAndUpdate = async function (
  userData,
  isTesting,
  req
) {
  const lastUpdateTime = new Date(userData.lastUpdateTime);
  let requestURL = `https://graph.microsoft.com/v1.0/me/onenote/pages?$filter=lastModifiedDateTime ge ${
    isTesting ? req.query.lastModifiedDateTime : lastUpdateTime.toISOString()
  }`;
  let fetchedNotes = [];

  while (requestURL !== undefined) {
    const noteResponse = await axios.get(requestURL, {
      headers: { Authorization: "Bearer " + req.session.accessToken },
    });

    requestURL = undefined;
    if (noteResponse.data) {
      fetchedNotes = fetchedNotes.concat(noteResponse.data.value);
      if (noteResponse.data["@odata.nextLink"]) {
        requestURL = noteResponse.data["@odata.nextLink"];
      }
    }
  }

  let insertedData = [];
  let showingData = [];
  if (fetchedNotes.length != 0) {
    insertedData = await noteServices.upsertNotes(
      fetchedNotes,
      req.session.idTokenClaims?.oid
    );
  }

  // We don't want to show notes that is being reviewed, so we need to get rid of those currently getting reviewed.
  // We also want to show these notes for multiple days instead of once.
  showingData = await noteServices.filterFetchedNotes(
    fetchedNotes.map((note) => note.id)
  );
  return showingData;
};

module.exports = noteServices;
