
import express from 'express';
import { insertContact } from '../Controllers/contact.js';

const router = express.Router()

router.post('/',insertContact)

export default router
