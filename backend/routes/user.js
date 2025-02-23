const express = require("express");
const { register, login, logout , myProfile , getAllUsers} = require("../controllers/user");
const {createEvent , review_event , all_events, book_ticket} = require("../controllers/event")
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
router.route("/register").post(register); // working
router.route("/login").post(login); // working
router.route("/logout").get(logout); // working
router.route("/me").get(isAuthenticated, myProfile); // working
router.route("/users").get(isAuthenticated, getAllUsers); // working
router.route("/event/create").post(createEvent); // working
router.route("/event/review").post(isAuthenticated,review_event); // working
router.route("/events").get(all_events); // working
router.route("/event/book_ticket").post(isAuthenticated,book_ticket);
module.exports = router
