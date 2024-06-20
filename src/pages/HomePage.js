import React from 'react';
import logo from '../logo.svg';
import '../styles/App.css';

const HomePage = () => {
  return (
    <div className="HomePage">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/pages/HomePage.js</code> and save to reload.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default HomePage;
