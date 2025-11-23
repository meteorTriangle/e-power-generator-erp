// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx' // 確保副檔名正確

import 'antd/dist/reset.css';
import './index.css'
import AuthProvider from './context/authContext.tsx';
import { DeviceProvider } from './router/mobilePCRoute';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DeviceProvider>
          <App />
        </DeviceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)