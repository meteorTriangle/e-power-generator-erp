import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserInfo from '../pages/UserInfo';
import GeneratorRentForm from '../pages/GeneratorRentForm';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'userinfo',
        element: <UserInfo />,
      },
      {
        path: 'rental',
        element: <GeneratorRentForm />,
      },
      // 可以在這裡添加更多路由
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
