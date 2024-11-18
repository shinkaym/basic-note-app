/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import AuthProvider from '../context/AuthProvider';
import ProtectedRoute from './ProtectedRoute';
import Error from '../pages/Error';
import NoteList from '../components/NoteList';
import Note from '../components/Note';
import { addNewNote, foldersLoader, noteLoader, notesLoader, updateNote } from '../utils';

const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Home />,
            loader: foldersLoader,
            children: [
              {
                path: `folders/:folderId`,
                element: <NoteList />,
                action: addNewNote,
                loader: notesLoader,
                children: [
                  {
                    path: `note/:noteId`,
                    element: <Note />,
                    action: updateNote,
                    loader: noteLoader,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
