import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // AuthProvider에서 생성한 AuthContext를 불러옵니다.

const NavBar = ({ setCurrentPage }) => {
  const { isLoggedIn, logout } = useContext(AuthContext); // AuthContext에서 필요한 상태와 함수를 가져옵니다.

  return (
    <nav>
      <ul>
        <li>
          <button onClick={() => setCurrentPage('home')}>Home</button>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <button onClick={() => setCurrentPage('storage')}>Storage</button>
              
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <button onClick={() => setCurrentPage('login')}>Login</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('signup')}>Sign Up</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
