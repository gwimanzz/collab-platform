import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Element }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
