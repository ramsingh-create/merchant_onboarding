import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { ArrowLeft, Phone, ChevronLeft } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";
import greatSubmitted from "../../assets/images/greatsubmitted.png";
import goodSubmitted from "../../assets/images/goodsubmitted.png";
import okaySubmitted from "../../assets/images/okaysubmitted.png";
import badSubmitted from "../../assets/images/badsubmitted.png";
import terribleSubmitted from "../../assets/images/terriblesubmitted.png";

export const Feedback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [height, setHeight] = useState<number>(700);
  const [alert, setAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  useEffect(() => {
    dispatch(routeChange('end'));
    setHeight(document.documentElement.clientHeight);
    getRating();
  }, [dispatch]);

  const dial = () => {
    const mobile = "9920111300";
    const mobile1 = "02269516677";

    const number = app.companyName === "NETMEDS" || app.companyName === "JIOMART"
      ? mobile1
      : mobile;

    try {
      // @ts-ignore
      window.JSBridge.call(number);
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const getRating = () => {
    dispatch(routeChange('start'));

    const data = {
      customerId: app.customerID,
      appType: "INVOICE_FINANCING",
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        setSelectedRating(res.rateExperience);
      },
      failureCallBack: (error: any) => {
        console.log("display error ==", error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('supermoney-service/user/feedback/get', {}, data, options);
  };

  const redirectToFeedback = () => {
    navigate('/SubmitFeedback');
  };

  const redirectToHome = () => {
    navigate('/UpFrontLanding');
  };

  const getFeedbackImage = () => {
    switch (selectedRating) {
      case 'GREAT':
        return greatSubmitted;
      case 'GOOD':
        return goodSubmitted;
      case 'OKAY':
        return okaySubmitted;
      case 'BAD':
        return badSubmitted;
      case 'TERRIBLE':
        return terribleSubmitted;
      default:
        return greatSubmitted; // Default image
    }
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
      <div className="text-center h-fit mx-auto">
        <div className="mt-[0px]">
          <img
            src={getFeedbackImage()}
            alt="Feedback submitted"
            className="mx-auto"
          />
          <br />
          <h2 className="text-[#7e67da] text-xl font-bold mt-6">
            Your Feedback<br />Submitted
          </h2>
          <div className="mt-9 text-[#616064] text-base px-4">
            We appreciate you sending us your <br />feedback and we value it
            immensely
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 w-full max-w-[450px] text-center bg-[#f2f0fb] py-3 mt-5">
        <div className="mx-9 mb-3 max-w-[450px]">
          <button
            onClick={redirectToFeedback}
            className="w-full bg-[#7E67DA] text-white font-bold py-3 rounded-lg cursor-pointer normal-case hover:bg-[#6B56C9] transition-colors"
          >
            Submit Another Feedback
          </button>
        </div>
        
        <button
          onClick={redirectToHome}
          className="flex items-center justify-center mx-auto px-8 py-4 cursor-pointer w-fit"
        >
          <ChevronLeft className="text-[#7e67da] mr-1" size={20} />
          <span className="text-sm text-[#4328ae] font-bold">
            Back To Homepage
          </span>
        </button>
      </div>
    </div>
  );
};