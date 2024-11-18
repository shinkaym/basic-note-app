/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  if(!localStorage.getItem('accessToken')) {
    return <Navigate to={'/login'}/>
  }
  return <Outlet />
}

export default ProtectedRoute