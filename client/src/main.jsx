import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import '@fontsource/roboto';
import './index.css';

import routes from './routes';
import { Container } from '@mui/material';
import './firebase/config'

createRoot(document.getElementById('root')).render(
    <Container maxWidth='lg' sx={{ textAlign: 'center', marginTop: '50px' }}>
      <RouterProvider router={routes} />
    </Container>
);
