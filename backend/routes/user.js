const express = require("express");
const { register, login, logout , myProfile , getAllUsers} = require("../controllers/user");
const {createEvent , review_event , all_events, book_ticket} = require("../controllers/event")
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, myProfile);
router.route("/users").get(isAuthenticated, getAllUsers); 
router.route("/event/create").post(isAuthenticated,createEvent);
router.route("/event/review").post(isAuthenticated,review_event);
router.route("/events").get(isAuthenticated,all_events);
router.route("/event/book_ticket").post(isAuthenticated,book_ticket);
module.exports = router
