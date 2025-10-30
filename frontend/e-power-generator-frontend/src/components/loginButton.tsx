import { Link } from 'react-router-dom';
import {
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { IsLogin } from '../services/authService';

const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    window.location.href = '/';
}

export const LoginButton: any = IsLogin() ? (
    {
        label: <Link to="logout()"> <LogoutOutlined /> 登出</Link>,
        key: '/logout',
    }
) : (
    {
        label: <Link to="/login"> <LoginOutlined /> 登入 </Link>,
        key: '/login',

    }
);

// export default LoginButton;