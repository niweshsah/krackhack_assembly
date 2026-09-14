const prisma = require("../config/prisma");

const parseDate = (date, time) => {
  const parsed = new Date(time ? `${date}T${time}` : date);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error("A valid event date is required");
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const toCents = (price) => {
  const value = Number(price);
  if (!Number.isFinite(value) || value < 0) {
    const error = new Error("Ticket price must be a non-negative number");
    error.statusCode = 400;
    throw error;
  }
  return Math.round(value * 100);
};

const toQuantity = (quantity) => {
  const value = Number(quantity);
  if (!Number.isInteger(value) || value < 1) {
    const error = new Error("Ticket quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }
  return value;
};

const pad = (value) => String(value).padStart(2, "0");

const mapEvent = (event) => ({
  _id: event.id,
  id: event.id,
  title: event.title,
  Title: event.title,
  image: event.imageUrl,
  date: `${event.startsAt.getFullYear()}-${pad(event.startsAt.getMonth() + 1)}-${pad(event.startsAt.getDate())}`,
  time: `${pad(event.startsAt.getHours())}:${pad(event.startsAt.getMinutes())}`,
  venue: event.venue.name,
  organiser: event.organizer.userId,
  isFinish: event.status === "finished",
  tickets: event.ticketTypes.map((ticketType) => ({
    _id: ticketType.id,
    category: ticketType.name,
    price: ticketType.priceCents / 100,
    desc: ticketType.description,
    seats_available: ticketType.tickets.filter((ticket) => ticket.status === "available").length,
  })),
  reviews: event.reviews.map((review) => ({
    _id: review.id,
    comment: review.comment,
    user: review.userId,
  })),
});

const eventInclude = {
  venue: true,
  organizer: true,
  reviews: true,
  ticketTypes: { include: { tickets: true } },
};

exports.createEvent = async (req, res) => {
  try {
    const { image, title, date, time, venue, tickets = [] } = req.body;
    if (!title || !venue || !date || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ success: false, message: "Title, date, venue, and tickets are required" });
    }

    const startsAt = parseDate(date, time);
    const event = await prisma.$transaction(async (transaction) => {
      const organizer = await transaction.organizer.upsert({
        where: { userId: req.user.id },
        update: {},
        create: { userId: req.user.id },
      });
      const eventVenue = await transaction.venue.create({ data: { name: venue } });
      const ticketTypes = tickets.map((ticket) => {
        const quantity = toQuantity(ticket.seats_available);
        return {
          name: String(ticket.category || "General Admission"),
          description: ticket.desc ? String(ticket.desc) : null,
          priceCents: toCents(ticket.price),
          totalQuantity: quantity,
          tickets: {
            create: Array.from({ length: quantity }, (_, index) => ({
              seatReference: `${ticket.category || "general"}-${index + 1}`,
            })),
          },
        };
      });

      return transaction.event.create({
        data: {
          organizerId: organizer.id,
          venueId: eventVenue.id,
          title: String(title),
          imageUrl: image ? String(image) : null,
          startsAt,
          status: "published",
          ticketTypes: { create: ticketTypes },
        },
        include: eventInclude,
      });
    });

    return res.status(201).json({ success: true, message: "Event created successfully", event: mapEvent(event) });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.review_event = async (req, res) => {
  try {
    const { event_id: eventId, comment } = req.body;
    if (!eventId || !comment) {
      return res.status(400).json({ success: false, message: "event_id and comment are required" });
    }
    await prisma.eventReview.upsert({
      where: { eventId_userId: { eventId, userId: req.user.id } },
      update: { comment: String(comment) },
      create: { eventId, userId: req.user.id, comment: String(comment) },
    });
    return res.status(201).json({ success: true, message: "Commented Successfully..." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.all_events = async (req, res) => {
  try {
    const name = req.query.name ? String(req.query.name) : undefined;
    const events = await prisma.event.findMany({
      where: name ? { title: { contains: name, mode: "insensitive" } } : undefined,
      include: eventInclude,
      orderBy: { startsAt: "asc" },
    });
    return res.status(200).json({ success: true, events: events.map(mapEvent) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.finishEvent = async (req, res) => {
  try {
    const eventId = req.body.event_id || req.body.userId;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.organizerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "You cannot finish this event" });
    }
    await prisma.event.update({ where: { id: eventId }, data: { status: "finished" } });
    return res.status(200).json({ success: true, message: "Successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.book_ticket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ success: false, message: "ticketId is required" });
    const reservation = await prisma.$transaction(async (transaction) => {
      const ticket = await transaction.ticket.findFirst({
        where: {
          OR: [{ id: ticketId }, { ticketTypeId: ticketId }],
          status: "available",
        },
        orderBy: { createdAt: "asc" },
      });
      if (!ticket) {
        const error = new Error("Ticket is no longer available");
        error.code = "TICKET_UNAVAILABLE";
        throw error;
      }
      const updated = await transaction.ticket.updateMany({
        where: { id: ticket.id, status: "available" },
        data: { status: "reserved" },
      });
      if (updated.count === 0) {
        const error = new Error("Ticket is no longer available");
        error.code = "TICKET_UNAVAILABLE";
        throw error;
      }
      return transaction.reservation.create({
        data: {
          ticketId: ticket.id,
          userId: req.user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        include: { ticket: true },
      });
    });
    return res.status(201).json({ success: true, message: "Ticket reserved successfully", reservation });
  } catch (error) {
    if (error.code === "TICKET_UNAVAILABLE") {
      return res.status(409).json({ success: false, message: "Ticket is sold out or already reserved" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};
