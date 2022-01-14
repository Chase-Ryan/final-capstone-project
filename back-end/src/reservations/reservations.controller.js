/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');
//complete list function
//valid date middleware


async function list(req, res) {
  const {date} = req.query;
  let reservations;
  reservations = date ? await service.listByDate(date) : await service.list();
  res.json({
    data: reservations,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
