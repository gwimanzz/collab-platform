import React, { useState } from 'react';
import { signUpToLambda } from '../api/auth';

function SignUpForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signUpToLambda(username, password);
      alert('회원 가입 성공');
    } catch (error) {
      alert('회원 가입 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          사용자 이름:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          비밀번호:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <button type="submit">회원 가입</button>
    </form>
  );
}

export default SignUpForm;
