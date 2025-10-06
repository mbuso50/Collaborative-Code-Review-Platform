import { Router } from 'express';
import { getUserProfile, updateUserProfile, getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUserUpdate } from '../middleware/validation';

const router = Router();


router.use(authenticateToken);

router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', validateUserUpdate, updateUserProfile);

export default router;