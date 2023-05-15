
import express from 'express';
import { deleteContact, getAllContact, insertContact, updateContact } from '../Controllers/contact.js';
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router()

router.post('/',verifyAdmin,insertContact)
router.get('/',getAllContact)
router.put('/update',verifyAdmin,updateContact),
router.delete('/:id',verifyAdmin,deleteContact)
export default router
