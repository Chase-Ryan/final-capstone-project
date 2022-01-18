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

  if (!reservation_time.match(validTimeFormat)) {
    return next({
      status: 400,
      message: `the reservation_time must be a valid time in the format '12:30`,
    });
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasValidPeople,
    hasValidTime,
    hasValidDate,
    asyncErrorBoundary(create),
  ],
};
