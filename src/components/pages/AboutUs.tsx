import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { ArrowLeft, Phone } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";
import aboutUsImage from "../../assets/images/aboutus.png";

export const AboutUs = () => {
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
      JSBridge.call(Number);
      // // Assuming JSBridge is available in your environment
      // // @ts-ignore
      // if (window.JSBridge) {
      //   // @ts-ignore
      //   window.JSBridge.call(number);
      // } else {
      //   window.open(`tel:${number}`, '_self');
      // }
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="max-w-[450px] text-left font-montserrat min-h-full bg-[#f2f0fb] mx-auto"
      style={{ height: `${height}px` }}
    >
      {/* Alert - You can implement this with your preferred alert/notification library */}
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
          {/* Back Button */}
          <div className="w-1/4 flex justify-start">
            <button
              onClick={goBack}
              className="cursor-pointer text-[#4328AE] p-0"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="w-1/2 flex justify-center">
            <img
              src={landingLogoBlue}
              alt="logo"
              className="w-36"
            />
          </div>

          {/* Phone Button */}
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
      <div className="h-auto pb-12 p-5">
        {/* Title */}
        <h1 className="text-left leading-tight text-[32px] text-[#423f6f] font-normal">
          About <span className="font-bold">Supermoney</span>
        </h1>

        {/* Image */}
        <img 
          src={aboutUsImage} 
          alt="About Supermoney"
          className="w-full mt-9"
        />

        {/* Description */}
        <div className="mt-8 text-justify leading-[1.3] text-sm text-[#423f6f] font-semibold">
          Supermoney is a trust worthy digital working capital platform for large,
          medium & small businesses. We collaborate with renowned brands in
          industries such as steel, automotive and auto parts, batteries, tyres,
          electronics, consumer goods, FMCG, pharmaceuticals to provide tailored
          payments and finance solutions for their supply chain ecosystem.
        </div>
      </div>
    </div>
  );
};