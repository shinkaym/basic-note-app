import { Button, Typography } from '@mui/material';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../context/AuthProvider';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { graphqlRequest } from '../utils/request';

const Login = () => {
  const auth = getAuth();
  const { user } = useContext(AuthContext);

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const {
      // eslint-disable-next-line no-unused-vars
      user: { uid, displayName },
    } = await signInWithPopup(auth, provider);
    
    await graphqlRequest({
      query: `mutation register($uid: String, $name: String!) {
        register(uid: $uid, name: $name) {
          uid
          name
          }
          }`,
      variables: {
        uid,
        name: displayName,
      },
    });
  };

  if (user?.uid) {
    return <Navigate to={'/'} />;
  }

  return (
    <>
      <Typography
        variant='h5'
        sx={{
          marginBottom: '10px',
        }}
      >
        Welcome to Note App
      </Typography>
      <Button variant='outlined' onClick={handleLoginWithGoogle}>
        Login with Google
      </Button>
    </>
  );
};

export default Login;
