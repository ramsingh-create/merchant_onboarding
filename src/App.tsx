import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useDispatch } from 'react-redux';
import { toggleTheme } from './store/themeSlice'
import ThemeToggle from './components/layout/ThemeToggle';
import { UpFrontLanding } from './components/pages/UpFrontLanding';
import Loader from './components/pages/Loader';
import { LoginWithPin } from './components/pages/LoginWithPin';
import Drawer from './components/layout/Drawer';
import DashBoard from './components/pages/DashBoard';
import Rewards from './components/pages/Rewards';
import Settings from './components/pages/Settings';
import MyProfile from './components/pages/MyProfile';
import SOA from './components/pages/SOA';
import { NoTransactions } from './components/pages/NoTransactions';
import Calculator from './components/pages/Calculator';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import { AboutUs } from './components/pages/AboutUs';
import { SubmitFeedback } from './components/pages/SubmitFeedback';
import { Feedback } from './components/pages/Feedback';
import { ContactUs } from './components/pages/ContactUs';
import { FaqList } from './components/pages/FaqList';
import { TransactionHistory } from './components/pages/TransactionHistory';
import { AllTransactions } from './components/pages/AllTransactions';
import { BusinessDetails } from './components/pages/BusinessDetails';
import CommonHeader from './components/layout/CommonHeader';
import { ChooseFinancePlan } from './components/pages/ChooseFinancePlan';
import { RecentInvoices } from './components/pages/RecentInvoice';
import {PanDetails} from './components/pages/PanDetails';
import { CompanyBasicDetails } from './components/pages/CompanyBasicDetails';
import { CompanyBusinessDetails } from './components/pages/CompanyBusinessDetails';
function App() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();


  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Loader />
      <Router>
        <Routes>

          <Route path='/' element={<LoginWithPin />} />
          <Route path='/MyProfile' element={<MyProfile />} />
          <Route path='/SOA' element={<SOA />} />
          <Route path='/Calculator' element={<Calculator />} />
          <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
          <Route path='/NoTransactions' element={<NoTransactions />} />
          <Route path='/TransactionHistory' element={<TransactionHistory />} />
          <Route path='/AllTransactions' element={<AllTransactions />} />
          <Route path='/AboutUs' element={<AboutUs />} />
          <Route path='/SubmitFeedback' element={<SubmitFeedback />} />
          <Route path='/Feedback' element={<Feedback />} />
          <Route path='/ContactUs' element={<ContactUs />} />
          <Route path='/FaqList' element={<FaqList />} />
          <Route path='/ChooseFinancePlan' element={<ChooseFinancePlan />} />
          <Route path='/RecentInvoice' element={<RecentInvoices />} />
          <Route path='/' element={<Drawer />}>
            <Route path='UpFrontLanding' element={<UpFrontLanding />} /> {/* Remove leading slash */}
            <Route path='DashBoard' element={<DashBoard />} />
            <Route path='Rewards' element={<Rewards />} />
            <Route path='Settings' element={<Settings />} /> {/* Remove leading slash */}
          </Route>
          <Route path='/' element={<CommonHeader />}>
            <Route path='/PanDetails' element={<PanDetails/>} />
            <Route path='/BusinessDetails' element={<BusinessDetails/>} />
            <Route path='/CompanyBasicDetails' element={<CompanyBasicDetails/>} />
            <Route path='/CompanyBusinessDetails' element={<CompanyBusinessDetails/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
