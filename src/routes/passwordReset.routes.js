import express from 'express';
import { requestPasswordReset, resetPassword } from '../controller/passwordReset.controller.js';

const router = express.Router();

router.post('/', requestPasswordReset);
router.post('/reset-password/:hash', resetPassword);

export default router;