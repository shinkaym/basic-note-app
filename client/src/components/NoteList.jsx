import { Box, Card, CardContent, Grid, IconButton, List, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLoaderData, useNavigate, useParams, useSubmit } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import moment from 'moment';

const NoteList = () => {
  const { noteId, folderId } = useParams();
  const [activeNoteId, setActiveNoteId] = useState(noteId);
  const { folder } = useLoaderData()

  const submit = useSubmit()
  const navigate = useNavigate();

  useEffect(() => {
    if (noteId) {
      setActiveNoteId(noteId);
      return;
    }

    if (folder?.notes?.[0]) {
      navigate(`note/${folder.notes[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, folder.notes]);

  const handleAddNewNote = () => {
    submit({
      content: '',
      folderId
    }, {
      method: 'POST',
      action: `/folders/${folderId}`
    })
  }

  return (
    <Grid container height={'100%'}>
      <Grid
        item
        xs={4}
        sx={{
          width: '100%',
          height: '100%',
          maxWidth: 360,
          bgcolor: '#f0ebe3',
          overflowY: 'auto',
          padding: '10px',
          textAlign: 'left',
        }}
      >
        <List
          subheader={
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Typography sx={{ fontWeight: 'bold' }}>Notes</Typography>
              <Tooltip title="Add Note" onClick={handleAddNewNote}>
                <IconButton size='small'>
                  <NoteAddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        >
          {folder.notes.map(({ id, content, updatedAt }) => {
            return (
              <Link key={id} to={`note/${id}`} style={{ textDecoration: 'none' }} onClick={() => setActiveNoteId(id)}>
                <Card sx={{ mb: '5px', backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null }}>
                  <CardContent
                    sx={{
                      '&:last-child': { pb: '10px' },
                      padding: '10px',
                    }}
                  >
                    <div
                      style={{ fontSize: 14, fontWeight: 'bold' }}
                      dangerouslySetInnerHTML={{ __html: `${content.substring(0, 30) || 'Empty'}` }}
                    />
                    <Typography sx={{ fontSize: '10px' }}>
                      {moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={8}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default NoteList;
