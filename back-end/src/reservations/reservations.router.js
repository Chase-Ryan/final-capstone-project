/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
//create and require methodNotAllowed file
const methodNotAllowed = require('../errors/methodNotAllowed');

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
