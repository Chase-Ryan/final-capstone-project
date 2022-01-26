/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
//complete list function
//valid date middleware
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

function hasValidPeople(req, res, next) {
  const {
    data: { people },
  } = req.body;

  if (people <= 0 || typeof people !== "number") {
    return next({
      status: 400,
      message: "'people' value must be greater than 0 and be a number",
    });
  }

  next();
}

function hasValidTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;
  const validTimeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!reservation_time) {
    return next({
      status: 400,
      message: "Reservation time cannot be empty. Please select a time.",
    })
  }
  if (!reservation_time.match(validTimeFormat)) {
    return next({
      status: 400,
      message: "The reservation time must be a valid time in the format '12:30'",
    });
  }
  if (reservation_time < "10:30:00") {
    return next({
      status: 400,
      message: "The restaurant does not open until 10:30 a.m.",
    })
  } else {
    if (reservation_time >= "21:30:00") {
      return next({
        status: 400,
        message: "The restaurant closes at 10:30 p.m. Please schedule your reservation at least one hour before close.",
      });
    }
  }

  next();
}

function hasValidDate(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = req.body;
  const tuesday = 2;
  const submitDate = new Date(reservation_date);
  const dayAsNumber = submitDate.getUTCDay();
  const today = new Date();
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;
  
  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: "the reservation_date must be a valid date in the format 'YYYY-MM-DD'",
    });
  }
  if (dayAsNumber === tuesday) {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays. Please select a different day.",
    });
  }
  if (submitDate < today) {
    return next({
      status: 400,
      message: "Must be a future date",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `No reservation found for id: ${reservation_id}`,
    });
  } else {
    res.locals.reservation = reservation;
    return next();
  }
}

async function list(req, res) {
  const { date } = req.query;
  let data;

  data = date ? await service.listByDate(date) : await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res) {
  const { reservation } = res.locals;
  const data = await service.read(reservation.reservation_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasValidPeople,
    hasValidTime,
    hasValidDate,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};
