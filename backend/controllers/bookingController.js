import bookingModels from "../models/bookingModel.js";
import { formatResponse } from "../utils/responseHandler.js";

const createBookingController = async (req, res) => {
  const conn = await openConnection();
  try {
    const slots = await bookingModels.getAvailableSlots(req.body.date);
    const slot = slots.find((s) => s.time === req.body.time);

    if (!slot || slot.capacity - slot.booked_seats < req.body.guests) {
      return res
        .status(400)
        .json(
          formatResponse(null, "Selected time slot is not available", false)
        );
    }

    const bookingId = await bookingModels.createBooking(req.body);
    const booking = await bookingModels.getBookingById(bookingId);

    res.status(201).json(formatResponse(booking));
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(null, "Internal Server Error", false));
  }
};

const getAvailableSlotsController = async (req, res) => {
  try {
    const { date } = req.query;
    const slots = await bookingModels.getAvailableSlots(date);

    const availableSlots = slots.map((slot) => ({
      time: slot.time,
      available: slot.capacity - slot.booked_seats > 0,
      remainingSeats: slot.capacity - slot.booked_seats,
    }));

    res.status(200).json(formatResponse(availableSlots));
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(null, "Internal Server Error", false));
  }
};

const cancelBookingController = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await bookingModels.updateBookingStatus(id, "cancelled");

    if (!success) {
      return res
        .status(404)
        .json(formatResponse(null, "Booking not found", false));
    }

    res
      .status(200)
      .json(
        formatResponse({ success: true }, "Booking cancelled successfully")
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(formatResponse(null, "Internal Server Error", false));
  }
};

export default {
  createBookingController,
  getAvailableSlotsController,
  cancelBookingController,
};
