// CommonHeader.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { Phone } from 'lucide-react';
import LogoBlue from '../../assets/images/landinglogoblue.png';

const CommonHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);
  
  const [height, setHeight] = useState(window.innerHeight);
  const [pageBackground, setPageBackground] = useState('#f2f0fb');

  // Phone numbers based on company
  const mobile = '9920111300';
  const mobile1 = '02269516677';

  useEffect(() => {
    dispatch(routeChange('end'));
    setHeight(document.documentElement.clientHeight);

    // Handle resize
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const dial = () => {
    const number = app.companyName === 'NETMEDS' || app.companyName === 'JIOMART' 
      ? mobile1 
      : mobile;
    
    try {
      // For native bridge (similar to JSBridge.call)
      if ((window as any).JSBridge) {
        (window as any).JSBridge.call(number);
      } else {
        window.open(`tel:${number}`, '_self');
      }
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  return (
    <div 
      className="max-w-[450px] mx-auto min-h-screen text-left font-montserrat bg-white"
      style={{ background: pageBackground }}
    >
      <div className="h-auto">
        <div 
          className="overflow-y-auto"
          style={{ height: `${height}px`, background: pageBackground }}
        >
          {/* Header Row */}
          <div className="flex items-center p-4">
            {/* Left section - empty but maintains layout */}
            <div className="w-1/4 text-left cursor-pointer">
              {/* You can add back button or menu icon here if needed */}
            </div>
            
            {/* Center section - Logo */}
            <div className="w-1/2 text-center">
              <img 
                src={LogoBlue} 
                alt="logo" 
                className="w-[140px] mx-auto"
              />
            </div>
            
            {/* Right section - Phone icon */}
            <div 
              className="w-1/4 text-right cursor-pointer" 
              onClick={dial}
            >
              <Phone 
                className="text-[#4328ae] p-0 inline-block" 
                size={20}
                fill={'#4328ae'}
              />
            </div>
          </div>

          {/* Page Content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CommonHeader;