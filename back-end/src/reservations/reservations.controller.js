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

async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
