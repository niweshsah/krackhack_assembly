const express = require("express");
const { register, login, logout , myProfile , getAllUsers} = require("../controllers/user");
const {createEvent , review_event , all_events, book_ticket} = require("../controllers/event")
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();
router.route("/register").post(register); // working // working 
router.route("/login").post(login); // working // working 
router.route("/logout").get(logout); // working // working 
router.route("/me").post(myProfile); // working  // working 
router.route("/users").get(getAllUsers); // working // working 
router.route("/event/create").post(createEvent); // working  // events
router.route("/event/review").post(isAuthenticated,review_event); // working
router.route("/events").get(all_events); // working // working 
router.route("/event/book_ticket").post(book_ticket); // working // working
module.exports = router 