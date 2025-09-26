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
import Drawer from './components/layout/Drawer';
import DashBoard from './components/pages/DashBoard';
import Rewards from './components/pages/Rewards';
import Settings from './components/pages/Settings';
import MyProfile from './components/pages/MyProfile';
import SOA from './components/pages/SOA';

function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();


  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Loader />
      <Router>
        <Routes>  
          <Route path='/' element={<Login />} />
          <Route path='/MyProfile' element={<MyProfile />} />
          <Route path='/SOA' element={<SOA />} />
          <Route element={<Drawer />}>
            <Route path='/DashBoard' element={<DashBoard />} />
            <Route path='/Rewards' element={<Rewards />} />
            <Route path='/Settings' element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
