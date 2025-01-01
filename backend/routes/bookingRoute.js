import {Router} from "express";
import bookingControllers from "../controllers/bookingController.js";

const router = Router();

router.post("/bookings", bookingControllers.createBookingController);
router.get("/available-slots", bookingControllers.getAvailableSlotsController);
router.put("/bookings/:id/cancel", bookingControllers.cancelBookingController);

export default router;
