import express from "express";
import { contactController } from "../controllers/contactController.js";
import { authenticateToken, requireAnyRole } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC: User sends a message
router.post("/", contactController.create);

// ADMIN: list all contact messages
router.get("/", authenticateToken , requireAnyRole(["admin"]),contactController.getAll);

// delete
router.delete("/", authenticateToken , requireAnyRole(["admin"]),contactController.deleteMany);


export default router;
