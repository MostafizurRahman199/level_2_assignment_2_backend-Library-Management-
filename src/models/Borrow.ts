import mongoose, { Document, Schema } from 'mongoose';
import { IBorrow } from '../types';

// Extend the Document interface with IBorrow properties
export interface IBorrowModel extends Document, Omit<IBorrow, '_id' | 'bookId'> {
  _id: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
}

const BorrowSchema: Schema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    dueDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBorrowModel>('Borrow', BorrowSchema);