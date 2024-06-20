import React from 'react';
import SignUpForm from '../components/SignUpForm';
import Verify from '../components/Verify';

function SignUpPage({ setCurrentPage, setEmail }) {
  const handleSetCurrentPage = (page, data) => {
    setCurrentPage(page, data);
  };

  return (
    <div>
      <SignUpForm setCurrentPage={handleSetCurrentPage} setEmail={setEmail} />
    </div>
  );
}

export default SignUpPage;
