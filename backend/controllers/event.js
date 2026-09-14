const cloudinary = require("cloudinary").v2;
const Event = require('../models/Event'); // Assuming you have a Debate model
const User = require('../models/User'); // Assuming you have a User model/
const prisma = require("../config/prisma");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createEvent = async (req, res) => {
  try {
    const {image , title , date, time, venue, organiser, tickets} = req.body;
    console.log(title);
    console.log(tickets);
    console.log(date);
    console.log(image);
    console.log("...................................")
    const Title = title;
    const event = await Event.create({image , Title , date, time, venue, organiser, tickets});
    console.log(event);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.review_event = async (req, res) => {
    try {
        const commentData = {
            comment : req.body.comment,
            user : req.user._id
        }
        const event_id = req.body.event_id;
        const event = await Event.findById(event_id);
        event.reviews.push(commentData);
        await event.save();
        res.status(201).json({
            success: true,
            message : "Commented Successfully...",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
exports.all_events = async (req, res) => {
    try {
      const query = req.query.name ? { name: { $regex: req.query.name, $options: "i" } } : {};
      const events = await Event.find(query);
      console.log("hello")
      res.status(200).json({
        success: true,
        events
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.finishEvent = async (req, res) => {
    try {
        const user_id = req.body.userId;
        const event = await Event.findById(user_id);
        event.isFinish = true;
        await event.save();
        res.status(201).json({
            success: true,
            message : "Successfull",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
exports.resale = async(req,res) => {
  try {
    const { event_id,retaker, } = req.body;
    const event = await Event.findById(event_id);
    const curr = req.user._id;
    const extra = req.body.extra;
    const user1 = User.findById(curr);
  } catch (error) {
    res.status(500).json({
      success : false,
      message : error.message
    })
  }
}
exports.book_ticket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ success: false, message: "ticketId is required" });
    }

    const reservation = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.ticket.updateMany({
        where: { id: ticketId, status: "available" },
        data: { status: "reserved" },
      });

      if (updated.count === 0) {
        const error = new Error("Ticket is no longer available");
        error.code = "TICKET_UNAVAILABLE";
        throw error;
      }

      return transaction.reservation.create({
        data: {
          ticketId,
          userId: req.user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        include: { ticket: true },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Ticket reserved successfully",
      reservation,
    });

  } catch (error) {
    if (error.code === "TICKET_UNAVAILABLE") {
      return res.status(409).json({ success: false, message: "Ticket is sold out or already reserved" });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};