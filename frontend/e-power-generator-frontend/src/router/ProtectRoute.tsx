import React from 'react';
import PermissionDenied from '../pages/PermissionDenied'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext.tsx';



const ProtectRoute: React.FC = () => {
    const { user, isLoading } = useAuth();
    if (isLoading){
        return <div>Loading...</div>;
    }
    if (!user){
        return (<PermissionDenied />);
    }
    if(user.role != 'customer'){
        return <Outlet />;
    } else {
        return (<PermissionDenied />);
    };
};

export default ProtectRoute;