import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { ArrowLeft, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";

interface FAQItem {
  question: string;
  answer: string;
}

export const FaqList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [notificationColor] = useState<string>("#4328AE");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const faqList: FAQItem[] = [
    {
      question: "What types of products Supermoney offer?",
      answer: "We offer a range of products suited to all MSME segment including Large SCF, Small SCF, WCDL, WCTL, Merchant Loans and PID.",
    },
    {
      question: "How do I apply for a loan?",
      answer: "You can start the application process online through our website or by contacting any of our RM or customer support team.",
    },
    {
      question: "Are there penalties for early repayment in supply chain finance?",
      answer: "No. Rather we incentivize early payments and appreciate it.",
    },
    {
      question: "What collateral is required for finance?",
      answer: "We offer collateral free unsecured loans.",
    },
    {
      question: "Can I use the funds for any business purpose, or are there restrictions?",
      answer: "Most of our product can only be used to buy inventory/stocks. However, we also provide some Term loan products which can be used for business expansion and growth.",
    },
    {
      question: "How do you ensure the security of my financial information?",
      answer: "All your financial information is only used for credit evaluation. We follow data privacy guidelines to secure your financial information.",
    },
    {
      question: "Can I get a loan if I am based at a small town?",
      answer: "Through our digital process we cover majority of locations and try to support everyone subject to our comfort with Suppliers.",
    },
    {
      question: "How can I repay my loan?",
      answer: "You can easily repay your loan through our website using the repayment portal where you'll be provided with a digital QR code.",
    },
    {
      question: "How can I get my SOA (Statement of Account)?",
      answer: "You can connect with the Customer Service team of Supermoney and they will help you with the Account Credentials and other details.",
    },
    {
      question: "Where I can find my overall portfolio?",
      answer: "You can check your portfolio on the Supermoney website/mobile app via the provided credentials.",
    },
  ];

  useEffect(() => {
    dispatch(routeChange('end'));
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
    //   if (window.JSBridge) {
    //     // @ts-ignore
    //     window.JSBridge.call(number);
    //   } else {
    //     window.open(`tel:${number}`, '_self');
    //   }
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const toggleItem = (index: number) => {
    setExpandedItem(prev => prev === index ? null : index);
  };

  return (
    <div className="max-w-[450px] text-left font-montserrat h-full bg-[#f3f0fc] mx-auto">
      <div className="h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="w-1/5">
            <button
              onClick={goBack}
              className="cursor-pointer p-0"
              style={{ color: notificationColor }}
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          <div className="w-3/5 flex justify-center">
            <img
              src={landingLogoBlue}
              alt="logo"
              className="w-36"
            />
          </div>

          <div className="w-1/5 flex justify-end">
            <button
              onClick={dial}
              className="cursor-pointer p-0"
              style={{ color: notificationColor }}
            >
              <Phone size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full mt-5">
          <div className="px-6">
            <span 
              className="font-bold text-base"
              style={{ color: notificationColor }}
            >
              We're happy to help
            </span>
          </div>

          {/* FAQ Container */}
          <div className="text-start mt-5 rounded-[22px] bg-white pt-5 h-full">
            <div className="px-6">
              <span className="font-bold text-base text-[#666666]">
                Frequently Asked Questions
              </span>
            </div>

            {/* FAQ Items */}
            <div className="mt-5">
              <div className="space-y-2 px-4 pb-4 rounded-xl">
                {faqList.map((item, index) => (
                  <div 
                    key={index}
                    className="border border-[#d1c4e9] rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#757575] text-sm font-bold leading-relaxed flex-1 pr-2">
                        {item.question}
                      </span>
                      {expandedItem === index ? (
                        <ChevronUp size={20} className="text-[#757575] flex-shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-[#757575] flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedItem === index && (
                      <div className="px-4 pb-3">
                        <div className="text-[#a1a1a1] text-sm border-t border-[#d1c4e9] pt-3">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hidden Contact Section (v-show="false" in Vue) */}
          <div className="text-center hidden">
            <div className="mt-12 text-sm">
              Did not Find what you were looking ?
            </div>
            <button
              onClick={dial}
              className="border border-[#7E67DA] mt-4 mb-2 font-bold text-[#4328ae] w-48 py-2 rounded flex items-center justify-center mx-auto hover:bg-[#f7f5ff] transition-colors"
            >
              <Phone size={16} className="text-[#7E67DA] mr-2" />
              <span className="text-[#7e67da]">Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};