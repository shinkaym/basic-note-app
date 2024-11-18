import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = model('Notification', notificationSchema);
export default Notification;
