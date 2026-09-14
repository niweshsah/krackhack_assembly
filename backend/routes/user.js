const express = require("express");
const { register, login, refresh, logout , myProfile , getAllUsers} = require("../controllers/user");
const {createEvent , review_event , all_events, book_ticket} = require("../controllers/event")
const { isAuthenticated, requireRole } = require("../middlewares/auth");
const router = express.Router();
router.route("/register").post(register); // working // working 
router.route("/login").post(login); // working // working 
router.route("/refresh").post(refresh);
router.route("/logout").get(logout).post(logout);
router.route("/me").post(myProfile); // working  // working 
router.route("/users").get(getAllUsers); // working // working 
router.route("/event/create").post(isAuthenticated, requireRole("organizer", "admin"), createEvent); // working  // events
router.route("/event/review").post(isAuthenticated,review_event); // working
router.route("/events").get(all_events); // working // working 
router.route("/event/book_ticket").post(isAuthenticated, book_ticket); // working // working
module.exports = router;