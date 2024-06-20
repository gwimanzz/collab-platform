// SignUpForm.jsx
import React, { useState } from 'react';
import { signUpToLambda } from '../api/auth';

const SignUpForm = ({ setCurrentPage }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    phone_number: '',
    nickname: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      // 전화번호 앞에 +가 없으면 추가
      const formattedPhoneNumber = form.phone_number.startsWith('+') ? form.phone_number : `+${form.phone_number}`;
  
      await signUpToLambda(form.email, form.password, formattedPhoneNumber, form.nickname);

      // 이메일을 로컬 스토리지에 저장
      localStorage.setItem('signedUpEmail', form.email);
      
      setCurrentPage('verify'); // Verify 페이지로 이동
      alert('회원 가입 성공');
    } catch (error) {
      console.error('회원 가입 실패:', error.message);
      alert('회원 가입 실패');
    }
  };
  

  return (
    <div className="SignUpPage">
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSignUp}>
        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Nickname:
          <input type="text" name="nickname" value={form.nickname} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
