import { Schema, model } from 'mongoose';

const authorSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Author = model('Author', authorSchema);
export default Author;
