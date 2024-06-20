import React, { createContext, useState} from 'react';

// AuthContext 생성
export const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로컬 스토리지에서 토큰이 존재하면 로그인 상태로 설정
  useState(() => {
    const idToken = localStorage.getItem('IdToken');
    const accessToken = localStorage.getItem('AccessToken');
    const refreshToken = localStorage.getItem('RefreshToken');
    console.log(idToken)
    if (idToken && accessToken && refreshToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('IdToken');
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};