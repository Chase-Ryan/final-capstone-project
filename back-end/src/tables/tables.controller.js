const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");

const hasRequiredProperties = hasProperties("table_name", "capacity");

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
    const { data: { table_name }} = req.body;
    if (!table_name || table_name.length < 2) {
        return next({
            status: 400,
            message: "table_name must be at least 2 characters long"
        })
    }
    next();
}

function hasCapacity(req, res, next) {
    const { data: { capacity }} = req.body;
    if (capacity <= 0 || typeof capacity !== "number") {
        return next({
            status: 400,
            message: "capacity must be be greater than 0"
        })
    }
}




async function list(req, res) {
    const data = await service.list();
    res.json({ data });
  }
  
  async function create(req, res) {
    const data = await service.create(req.body.data);
    res.status(201).json({ data });
  }

module.exports = {
    list: asyncErrorBoundary(list),
    create: [hasRequiredProperties, hasData, hasValidName, hasCapacity, asyncErrorBoundary(create)],
}