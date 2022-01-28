const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

//Validation
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
);

//res must have at least one person
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

//res time must fit form and business rules
function hasValidTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;
  const validTimeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!reservation_time) {
    return next({
      status: 400,
      message: "Reservation time cannot be empty. Please select a time.",
    });
  }
  if (!reservation_time.match(validTimeFormat)) {
    return next({
      status: 400,
      message:
        "The reservation_time must be a valid time in the format '12:30'",
    });
  }
  //restaurant is closed until 10:30 a.m.
  if (reservation_time < "10:30:00") {
    return next({
      status: 400,
      message: "The restaurant does not open until 10:30 a.m.",
    });
  } else {
    //restaurant closes at 10:30 p.m. so reservation must be at least one hour before
    if (reservation_time >= "21:30:00") {
      return next({
        status: 400,
        message:
          "The restaurant closes at 10:30 p.m. Please schedule your reservation at least one hour before close.",
      });
    }
  }
  next();
}

//res must have valid format and fit business rules
function hasValidDate(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = req.body;
  const tuesday = 2;
  const submitDate = new Date(reservation_date + " " + reservation_time);
  const dayAsNumber = submitDate.getUTCDay();
  const today = new Date();
  const dateFormat = /\d\d\d\d-\d\d-\d\d/;

  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message:
        "the reservation_date must be a valid date in the format 'YYYY-MM-DD'",
    });
  }
  //restaurant is closed on tuesday, checks day of the week
  if (dayAsNumber === tuesday) {
    return next({
      status: 400,
      message:
        "The restaurant is closed on Tuesdays. Please select a different day.",
    });
  }
  //to prevent reservations in the past
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

function statusCheck(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  //status must be one of the above valid statuses
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `The status must be either ${validStatus.join(
        ","
      )}. You entered ${status}`,
    });
  }
  next();
}

//new reservations should have a booked status
function bookedCheck(req, res, next) {
  const { status } = req.body.data;
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `A new reservation cannot have a status of ${status}`,
    });
  }
  next();
}

//prevents updating reservation if status is finished
function finishCheck(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Reservation status is currently finished and cannot be changed",
    });
  }
  next();
}

//CRUDL
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data;

  // checks if query is date or mobile_number and changes data accordingly
  data = date
    ? await service.listByDate(date)
    : mobile_number
    ? await service.search(mobile_number)
    : await service.list();
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

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

//update reservation status
async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await service.statusUpdate(reservation_id, status);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasValidPeople,
    hasValidTime,
    hasValidDate,
    bookedCheck,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    hasValidPeople,
    hasValidTime,
    hasValidDate,
    bookedCheck,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusCheck,
    finishCheck,
    asyncErrorBoundary(updateStatus),
  ],
};
