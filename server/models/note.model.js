import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    content: {
      type: String,
    },
    folderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = model('Note', noteSchema);
export default Note;
