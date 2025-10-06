import { Router } from 'express';
import { createProject, getAllProjects } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All project routes require authentication
router.use(authenticateToken);

router.post('/', createProject);
router.get('/', getAllProjects);

export default router;
