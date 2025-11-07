import { createContext } from 'react';
import type {AuthContextType} from './authContext.tsx';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);