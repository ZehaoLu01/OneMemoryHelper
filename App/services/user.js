const userData = require("../models/users");

const userServices = {};

userServices.upsertUser = async (id, email, name) => {
  try {
    userData.upsert(id, email, name);
  } catch (err) {
    console.log(err);
  }
};

userServices.updateLastUpdateTimeToNow = async (id) => {
  try {
    userData.updateUpdateTime(id, Date.now());
  } catch (err) {
    console.log(err);
  }
};

userServices.getUserDataById = async (id) => {
  try {
    const data = await userData.getUserData(id);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = userServices;
