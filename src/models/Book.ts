import mongoose, { Document, Schema } from 'mongoose';
import { IBook } from '../types';

// Extend the Document interface with IBook properties
export interface IBookModel extends Document, Omit<IBook, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    copies: {
      type: Number,
      required: true,
      min: 0
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Update availability based on copies
BookSchema.pre('save', function (next) {
  this.available = this.copies > 0;
  next();
});

export default mongoose.model<IBookModel>('Book', BookSchema);