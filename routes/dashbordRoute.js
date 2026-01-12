import express from 'express';
import { dashboardController } from '../controllers/dashbordController.js';
import { authenticateToken , requireAnyRole , checkUserActive} from '../middleware/auth.js';

const router = express.Router();

router.get("/", authenticateToken,checkUserActive ,requireAnyRole(["admin"]) , dashboardController.dashboard);

export default router;
