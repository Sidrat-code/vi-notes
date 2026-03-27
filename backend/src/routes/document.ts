import express from 'express';
import { saveDocument, getDocuments, getDocument } from '../controllers/documentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', saveDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);

export default router;