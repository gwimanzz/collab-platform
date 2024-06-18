import React, { useState, useContext } from 'react';
import { loginToLambda } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginToLambda(username, password);
      login();
      alert('로그인 성공');
    } catch (error) {
      alert('로그인 실패');
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
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginForm;
