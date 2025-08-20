import { Request, Response } from 'express';
import Borrow from '../models/Borrow';
import Book from '../models/Book';
import { IBorrow, BorrowSummary } from '../types';



// Helper function to handle errors
const handleError = (error: unknown, defaultMessage: string): { message: string; details?: unknown } => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string };
    return { message: err.message || defaultMessage, details: error };
  }
  
  return { message: defaultMessage, details: error };
};




// Borrow a book
export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId, quantity, dueDate } = req.body;

    // Check if book exists and has enough copies
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book.copies < quantity) {
      res.status(400).json({ 
        message: `Not enough copies available. Only ${book.copies} copies left.` 
      });
      return;
    }

    // Create borrow record
    const borrowData: IBorrow = { bookId, quantity, dueDate: new Date(dueDate) };
    const newBorrow = new Borrow(borrowData);
    const savedBorrow = await newBorrow.save();

    // Update book copies
    book.copies -= quantity;
    await book.save();

    res.status(201).json(savedBorrow);
  } catch (error) {
    const errorInfo = handleError(error, 'Error borrowing book');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};




// Get borrow summary
export const getBorrowSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const borrowSummary: BorrowSummary[] = await Borrow.aggregate([
      {
        $group: {
          _id: '$bookId',
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $unwind: '$book'
      },
      {
        $project: {
          bookId: '$_id',
          title: '$book.title',
          isbn: '$book.isbn',
          totalQuantity: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(borrowSummary);
  } catch (error) {
    const errorInfo = handleError(error, 'Error fetching borrow summary');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};




// Return a borrowed book (optional enhancement)
export const returnBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      res.status(404).json({ message: 'Borrow record not found' });
      return;
    }

    // Update book copies
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.copies += borrow.quantity;
      await book.save();
    }

    // Delete borrow record
    await Borrow.findByIdAndDelete(borrowId);

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    const errorInfo = handleError(error, 'Error returning book');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};