import express from 'express';
import {
  borrowBook,
  getBorrowSummary,
  returnBook
} from '../controllers/borrowController';
import { validateBorrow } from '../middleware/validation';

const router = express.Router();

router.post('/', validateBorrow, borrowBook);
router.get('/summary', getBorrowSummary);
router.delete('/:borrowId', returnBook); // Optional return endpoint

export default router;