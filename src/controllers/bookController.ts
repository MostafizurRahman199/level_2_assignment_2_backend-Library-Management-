import { Request, Response } from 'express';
import Book from '../models/Book';
import { IBook } from '../types';

// Helper function to handle errors
const handleError = (error: unknown, defaultMessage: string): { message: string; details?: unknown } => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return { message: 'ISBN already exists' };
    }
    return { message: err.message || defaultMessage, details: error };
  }
  
  return { message: defaultMessage, details: error };
};

// Get all books with optional pagination
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments();

    res.status(200).json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    const errorInfo = handleError(error, 'Error fetching books');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};

// Get single book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.status(200).json(book);
  } catch (error) {
    const errorInfo = handleError(error, 'Error fetching book');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookData: IBook = req.body;
    const newBook = new Book(bookData);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    const errorInfo = handleError(error, 'Error creating book');
    
    if (errorInfo.message === 'ISBN already exists') {
      res.status(400).json({ message: errorInfo.message });
    } else {
      res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
    }
  }
};

// Update a book
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBook) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    res.status(200).json(updatedBook);
  } catch (error) {
    const errorInfo = handleError(error, 'Error updating book');
    
    if (errorInfo.message === 'ISBN already exists') {
      res.status(400).json({ message: errorInfo.message });
    } else {
      res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
    }
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    
    if (!deletedBook) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    const errorInfo = handleError(error, 'Error deleting book');
    res.status(500).json({ message: errorInfo.message, error: errorInfo.details });
  }
};