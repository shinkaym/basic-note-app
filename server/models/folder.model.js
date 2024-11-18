import { Schema, model } from 'mongoose';

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Folder = model('Folder', folderSchema);
export default Folder
