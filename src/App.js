import React, { useState } from 'react';
import './styles/App.css';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyPage from './pages/VerifyPage';
import StoragePage from './pages/StoragePage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [email, setEmail] = useState('');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} setEmail={setEmail} />;
      case 'verify':
        return <VerifyPage email={email} setCurrentPage={setCurrentPage} />;
      case 'storage':
        return <StoragePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <div className="App">
        <NavBar setCurrentPage={setCurrentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
