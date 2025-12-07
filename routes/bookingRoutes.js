import express from "express";
import { bookingController } from "../controllers/bookingController.js";
import { authenticateToken, requireAnyRole } from "../middleware/auth.js";

const router = express.Router();

// USER or ADMIN
router.post("/", authenticateToken, bookingController.create);

// USER or ADMIN (permissions handled inside service)
router.put("/:id", authenticateToken, bookingController.update);

// USER bookings
router.get("/mine", authenticateToken, bookingController.getMine);

// ADMIN only
router.get("/", authenticateToken, requireAnyRole(["admin"]), bookingController.getAll);

// ADMIN delete
router.delete("/:id", authenticateToken, requireAnyRole(["admin"]), bookingController.delete);

export default router;
