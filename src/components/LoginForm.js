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
      alert('로그인 성공');
      login(); // 로그인 상태 업데이트
      // 필요한 경우 추가적인 처리 (예: 페이지 이동)
    } catch (error) {
      alert('로그인 실패');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          이메일:
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
