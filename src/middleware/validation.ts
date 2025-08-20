import { Request, Response, NextFunction } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

export const validateBook = (req: Request, res: Response, next: NextFunction): void => {
  const errors: ValidationError[] = [];
  const { title, author, genre, isbn, description, copies } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!author || typeof author !== 'string' || author.trim().length === 0) {
    errors.push({ field: 'author', message: 'Author is required' });
  }

  if (!genre || typeof genre !== 'string' || genre.trim().length === 0) {
    errors.push({ field: 'genre', message: 'Genre is required' });
  }

  if (!isbn || typeof isbn !== 'string' || isbn.trim().length === 0) {
    errors.push({ field: 'isbn', message: 'ISBN is required' });
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (copies === undefined || copies === null || typeof copies !== 'number' || copies < 0) {
    errors.push({ field: 'copies', message: 'Copies must be a non-negative integer' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateBorrow = (req: Request, res: Response, next: NextFunction): void => {
  const errors: ValidationError[] = [];
  const { bookId, quantity, dueDate } = req.body;

  if (!bookId || typeof bookId !== 'string' || bookId.trim().length === 0) {
    errors.push({ field: 'bookId', message: 'Book ID is required' });
  }

  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || quantity < 1) {
    errors.push({ field: 'quantity', message: 'Quantity must be at least 1' });
  }

  if (!dueDate || isNaN(Date.parse(dueDate))) {
    errors.push({ field: 'dueDate', message: 'Due date must be a valid date' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};