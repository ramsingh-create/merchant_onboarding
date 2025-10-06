import React, { useState, useEffect } from 'react';
import logOutIcon from "../../assets/images/logout.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';



import { 
  ChevronRight, 
  X,
  User,
  FileText,
  DollarSign,
  Calculator,
  ShieldCheck,
  Info,
  Star,
  Phone,
  HelpCircle,
  LogOut
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [sheet, setSheet] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [displayName, setDisplayName] = useState('M');

  const loginId = app.loginId?.replace('+91', '') || '';

  useEffect(() => {
    dispatch(routeChange('end'));
    customerProfile();
  }, [dispatch]);

  const logOut = () => {
    try {
      // JSBridge.redirectToLogin(); // Uncomment if JSBridge is available
      navigate('/');
    } catch (err) {
      console.log(err);
      navigate('/');
    }
  };

  const redirectMyProfile = () => {
    navigate('/MyProfile');
  };

  const redirectSOA = () => {
    navigate('/SOA');
  };

  const redirectAboutUs = () => {
    navigate('/AboutUs');
  };

  const redirectCalculator = () => {
    navigate('/Calculator');
  };

  const redirectpolicy = () => {
    navigate('/PrivacyPolicy');
  };

  const redirectToPayment = () => {
    dispatch(routeChange('start'));

    const data = {
      customerId: +app.customerID!,
    };
    console.log(typeof localStorage.getItem("customerID"), "yash")

    const options = {
      successCallBack: (res: any) => {
        // const JSONData = response.data;
        dispatch(routeChange('end'));
        
        if (res.successFlag) {
          let nameArr = res.url.split("=");
          let temp = nameArr[1].replace("&applicationId", "");
        //   navigate('/TransactionHistory', {
        //     state: {
        //       rp: temp,
        //       customerId: app.customerID,
        //     },
        //   });
        const queryParams = new URLSearchParams({
            rp: temp,
            customerId: app.customerID || '',
        }).toString();
        navigate(`/TransactionHistory?${queryParams}`);
        
        } else {
          navigate('/NoTransactions');
        }
      },
      failureCallBack: (error: any) => {
        console.log("display  ==" + error);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('supermoney-service/generatePaymentIdV2', {}, data, options);
  };

  const redirectToContactUs = () => {
    navigate('/ContactUs');
  };

  const redirectToFaqList = () => {
    navigate('/FaqList');
  };

  const getRating = () => {
    dispatch(routeChange('start'));

    const request = {
      customerId: +app.customerID!,
      appType: 'INVOICE_FINANCING',
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        // const JSONData = response.data;
        if (res.rateExperience == null) {
          navigate('/SubmitFeedback');
        } else {
          navigate('/Feedback');
        }
      },
      failureCallBack: (error: any) => {
        console.log('display ==', error);
      },
    };

    makeAPIPOSTRequest('supermoney-service/user/feedback/get', {}, request, options);
  };

  const customerProfile = () => {
    dispatch(routeChange('start'));

    //payload (data)
    const request = {
      loginId: app.loginId,
      applicationId: +app.applicationId!,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        // const JSONData = response.data;

        if (res.errorMessage === "" || res.errorMessage === null) {
          const name = res.name;
          console.log("name  ===" + name.length);
          if (name.length > 0) {
            setUserName(name.split(" ")[0]);
          }
          setDisplayName(
            name
              .split(' ')
              .map((word: string) => word[0])
              .join('')
          );
        } else {
          setAlert(true);
          setAlertMessage(res.errorMessage);
        }
      },
      failureCallBack: (error: any) => {
        console.log('display ==', error);
      },
    };

    makeAPIPOSTRequest('/supermoney-service/customer/profile', {}, request, options);
  };

  const MenuItem: React.FC<{
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    showBorder?: boolean;
  }> = ({ icon, text, onClick, showBorder = true }) => (
    <div className="px-4 pt-4 cursor-pointer" onClick={onClick}>
      <div className="flex items-center cursor-pointer">
        <div className="flex items-center justify-center w-5 h-5 mr-3">
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-900 flex-grow">{text}</div>
        <ChevronRight className="w-5 h-5 text-[#7E67DA]" />
      </div>
      {showBorder && <hr className="mt-3 border-t border-[#D1C4E9]" />}
    </div>
  );

  return (
    <div className="max-w-[450px] mx-auto min-h-screen bg-white font-['Montserrat'] text-left">
      <div className="pb-36">
        {/* Alert */}
        {alert && (
          <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative">
            <button
              className="absolute top-0 right-0 p-2"
              onClick={() => setAlert(false)}
            >
              <X className="w-4 h-4" />
            </button>
            {alertMessage}
          </div>
        )}

        {/* Header */}
        <div className="px-6 ">
          <h1 className="text-xl font-bold text-[#4328AE]">Settings</h1>
        </div>

        {/* User Card */}
        <div className="mx-4 mt-5 bg-[#F7F5FF] rounded-xl shadow-md">
          <div className="p-4">
            <div className="flex items-center">
              <div className="w-1/4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-[#7E67DA] to-[#F08DFF]"
                >
                  <span className="text-white font-bold text-lg">{displayName}</span>
                </div>
              </div>
              <div className="w-3/4 pl-3">
                <div className="text-xs font-bold">Hello {userName}!</div>
                <div className="text-xs text-gray-600">{loginId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mx-4 mt-5 bg-white rounded-xl shadow-md">
          <MenuItem
            icon={<User className="w-4 h-4 text-[#7E67DA]" />}
            text="My Profile"
            onClick={redirectMyProfile}
          />
          
          <MenuItem
            icon={<FileText className="w-4 h-4 text-[#7E67DA]" />}
            text="SOA"
            onClick={redirectSOA}
          />
          
          <MenuItem
            icon={<DollarSign className="w-4 h-4 text-[#7E67DA]" />}
            text="Transaction"
            onClick={redirectToPayment}
          />
          
          <MenuItem
            icon={<Calculator className="w-4 h-4 text-[#7E67DA]" />}
            text="Loan Calculator"
            onClick={redirectCalculator}
          />
          
          <MenuItem
            icon={<ShieldCheck className="w-4 h-4 text-[#7E67DA]" />}
            text="Policies"
            onClick={redirectpolicy}
          />
          
          <MenuItem
            icon={<Info className="w-4 h-4 text-[#7E67DA]" />}
            text="About Us"
            onClick={redirectAboutUs}
          />
          
          <MenuItem
            icon={<Star className="w-4 h-4 text-[#7E67DA]" />}
            text="Rate Us"
            onClick={getRating}
          />
          
          <MenuItem
            icon={<Phone className="w-4 h-4 text-[#7E67DA]" />}
            text="Contact Us"
            onClick={redirectToContactUs}
          />
          
          <MenuItem
            icon={<HelpCircle className="w-4 h-4 text-[#7E67DA]" />}
            text="FAQ"
            onClick={redirectToFaqList}
          />
          
          <div className="px-4 pt-4 cursor-pointer" onClick={() => setSheet(true)}>
            <div className="flex items-center cursor-pointer">
              <div className="flex items-center justify-center w-5 h-5 mr-3">
                <LogOut className="w-4 h-4 text-[#7E67DA]" />
              </div>
              <div className="text-sm font-medium text-gray-900 flex-grow">Logout</div>
              <ChevronRight className="w-5 h-5 text-[#7E67DA]" />
            </div>
            <hr className="mt-3 border-t border-white" />
          </div>
        </div>
      </div>

      {/* Logout Bottom Sheet */}
      {sheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 max-w-[450px] mx-auto">
          <div className="w-full bg-[#F7F5FF] rounded-t-2xl p-5">
            <div className="text-right mb-2">
              <button
                onClick={() => setSheet(false)}
                className="text-[#9C9BA1] hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-4">
              <img 
                src={logOutIcon} 
                alt="Logout" 
                className="w-16 h-16 mx-auto mb-4"
              />
              <div className="text-lg text-[#636266]">
                Are you sure you want to<br />
                logout?
              </div>
            </div>
            
            <div className="flex gap-4 mt-5">
              <button
                onClick={() => setSheet(false)}
                className="flex-1 py-2 border border-[#7E67DA] text-[#7E67DA] font-bold rounded-lg hover:bg-[#7E67DA] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logOut}
                className="flex-1 py-2 bg-[#7E67DA] text-white font-bold rounded-lg hover:bg-[#6B5BB5] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;