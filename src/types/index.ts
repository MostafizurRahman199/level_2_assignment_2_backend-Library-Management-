import { Types } from 'mongoose';

export interface IBook {
  _id?: Types.ObjectId;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBorrow {
  _id?: Types.ObjectId;
  bookId: Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BorrowSummary {
  bookId: Types.ObjectId;
  title: string;
  isbn: string;
  totalQuantity: number;
}