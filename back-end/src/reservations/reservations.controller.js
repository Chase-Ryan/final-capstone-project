/**
 * List handler for reservation resources
 */
//require service file
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
//complete list function
//valid date middleware


async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
