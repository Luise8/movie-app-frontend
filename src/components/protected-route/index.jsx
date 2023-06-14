import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import { PropTypes } from 'prop-types';

function ProtectedRoute({ children }) {
  const { user } = useUserAuth();
  const isObjectEmpty = (objectName) => (
    objectName
      && Object.keys(objectName).length === 0
      && objectName.constructor === Object
  );

  if (isObjectEmpty(user)) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
