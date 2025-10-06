import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";

export const ContactUs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [height, setHeight] = useState<number>(700);
  const [alert, setAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  useEffect(() => {
    dispatch(routeChange('end'));
    setHeight(document.documentElement.clientHeight);
  }, [dispatch]);

  const dial = () => {
    const mobile = "9920111300";
    const mobile1 = "02269516677";

    const number = app.companyName === "NETMEDS" || app.companyName === "JIOMART"
      ? mobile1
      : mobile;

    try {
      // @ts-ignore
      if (window.JSBridge) {
        // @ts-ignore
        window.JSBridge.call(number);
      } else {
        window.open(`tel:${number}`, '_self');
      }
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const openMail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div
      className="max-w-[450px] text-left font-montserrat min-h-full bg-[#f2f0fb] mx-auto"
      style={{ height: `${height}px` }}
    >
      {/* Alert */}
      {alert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{alertMessage}</span>
          <button
            onClick={() => setAlert(false)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#f3f0fc] p-4">
        <div className="flex items-center justify-between">
          <div className="w-1/4 flex justify-start">
            <button
              onClick={goBack}
              className="cursor-pointer text-[#4328AE] p-0"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          <div className="w-1/2 flex justify-center">
            <img
              src={landingLogoBlue}
              alt="logo"
              className="w-36"
            />
          </div>

          <div className="w-1/4 flex justify-end">
            <button
              onClick={dial}
              className="cursor-pointer text-[#4328AE] p-0"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-fit px-4 pt-4">
        <div className="text-[#4328ae] text-base font-medium">
          <b>Contact Us</b>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-lg my-4 px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="my-auto h-fit">
              <div className="my-auto text-[#00000099] text-sm font-medium">
                <b>Support</b>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {/* Phone Button */}
              <button
                onClick={dial}
                className="bg-[#f7f5ff] p-2 rounded-full cursor-pointer hover:bg-[#e8e4ff] transition-colors"
              >
                <Phone size={21} className="text-[#4328AE]" />
              </button>
              
              {/* Email Button */}
              <button
                onClick={() => openMail('support@supermoney.in')}
                className="bg-[#f7f5ff] p-2 rounded-full cursor-pointer hover:bg-[#e8e4ff] transition-colors"
              >
                <Mail size={21} className="text-[#7E67DA]" />
              </button>
            </div>
          </div>
        </div>

        {/* Nodal Officer Card */}
        <div className="bg-white rounded-lg my-4 px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="my-auto h-fit w-10/12">
              <div className="my-auto text-[#00000099] text-sm font-medium">
                <b>Nodal Officer Mr. Akbar Shaikh</b>
              </div>
            </div>
            <div className="w-2/12 flex justify-end">
              {/* Email Button */}
              <button
                onClick={() => openMail('akbar.shaikh@supermoney.in')}
                className="bg-[#f7f5ff] p-2 rounded-full cursor-pointer hover:bg-[#e8e4ff] transition-colors ml-auto"
              >
                <Mail size={21} className="text-[#7E67DA]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};