import { Router } from 'express';
import { issueChipsHandler } from '../controllers/hostController';

const router = Router();

// POST /api/host/chips/issue
router.post('/chips/issue', issueChipsHandler);

export default router;