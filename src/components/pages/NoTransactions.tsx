import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { ArrowLeft, Phone } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";
import noTransaction from "../../assets/images/notransaction.png";

export const NoTransactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [height, setHeight] = useState<number>(700);
  const [snackbar, setSnackbar] = useState<boolean>(false);

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
    navigate(-2);
  };

  const redirectToPayment = async () => {
    dispatch(routeChange('start'));

    const data = {
      customerId: app.customerID,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));

        if (res.successFlag) {
          const nameArr = res.url.split("=");
          const temp = nameArr[1].replace("&applicationId", "");

          const queryParams = new URLSearchParams({
            rp: temp,
            customerId: app.customerID || '',
          });
          navigate(`/TransactionHistory?${queryParams}`);
        } else {
          setSnackbar(true);
        }
      },
      failureCallBack: (error: any) => {
        console.log("display error ==", error);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('supermoney-service/generatePaymentIdV2', {}, data, options);
  };

  return (
    <div
      className="max-w-[450px] text-left font-montserrat min-h-full bg-white mx-auto"
      style={{ height: `${height}px` }}
    >
      {/* Header */}
      <div className="p-4">
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
      <div className="flex flex-col items-center justify-center h-[calc(100%-80px)]">
        <img
          src={noTransaction}
          alt="No transactions"
          className="mx-auto"
        />

        <div className="text-center mt-6">
          <h2 className="text-xl font-bold mb-3">
            No transaction<br />
            details found!
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Repay loans to view<br />
            transaction details
          </p>

          <button
            onClick={redirectToPayment}
            className="bg-[#7E67DA] text-white font-bold py-2 px-10 rounded-lg cursor-pointer normal-case hover:bg-[#6B56C9] transition-colors"
          >
            Repay
          </button>
        </div>
      </div>

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white border border-[#97C93E] rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
            <span className="text-gray-800">No loan to repay</span>
            <button
              onClick={() => setSnackbar(false)}
              className="text-[#7E67DA] font-medium hover:text-[#6B56C9]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};