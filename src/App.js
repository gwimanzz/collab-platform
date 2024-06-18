import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch 대신 Routes 사용
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StoragePage from './pages/StoragePage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes> {/* Switch 대신 Routes 사용 */}
            <Route path="/" element={<HomePage />} /> {/* component 대신 element 사용 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/storage" element={<StoragePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
