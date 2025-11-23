// src/router/mobilePCRoute.tsx

import React from 'react';
import { Grid } from 'antd';

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop';
type DeviceSelectProps = {
    deviceType: DeviceType[];
    children?: React.ReactNode;
};

const DeviceContext = React.createContext<DeviceType>('desktop');
const { useBreakpoint } = Grid;
export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const screens = useBreakpoint();
    var deviceType: DeviceType = 'desktop';
    if (!screens.sm) {
        deviceType = 'mobile';
    } else if (!screens.md) {
        deviceType = 'tablet';
    } else if (!screens.lg) {
        deviceType = 'laptop';
    } else {
        deviceType = 'desktop';
    }

    return (
        <DeviceContext.Provider value={deviceType}>
            {children}
        </DeviceContext.Provider>
    );
};

export const useDeviceType = () => {
    return React.useContext(DeviceContext);
};

export const DeviceSelect: React.FC<DeviceSelectProps> = ({ deviceType, children }) => {
    const currentDevice = useDeviceType();
    if (deviceType.includes(currentDevice)) {
        return <>{children}</>;
    }
    return null;
};