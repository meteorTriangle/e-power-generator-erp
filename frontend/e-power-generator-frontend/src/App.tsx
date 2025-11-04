// src/App.tsx

import React from 'react'; // 1. 匯入 React
import { Routes, Route } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/InventoryList'; 
import SiteList from './pages/SiteList'; 
import LoginPage from './pages/Login';
import CommonLayout from './layouts/CommonLayout';
import RegisterPage from './pages/register';
import ProtectRoute from './router/ProtectRoute';
import Home from './pages/home';
import About from './pages/about';
import ForgotPasswordPage from './pages/ForgotPassword';


// 2. 使用 React.FC
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CommonLayout />} >
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/admin/machine-manager" element={<InventoryList />} />
            <Route path="/admin/site-manager" element={<SiteList />} />
            
          </Route>
        </Route>
      </Route>

      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}

export default App;