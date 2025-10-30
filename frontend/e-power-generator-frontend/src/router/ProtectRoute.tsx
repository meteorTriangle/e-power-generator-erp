import React from 'react';
import PermissionDenied from '../pages/PermissionDenied'
import { Outlet, Link, useLocation } from 'react-router-dom';



const ProtectRoute: React.FC = () => {
  if(!localStorage.getItem('role') || localStorage.getItem('role') != 'admin'){
    return (<PermissionDenied />);
  };
  return <Outlet />
};

export default ProtectRoute;