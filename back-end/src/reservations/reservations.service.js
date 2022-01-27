const knex = require('../db/connection');

function list() {
    return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_date")
}
function listByDate(reservation_date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservations.reservation_time");
}
function create(reservation) {
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => newReservation[0])
}
function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .first();
}
function statusUpdate(reservation_id, status) {
    return knex("reservations")
      .where({ reservation_id })
      .update({ status })
      .then(() => read(reservation_id));
  }

module.exports = {
    list,
    listByDate,
    create,
    read,
    statusUpdate,
}