const knex = require('../db/connection');
//list function to return reservations for one day
//display error messages

function list() {
    return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_date")
}
function listByDate(reservation_date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservations.reservation_time");
}
function create(reservation) {
    return knex("restaurants")
    .insert(reservation)
    .returning("*")
    .then((newReservation) => newReservation[0])
}

module.exports = {
    list,
    listByDate,
    create,
}