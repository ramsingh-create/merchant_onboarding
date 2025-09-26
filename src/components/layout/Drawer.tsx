import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LogoLanding from '../../assets/images/logolanding.png';
import LogoBlue from '../../assets/images/landinglogoblue.png';
import HomeActive from '../../assets/images/homeactive.png';
import HomeInactive from '../../assets/images/homeinactive.png';
import HomeIAPurple from '../../assets/images/homeiapurple.png';
import DashboardActive from '../../assets/images/dashboardactive.png';
import DashboardInactive from '../../assets/images/dashboard.png';
import DashboardIAPurple from '../../assets/images/dashboardiapurple.png';
import RewardsActive from '../../assets/images/rewards.png';
import RewardsInactive from '../../assets/images/rewardsinactive.png';
import RewardsIAPurple from '../../assets/images/rewardsiapurple.png';
import SettingsActive from '../../assets/images/settings.png';
import SettingsInactive from '../../assets/images/settingsinactive.png';
import SettingsIAPurple from '../../assets/images/settingsiapurple.png';

const Drawer: React.FC = () => {
    const navigate = useNavigate();
    const [tabSelected, setTabSelected] = useState<'home' | 'dashboard' | 'rewards' | 'settings'>('home');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(true);
    const [height, setHeight] = useState(window.innerHeight);

    const [pageBackground, setPageBackground] = useState('#311b92');
    const [notificationColor, setNotificationColor] = useState('#FFFFFF');
    const [inActiveColor, setInActiveColor] = useState('#7E67DA');

    useEffect(() => {
        const userAgent = navigator.userAgent;
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
        setHeight(window.innerHeight);
    }, []);

    useEffect(() => {
        switch (tabSelected) {
            case 'home':
                navigate('/UpFrontLanding');
                setInActiveColor('#7E67DA');
                setPageBackground('#311b92');
                setNotificationColor('#FFFFFF');
                break;
            case 'dashboard':
                navigate('/DashBoard');
                setInActiveColor('#D1C4E9');
                setPageBackground('#FFFFFF');
                setNotificationColor('#4328AE');
                break;
            case 'rewards':
                navigate('/Rewards');
                setInActiveColor('#D1C4E9');
                setPageBackground('#f3f0fc');
                setNotificationColor('#4328AE');
                break;
            case 'settings':
                navigate('/Settings');
                setInActiveColor('#D1C4E9');
                setPageBackground('#FFFFFF');
                setNotificationColor('#4328AE');
                break;
        }
    }, [tabSelected, navigate]);

    return (
        <div
            className="min-h-screen font-montserrat text-left mx-auto"
            style={{ maxWidth: '450px', background: pageBackground }}
        >
            {alertVisible && (
                <div className="bg-red-500 text-white p-3 m-4 rounded">
                    {alertMessage}
                    <button className="float-right" onClick={() => setAlertVisible(false)}>×</button>
                </div>
            )}

            <div className="flex justify-between items-center p-4">
                <div className="w-1/4 text-right"></div>
                <div className="w-1/2 text-center">
                    <img src={tabSelected === 'home' ? LogoLanding : LogoBlue} alt="logo" className="w-[138px] mx-auto" />

                </div>
                <div className="w-1/4 text-right"></div>
            </div>

            <div
                className="overflow-y-auto"
                style={{ height: `${height}px`, background: pageBackground }}
            >
                <Outlet />
            </div>

            <div
                className={`fixed bottom-0 w-full flex justify-around items-center py-2 ${isMobile ? 'mobileCss' : ''}`}
                style={{ backgroundColor: tabSelected === 'home' ? '#4328AE' : '#F7F5FF', maxWidth: '450px' }}
            >
                {['home', 'dashboard', 'rewards', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setTabSelected(tab as any)}
                        className="flex flex-col items-center"
                    >
                        <img
                            src={
                                tabSelected === tab
                                    ? tab === 'home'
                                        ? HomeActive
                                        : tab === 'dashboard'
                                            ? DashboardActive
                                            : tab === 'rewards'
                                                ? RewardsActive
                                                : SettingsActive
                                    : tabSelected === 'home'
                                        ? tab === 'home'
                                            ? HomeActive
                                            : tab === 'dashboard'
                                                ? DashboardInactive
                                                : tab === 'rewards'
                                                    ? RewardsInactive
                                                    : SettingsInactive
                                        : tab === 'home'
                                            ? HomeIAPurple
                                            : tab === 'dashboard'
                                                ? DashboardIAPurple
                                                : tab === 'rewards'
                                                    ? RewardsIAPurple
                                                    : SettingsIAPurple
                            }
                            alt={tab}
                            className="w-6 h-6"
                        />
                        <span
                            className={`font-bold p-1 ${tabSelected === tab ? (tab === 'home' ? 'text-white' : 'text-[#4328AE]') : ''
                                }`}
                            style={{ color: inActiveColor }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Drawer;
