import { fakeData } from '../fakeData/index.js';
import Folder from '../models/folder.model.js';
import Author from '../models/author.model.js';
import Note from '../models/note.model.js';
import { GraphQLScalarType } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import Notification from '../models/notification.model.js';

const pubsub = new PubSub();

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  Query: {
    folders: async (parent, args, context) => {
      // return fakeData.folders;
      const folders = await Folder.find({
        authorId: context.uid,
      }).sort({
        updatedAt: 'desc',
      });
      return folders;
    },
    folder: async (parent, args) => {
      // return fakeData.folders.find((folder) => folder.id === folderId);
      return await Folder.findById(args.folderId);
    },
    note: async (parent, args) => {
      return await Note.findById(args.noteId);
    },
  },
  Folder: {
    author: async (parent, args) => {
      const authorId = parent.authorId;
      // return fakeData.authors.find((author) => author.id === authorId);
      const author = await Author.findOne({
        uid: authorId,
      });

      return author;
    },
    notes: async (parent, args) => {
      const folderId = parent.id;
      return await Note.find({
        folderId,
      }).sort({
        updatedAt: 'desc',
      });
    },
  },
  Mutation: {
    addNote: async (parent, args, context) => {
      const newNote = new Note({ ...args });
      await newNote.save();
      return newNote;
    },
    updateNote: async (parent, args) => {
      const noteId = args.id;
      return await Note.findByIdAndUpdate(noteId, args);
    },
    addFolder: async (parent, args, context) => {
      const newFolder = new Folder({ ...args, authorId: context.uid });
      await newFolder.save();
      pubsub.publish('FOLDER_CREATED', {
        folderCreated: {
          message: 'A new folder created',
        },
      });
      return newFolder;
    },
    register: async (parent, args) => {
      const foundUser = await Author.findOne({ uid: args.uid });
      if (!foundUser) {
        const newUser = new Author(args);
        await newUser.save();
        return newUser;
      }
      return foundUser;
    },
    pushNotification: async (parent, args) => {
      const newNotification = new Notification(args);

      pubsub.publish('PUSH_NOTIFICATION', {
        notification: {
          message: args.content,
        },
      });

      await newNotification.save();
      return { message: 'SUCCESS'}
    }
  },
  Subscription: {
    folderCreated: {
      subscribe: () => pubsub.asyncIterableIterator(['FOLDER_CREATED', 'NOTE_CREATED']),
    },
    notification: {
      subscribe: () => pubsub.asyncIterableIterator(['PUSH_NOTIFICATION']),
    },
  },
};
