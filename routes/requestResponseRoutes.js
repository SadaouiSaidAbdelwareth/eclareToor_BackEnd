import express from 'express';
import { requestResponseController } from '../controllers/requestResponseController.js';
import { authenticateToken, requireAnyRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireAnyRole(["admin"]), requestResponseController.create);
router.get('/', authenticateToken ,  requireAnyRole(["admin"]) , requestResponseController.getAll);
router.get('/:id', authenticateToken , requestResponseController.getById);
router.put('/:id', authenticateToken,  requireAnyRole(["admin"]) , requestResponseController.update);
router.delete('/', authenticateToken,  requireAnyRole(["admin"]) , requestResponseController.deleteMany);

export default router;
