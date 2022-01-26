const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");
const reservationService = require("../reservations/reservations.service");

const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasRequiredUpdateProperties = hasProperties("reservation_id");

function hasData(req, res, next) {
  const data = req.body.data;
  if (!data) {
    return next({
      status: 400,
      message: "Must have data property",
    });
  }
  next();
}

function hasValidName(req, res, next) {
  const {
    data: { table_name },
  } = req.body;
  if (!table_name || table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name must be at least 2 characters long",
    });
  }
  next();
}

function hasCapacity(req, res, next) {
  const {
    data: { capacity },
  } = req.body;
  if (capacity <= 0 || typeof capacity !== "number") {
    return next({
      status: 400,
      message: "capacity must be be greater than 0",
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({
      status: 404,
      message: `No table found for id '${table_id}'.`,
    });
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `A reservation_id is required`,
    });
  }
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `A reservation with the id ${reservation_id} was not found.`,
    });
  }
}
function validateSeated(req, res, next) {
    const { status } = res.locals.reservation;
    if (status === "seated") {
      return next({
        status: 400,
        message: `This reservation is already seated at a table!`,
      });
    }
    next();
  }
function validateTableSeating(req, res, next) {
    const people = res.locals.reservation.people;
    const capacity = res.locals.table.capacity;
    if (people > capacity) {
      next({
        status: 400,
        message: `The party size is greater than the table capacity. Please select another table.`,
      });
    }
    next();
  }
function validateOccupation(req, res, next) {
    const { table } = res.locals;
    if (table.reservation_id === null) {
      return next({
        status: 400,
        message: "Table is not occupied.",
      });
    }
    next();
  }

function tableIsFree(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is currently occupied. Please select another table.`,
    });
  }
  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
    const { reservation_id } = req.body.data;
    const table_id = Number(req.params.table_id);
    const data = await service.update(reservation_id, table_id);
    res.json({ data });
}
async function destroy(req, res) {
  const { table_id } = req.params;
  const { table } = res.locals;

  await service.clearTable(table_id, table.reservation_id);
  res.status(200).json({});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasValidName,
    hasCapacity,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    hasRequiredUpdateProperties,
    validateSeated,
    validateTableSeating,
    tableIsFree,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    validateOccupation,
    asyncErrorBoundary(destroy),
  ],
};
