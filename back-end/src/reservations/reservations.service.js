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

module.exports = {
    list,
    listByDate,
}