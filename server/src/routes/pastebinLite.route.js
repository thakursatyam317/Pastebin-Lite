import express from 'express';
import { getHealthz, postPastes, getPastes} from '../controllers/pastebinLite.controller.js';

const router = express.Router();

router.get('/healthz', getHealthz);

router.post('/pastes', postPastes);
router.get('/pastes/:id', getPastes);



export default router;

