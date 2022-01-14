/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');
const hasProperties = require('../errors/hasProperties');
//complete list function
//valid date middleware
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
)

async function list(req, res) {
  const {date} = req.query;
  let data;
  data = date ? await service.listByDate(date) : await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredProperties, asyncErrorBoundary(create)],
};
