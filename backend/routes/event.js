const express = require("express");
const { createEvent,participate, review_event ,all_events , finishEvent, resale} = require("../controllers/event");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
router.route("/event/create").post(isAuthenticated,createEvent);
router.route("/event/participate").post(isAuthenticated,participate);
router.route("/event/review").post(isAuthenticated,review_event);
router.route("/events").get(isAuthenticated,all_events);
router.route("/event/finish").post(isAuthenticated,finishEvent);
router.route("/event/resale").post(isAuthenticated,resale);

module.exports = router
