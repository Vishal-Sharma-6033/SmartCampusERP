import express from 'express';
import { search } from './search.controller.js';

const router = express.Router();

router.get('/', search);

export default router;