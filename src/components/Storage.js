import React from 'react';

function Storage() {
  const idToken = localStorage.getItem('IdToken');
  const accessToken = localStorage.getItem('AccessToken');
  const refreshToken = localStorage.getItem('RefreshToken');

  return (
    <div>
      <h2>Storage Page</h2>
      <p><strong>IdToken:</strong> {idToken}</p>
      <p><strong>AccessToken:</strong> {accessToken}</p>
      <p><strong>RefreshToken:</strong> {refreshToken}</p>
    </div>
  );
}

export default Storage;
