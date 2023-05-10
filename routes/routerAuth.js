
import express from 'express';
import { login_client, register_client } from '../Controllers/auth.js';

const router = express.Router()

router.post('/register',register_client)
router.post('/login',login_client)

export default router
