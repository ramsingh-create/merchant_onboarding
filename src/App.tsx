import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useDispatch } from 'react-redux';
import { toggleTheme } from './store/themeSlice'
import ThemeToggle from './components/layout/ThemeToggle';
import { Login } from './components/pages/Login';
import Loader from './components/pages/Loader';

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();


  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Loader />
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
