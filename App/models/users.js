const mongoose = require("mongoose");

const checkConnection = async () => {
  if (mongoose.connection.readyState != 1) {
    await mongoose.connect("mongodb://127.0.0.1:27017/one_memory_helper");
  }
};

const userScheme = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    default: "user",
  },
  lastUpdateTime: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = mongoose.model("user", userScheme);

const userData = {};

userData.insert = async (user) => {
  try {
    await checkConnection();

    const model = new userModel(user);
    const newModel = await model.save();
    if (newModel.isNew === true) {
      console.log("successfully inserted");
    } else {
      console.log("successfully saved doc, it may be an update");
    }
  } catch (err) {
    console.log(err);
    mongoose.connection.close();
  }
};

userData.upsert = async (id, email, name) => {
  try {
    const result = await userData.upsert(id, email, name);
    return result;
  } catch (e) {
    console.log(e);
  }
};

userData.updateUpdateTime = async (id, updateTime) => {
  try {
    await checkConnection();

    const result = await userModel.updateOne(
      { id: id },
      { lastUpdateTime: updateTime }
    );
    if (result.acknowledged === true) {
      console.log(
        `update last modified time success for user id ${id}, new time: ${Date.now()}`
      );
    } else {
      console.log(
        "Something went wrong when updating update time because the result is not acknowledged"
      );
    }
  } catch (err) {
    console.log(err);
  }
};

userData.getUserData = async (id) => {
  try {
    await checkConnection();
    const result = await userModel.where("id").equals(id).exec();

    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = userData;
