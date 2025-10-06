import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { ArrowLeft, Phone } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";
import greatImage from "../../assets/images/great.png";
import goodImage from "../../assets/images/good.png";
import okayImage from "../../assets/images/okay.png";
import badImage from "../../assets/images/bad.png";
import terribleImage from "../../assets/images/terrible.png";

interface FeedbackOption {
  id: number;
  label: string;
  value: string;
  color: string;
  image: string;
  chipList: string[];
  defaultChip: string[];
}

export const SubmitFeedback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [height, setHeight] = useState<number>(700);
  const [alert, setAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [selected, setSelected] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chipList, setChipList] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');

  const feedbackOptions: FeedbackOption[] = [
    {
      id: 5,
      label: 'Great',
      value: 'GREAT',
      color: '#97c93e',
      image: greatImage,
      chipList: ['Awesome', 'Fast Processing', 'Feature', 'User Experience', 'Quick Disbursal', 'Others'],
      defaultChip: ['Awesome']
    },
    {
      id: 4,
      label: 'Good',
      value: 'GOOD',
      color: '#ffcf02',
      image: goodImage,
      chipList: ['Seamless', 'User Experience', 'Feature', 'Fast Processing', 'Rewards', 'Others'],
      defaultChip: ['Seamless']
    },
    {
      id: 3,
      label: 'Okay',
      value: 'OKAY',
      color: '#e59d2b',
      image: okayImage,
      chipList: ['Confusing', 'Bugs', 'Not Seamless', 'Absence of Feature', 'Others'],
      defaultChip: ['Confusing']
    },
    {
      id: 2,
      label: 'Bad',
      value: 'BAD',
      color: '#d34927',
      image: badImage,
      chipList: ['Not User Friendly', 'Non-Satisfactory Support', 'Payment Dispute', 'Delay Processing', 'Bugs', 'Others'],
      defaultChip: ['Not User Friendly']
    },
    {
      id: 1,
      label: 'Terrible',
      value: 'TERRIBLE',
      color: '#eb3134',
      image: terribleImage,
      chipList: ['Not Responsive', 'Payment Dispute', 'Delay in Approval', 'Others'],
      defaultChip: ['Not Responsive']
    }
  ];

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
      // @ts-ignore - JSBridge might be available in your environment
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

  const handleRatingSelect = (option: FeedbackOption) => {
    setSelected(option.id);
    setSelectedRating(option.value);
    setChipList(option.chipList);
    setSelectedChips(option.defaultChip);
  };

  const handleChipToggle = (chip: string) => {
    setSelectedChips(prev => {
      if (prev.includes(chip)) {
        return prev.filter(item => item !== chip);
      } else {
        return [...prev, chip];
      }
    });
  };

  const setRating = () => {
    if (selectedRating.length > 0) {
      dispatch(routeChange('start'));

      const finalRating = selectedChips.join(',');

      const data = {
        customerId: app.customerID,
        appType: "INVOICE_FINANCING",
        rateExperience: selectedRating,
        feedbackKey: finalRating,
        feedback: comment,
      };

      const options = {
        successCallBack: (res: any) => {
          dispatch(routeChange('end'));
          if (res.status) {
            navigate('/Feedback');
          }
        },
        failureCallBack: (error: any) => {
          console.log("display error ==", error);
          dispatch(routeChange('end'));
        }
      };

      makeAPIPOSTRequest('supermoney-service/user/feedback/create', {}, data, options);
    } else {
      setAlertMessage("Choose rating");
      setAlert(true);
    }
  };

  const getTopRowOptions = () => feedbackOptions.filter(option => [5, 4, 3].includes(option.id));
  const getBottomRowOptions = () => feedbackOptions.filter(option => [1, 2].includes(option.id));

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
      <div className="text-center h-auto pt-12 pb-14">
        <h2 className="text-[#7e67da] text-xl font-bold">
          Rate Your Experience
        </h2>

        <div className="mt-10">
          {/* Top Row - Great, Good, Okay */}
          <div className="flex justify-center mb-8">
            {getTopRowOptions().map((option) => (
              <div key={option.id} className="w-1/3 px-2">
                <button
                  onClick={() => handleRatingSelect(option)}
                  className={`w-fit mx-auto p-2 rounded-[35px] cursor-pointer transition-all duration-300 ${
                    selected === option.id
                      ? 'shadow-lg transform -translate-y-1'
                      : 'shadow-none'
                  }`}
                  style={{
                    boxShadow: selected === option.id 
                      ? '0 5px 5px 0 rgba(0, 0, 0, 0.2)' 
                      : '0 0px 0px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <img src={option.image} alt={option.label} className="mx-auto" />
                  <div 
                    className="text-sm font-bold mt-1"
                    style={{ color: option.color }}
                  >
                    {option.label}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Row - Terrible, Bad */}
          <div className="flex justify-center">
            <div className="w-1/6"></div>
            {getBottomRowOptions().map((option) => (
              <div key={option.id} className="w-1/3 px-2">
                <button
                  onClick={() => handleRatingSelect(option)}
                  className={`w-fit mx-auto p-2 rounded-[35px] cursor-pointer transition-all duration-300 ${
                    selected === option.id
                      ? 'shadow-lg transform -translate-y-1'
                      : 'shadow-none'
                  }`}
                  style={{
                    boxShadow: selected === option.id 
                      ? '0 5px 5px 0 rgba(0, 0, 0, 0.2)' 
                      : '0 0px 0px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <img src={option.image} alt={option.label} className="mx-auto" />
                  <div 
                    className="text-sm font-bold mt-1"
                    style={{ color: option.color }}
                  >
                    {option.label}
                  </div>
                </button>
              </div>
            ))}
            <div className="w-1/6"></div>
          </div>

          {/* Feedback Text */}
          <div className="mt-9 text-[#616064] text-base font-bold px-4">
            Your feedback is invaluable. It will help<br />us to make your
            experience better.
          </div>

          {/* Chips Section */}
          {selected !== 0 && (
            <div className="mt-10 mx-7">
              <div className="flex flex-wrap gap-2 justify-center">
                {chipList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleChipToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedChips.includes(tag)
                        ? 'bg-[#7e67da] text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment Textarea */}
          {selected !== 0 && (
            <div className="mt-9 mx-7">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you love about the app or what we could be doing better"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#7e67da] focus:border-transparent"
                rows={4}
              />
            </div>
          )}

          {/* Submit Button */}
          {selected !== 0 && (
            <div className="mt-9 mx-9 max-w-[450px]">
              <button
                onClick={setRating}
                className="w-full bg-[#7E67DA] text-white font-bold py-3 rounded-lg cursor-pointer normal-case hover:bg-[#6B56C9] transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};