const logger = require('./logger');

const parseAge = (ageString) => {
  const splits = ageString.split(/(h|d|w|y)/);

  let ageMs;

  const [num, range] = splits; // range = h,d, or w
  logger.debug(`Age num: '${num}', age range: '${range}'`);
  switch (range) {
    case 'h':
      ageMs = 60 * 60 * num * 1000;
      break;
    case 'd':
      ageMs = 60 * 60 * 24 * num * 1000;
      break;
    case 'w':
      ageMs = 60 * 60 * 24 * 7 * num * 1000;
      break;
    default:
      ageMs = 0;
  }

  const nowMs = Date.now();
  const maxAgeMs = nowMs - ageMs;
  logger.debug(`Max age timestamp: ${new Date(maxAgeMs)} ('${ageString}' before now)`);

  return maxAgeMs;
};

module.exports = parseAge;
