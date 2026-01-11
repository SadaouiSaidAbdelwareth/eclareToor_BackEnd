import express from 'express';
import { requestController } from '../controllers/requestController.js';
import { authenticateToken , requireAnyRole , checkUserActive} from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireAnyRole(["user"]) , checkUserActive ,requestController.create);
router.get('/', authenticateToken, requireAnyRole(["admin"]) ,requestController.getAll);
router.get("/mine", authenticateToken , checkUserActive , requestController.getMine);
router.get('/:id', authenticateToken, checkUserActive , requestController.getById);
router.put('/:id', authenticateToken, checkUserActive , requestController.update);
router.delete('/', authenticateToken, requireAnyRole(["admin"]) , requestController.deleteMany);

export default router;
