const cloudinary = require("cloudinary").v2;
const Event = require('../models/Event'); // Assuming you have a Debate model
const User = require('../models/User'); // Assuming you have a User model/
const ticketingSystem = 

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dvqfxjfia', // Replace with your actual Cloudinary cloud name
  api_key: '452653768355675', // Replace with your actual Cloudinary API key
  api_secret: 'W45YS0MwZnIvwPdOo5LdS5fRZ3s', // Replace with your actual Cloudinary API secret
});

exports.createEvent = async (req, res) => {
  try {
    const { image, title, Date_and_Time, tickets } = req.body;

    // Validate required fields
    if (!image || !title || !Date_and_Time || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Image, title, date/time, and at least one ticket category are required",
      });
    }

    // Validate each ticket category
    for (const ticket of tickets) {
      if (

        typeof ticket.category !== "number" ||
        typeof ticket.price !== "string" ||
        typeof ticket.desc !== "string" ||
        typeof ticket.seats_available !== "number"

      ) {
        return res.status(400).json({
          success: false,
          message: "Each ticket must have a valid category (Number), price (String), description (String), and seats_available (Number)",
        });
      }

      if (ticket.seats_available <= 0) {
        return res.status(400).json({
          success: false,
          message: `Seats available for category ${ticket.category} must be at least 1`,
        });
      }
    }

    // Upload image to Cloudinary
    const myCloud = await cloudinary.uploader.upload(image, {
      folder: "debates",
    });

    // Prepare event data
    const newEventData = {
      Title: title,
      Date_and_Time,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      organiser: req.user._id,
      isFinish: false,
      tickets, // Store ticket details in the event
    };

    // Create event in the database
    const event = await Event.create(newEventData);

    // Find the organiser
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add event to user's organised events
    if (!user.events_organised) {
      user.events_organised = [];
    }
    user.events_organised.push(event._id);

    await user.save();
    await event.save();

    // Respond with success
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
    const { event_id, category } = req.body; // Extract event ID and category from request body
    const user = await User.findById(req.user._id);
    const event = await Event.findById(event_id);

    // Check if event and user exist
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the ticket category in the event
    const ticketCategory = event.tickets.find(t => t.category === category);

    if (!ticketCategory) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    // Check if seats are available
    if (ticketCategory.seats_available <= 0) {
      return res.status(400).json({ success: false, message: "No seats available for this category" });
    }

    // Deduct one seat from available seats
    ticketCategory.seats_available -= 1;

    // Add event to user's attended list if not already present
    if (!user.events_attended.some(e => e.toString() === event._id.toString())) {
      user.events_attended.push({event : event._id,category});
    }

    // Add user to event's attendees list
    event.attendees.push({ user: user._id, category });

    // Save changes to the database
    await user.save();
    await event.save();

    res.status(200).json({
      success: true,
      message: "Ticket booked successfully",
      remaining_seats: ticketCategory.seats_available,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};