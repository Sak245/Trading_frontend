import express from 'express';
import { getTokens } from '../services/priceService';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(getTokens());
});

export default router;
