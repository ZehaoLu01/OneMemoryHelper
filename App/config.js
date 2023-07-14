const config = {};

config.ReviewStage = {
  NotForReview: 0,
  First: 1,
  Second: 2,
  Third: 3,
  Forth: 4,
  Completed: 5,
};

config.reviewInterval = [1, 2, 4];

config.getIntervalForStage = (stage) => {
  try {
    return this.reviewInterval[stage - 1];
  } catch (e) {
    return 0;
  }
};
module.exports = config;
