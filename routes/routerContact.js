
import express from 'express';
import { deleteContact, getAllContact, insertContact, updateContact } from '../Controllers/contact.js';

const router = express.Router()

router.post('/',insertContact)
router.get('/',getAllContact)
router.put('/update',updateContact),
router.delete('/:id',deleteContact)
export default router
