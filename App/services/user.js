const userData = require("../models/users");

const userServices = {};

userServices.upsertUser = async (id, email, name) => {
  try {
    userData.update(
      { id: id },
      { id: id, email: email, name: name },
      { upsert: true }
    );
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
