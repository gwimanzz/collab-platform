// Verify.jsx
import React, { useState, useEffect } from 'react';
import { verifyEmailCode } from '../api/auth';

const Verify = ({ setCurrentPage }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [signedUpEmail, setSignedUpEmail] = useState('');

  useEffect(() => {
    // 로컬 스토리지에서 저장된 이메일 가져오기
    const email = localStorage.getItem('signedUpEmail');
    if (email) {
      setSignedUpEmail(email);
    }
  }, []);

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      // 로컬 스토리지에 인증 코드 저장
      localStorage.setItem('verificationCode', verificationCode);
      // API 호출을 통해 이메일 코드를 확인
      await verifyEmailCode();
      alert('이메일 인증 성공');
      setCurrentPage('success'); // 인증 성공 후의 페이지로 이동 (예: 로그인 페이지)
    } catch (error) {
      console.error('이메일 인증 실패:', error.message);
      alert('이메일 인증 실패');
    }
  };

  return (
    <div className="VerifyPage">
      <h1>Verify Email</h1>
      <p>다음 이메일로 전송된 인증 코드 6자리를 입력해주세요: <strong>{signedUpEmail}</strong></p>
      <form onSubmit={handleVerification}>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증 코드"
          required
        />
        <button type="submit">인증 확인</button>
      </form>
    </div>
  );
};

export default Verify;