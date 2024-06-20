import React from 'react';
import Verify from '../components/Verify'; // Verify로 수정

function SignUpPage({ setCurrentPage, setEmail }) {
  return (
    <div>
      <Verify setCurrentPage={setCurrentPage} /> {/* Verify 컴포넌트를 인클루드합니다 */}
    </div>
  );
}

export default SignUpPage;
