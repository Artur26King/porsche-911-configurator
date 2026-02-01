import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { saveConfig, getUserConfigs, updateConfig, deleteConfig } from '../controllers/configController.js';

const router = Router();

router.post('/save', requireAuth, saveConfig);
router.get('/user', requireAuth, getUserConfigs);
router.put('/:id', requireAuth, updateConfig);
router.delete('/:id', requireAuth, deleteConfig);

export default router;
