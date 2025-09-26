import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/router';
import { useNavigate } from "react-router-dom";
import upFrontBanner from "../../assets/images/upfrontbanner.png";
import documentUpFront from "../../assets/images/documentupfront.png";
import applicationFail from "../../assets/images/applicationfail.png";
import uploadDocumentThankyou from "../../assets/images/uploaddocumentthankyou.png";
import statusIcon from "../../assets/images/statusicon.png";

// Types
interface OnboardingStep {
  taskId: string;
  taskName: string;
  type: number; // 0: completed, 1: current, 2: pending
}

interface ApplicationData {
  programName: string;
  invoiceUploadAvailable: boolean;
  workflowID: string;
  mandateType: string;
}

interface CustomerProfile {
  companyType: string;
  name: string;
  panNumber: string;
  borrowerId: string;
}

interface CreditLimit {
  totalCreditLimit: number;
  utilizedCreditLimit: number;
  unutilizedCreditLimit: number;
}

// Main Component
export const UpFrontLanding: React.FC = () => {
  // const router = useRouter();
  const navigate = useNavigate();
  
  // State variables
  const [currentStep, setCurrentStep] = useState<string>('');
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [workflowID, setWorkflowID] = useState<string>('');
  const [financePlan, setFinancePlan] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<string>('');
  const [creditStatus, setCreditStatus] = useState<string>('Not Started');
  const [totalLimit, setTotalLimit] = useState<number>(0);
  const [availableLimit, setAvailableLimit] = useState<number>(0);
  const [utilizedLimit, setUtilizedLimit] = useState<number>(0);
  const [availablePercentage, setAvailablePercentage] = useState<number>(0);
  
  // UI state flags
  const [payNowCard, setPayNowCard] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('');
  const [utilizationCardUtilized, setUtilizationCardUtilized] = useState<boolean>(false);
  const [landingCard, setLandingCard] = useState<boolean>(false);
  const [completeKYCCard, setCompleteKYCCard] = useState<boolean>(false);
  const [applicationRejected, setApplicationRejected] = useState<boolean>(false);
  const [onboardingJourneyCompleteCard, setOnboardingJourneyCompleteCard] = useState<boolean>(false);
  const [utilizationCard, setUtilizationCard] = useState<boolean>(false);
  const [invoiceCard, setInvoiceCard] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [sheet, setSheet] = useState<boolean>(false);
  const [statusSheet, setStatusSheet] = useState<boolean>(false);
  const [programName, setProgramName] = useState<string>('');
  const [invoiceUploadAvailable, setInvoiceUploadAvailable] = useState<boolean>(true);
  const [mandateType, setMandateType] = useState<string>('');

  // Mock store values (replace with actual store implementation)
  const store = {
    getters: {
      onboardingName: 'Partner Name',
      applicationId: '12345',
      companyName: 'Default Company',
      customerID: 'customer123',
      profileID: 'profile123',
      loginId: 'user123'
    }
  };

  // Calculate available percentage
  useEffect(() => {
    if (totalLimit > 0) {
      setAvailablePercentage(parseInt(((availableLimit / totalLimit) * 100).toString()));
    }
  }, [totalLimit, availableLimit]);

  // Initial data fetch
  useEffect(() => {
    stagesFetch();
  }, []);

  // API Methods
  const stagesFetch = async () => {
    try {
      // Implementation would go here
      setLandingCard(true);
      fetchApplicationId();
      fetchApplicationFinancePlan();
      customerProfile();
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const fetchApplicationId = async () => {
    // API implementation
    setProgramName('Sample Program');
    setInvoiceUploadAvailable(true);
  };

  const fetchApplicationFinancePlan = async () => {
    // API implementation
  };

  const customerProfile = async () => {
    // API implementation
    setName('John Doe');
  };

  const creditLimit = async () => {
    // API implementation
    setTotalLimit(50000);
    setAvailableLimit(35000);
    setUtilizedLimit(15000);
  };

  // Navigation methods
  const redirectToBusinessDetails = () => {
    if (financePlan != null) {
      navigate("/BusinessDetails");
    } else {
      navigate("/ChooseFinancePlan");
    }
  };

  const redirectToDashBoard = () => {
    setSheet(false);
    navigate("/SelectSupplier");
  };

  const redirectToRecentInvoices = () => {
    navigate("/RecentInvoice");
  };

  const redirectToPayment = () => {
    navigate("/Payment");
  };

  const openStatusSheet = () => setStatusSheet(true);
  const closeStatusSheet = () => setStatusSheet(false);
  const closeBottomSheet = () => setSheet(false);

  const dial = () => {
    const number = store.getters.companyName === "NETMEDS" || store.getters.companyName === "JIOMART" 
      ? "02269516677" 
      : "9920111300";
    window.open(`tel:${number}`, '_self');
  };

  const workFlowStatus = () => {
    navigate("/BusinessDetails");
  };

  // Progress circle component
  const ProgressCircle: React.FC<{ percentage: number; available: number; total: number }> = ({ 
    percentage, 
    available, 
    total 
  }) => (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#BAADEC"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#97C93E"
          strokeWidth="10"
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset="25"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-lg text-green-600">
          {parseInt((available / 1000).toString())}K
        </span>
        <span className="text-xs text-purple-600">Available Limit</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-[450px] mx-auto min-h-screen bg-[#311b92] text-left font-montserrat">
      <div className="h-auto pb-12">
        {/* Alert */}
        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{alertMessage}</span>
            <button onClick={() => setAlert(false)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              ×
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mx-4 my-5">
          <span className="text-lg text-white">
            Welcome! <b>{name}</b>
          </span>
          <br />
          <span className="text-xs text-[#d1c4e9]">
            Program : <b>{programName}</b>
          </span>
        </div>

        {/* Landing Card */}
        {landingCard && (
          <div className="bg-[#f7f5ff] rounded-2xl mx-4 mt-6 mb-5 shadow-lg">
            <img 
              src={upFrontBanner} 
              alt="banner" 
              className="w-full -mt-7"
            />
            <div className="p-4">
              <span className="font-bold">
                Worried about stock shortage <br />due to low cash?
              </span>
              <div className="text-[#666666] text-xs font-bold mt-2">
                Get instant <span className="text-green-500">pre-approved </span>
                credit at competitive <br />interest rate for all your invoices.
              </div>
              <button
                onClick={redirectToBusinessDetails}
                className="bg-[#7E67DA] mt-5 mb-4 font-bold text-white w-40 py-2 rounded-lg"
              >
                Apply Now
              </button>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">No Processing Fee</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">Paperless Journey</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">Quick Disbursal</span>
              </div>
            </div>
          </div>
        )}

        {/* Complete KYC Card */}
        {completeKYCCard && (
          <div className="bg-white rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-3/4">
                  <span className="text-black font-bold">Complete your KYC</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Few steps away from getting pre-approved credit
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <img src={documentUpFront} alt="Document" className="ml-auto" />
                </div>
              </div>

              <div className="mt-3">
                {onboardingSteps.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-2 h-fit flex items-center my-2 ${
                      item.type === 0 
                        ? 'border border-[#d1c4e9]' 
                        : item.type === 1 
                        ? 'border border-[#7e67da] cursor-pointer' 
                        : 'border border-[#d1c4e9]'
                    }`}
                    onClick={item.type === 1 ? workFlowStatus : undefined}
                  >
                    <span className={`mr-2 ${
                      item.type === 0 ? 'text-green-500' : 
                      item.type === 1 ? 'text-[#7E67DA]' : 'text-[#BDBDBD]'
                    }`}>
                      ●
                    </span>
                    <div className="w-3/4 text-left text-xs text-gray-600">
                      {item.taskName}
                    </div>
                    {item.type === 0 && (
                      <div className="text-green-500 mx-auto text-xs font-bold">
                        Completed
                      </div>
                    )}
                    {item.type === 1 && (
                      <div className="text-[#7e67da] ml-auto text-xs font-bold flex items-center">
                        Start <span className="ml-1">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Application Rejected Card */}
        {applicationRejected && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Application Rejected Due to low credit score</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Your application does not satisfy our acceptance criteria
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={applicationFail} alt="Document" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Journey Complete Card */}
        {onboardingJourneyCompleteCard && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Onboarding Journey Completed</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Check your verification and credit approval status
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={documentUpFront} alt="Document" />
                </div>
              </div>
              <button
                onClick={openStatusSheet}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Check Status
              </button>
            </div>
          </div>
        )}

        {/* Credit Approved Card (Non-invoice upload available) */}
        {!invoiceUploadAvailable && !onboardingJourneyCompleteCard && creditStatus === 'Approved' && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">धंधा बढ़ायें ज़्यादा कमायें</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    You have been pre-approved a limit of <b>₹{totalLimit.toLocaleString()}</b>
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle 
                    percentage={availablePercentage} 
                    available={availableLimit} 
                    total={totalLimit} 
                  />
                </div>
              </div>
              <hr className="border-t border-[#d1c4e9] my-3" />
              <div className="flex items-start mt-2">
                <span className="text-[#7E67DA] mr-2 mt-1">ℹ</span>
                <span className="text-xs leading-relaxed">
                  Please provide invoices to <b>{store.getters.onboardingName}</b> to utilize this limit.
                </span>
              </div>
              <button
                onClick={() => navigate("/AddInvoice")}
                className="bg-[#7E67DA] mt-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Add Invoice
              </button>
            </div>
          </div>
        )}

        {/* Invoice Card */}
        {invoiceCard && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">View Recent Invoices</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Check status of recently submitted invoices
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={documentUpFront} alt="Document" />
                </div>
              </div>
              <button
                onClick={redirectToRecentInvoices}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                View Status
              </button>
            </div>
          </div>
        )}

        {/* Utilization Card */}
        {utilizationCard && invoiceUploadAvailable && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">धंधा बढ़ायें ज़्यादा कमायें</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Upload invoices and set-up autopay to avail benefits.
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle percentage={100} available={totalLimit} total={totalLimit} />
                </div>
              </div>
              <button
                onClick={redirectToDashBoard}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Utilization Card Utilized */}
        {utilizationCardUtilized && invoiceUploadAvailable && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Upload Invoice</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Upload invoices and set-up autopay to avail benefits.
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle 
                    percentage={availablePercentage} 
                    available={availableLimit} 
                    total={totalLimit} 
                  />
                </div>
              </div>
              <button
                onClick={redirectToDashBoard}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Upload Invoice
              </button>
            </div>
          </div>
        )}

        {/* Pay Now Card */}
        {payNowCard && (
          <div className="bg-[#5e49b6] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-white font-bold">Free Up Limit</span>
                  <br />
                  <div className="text-[#f7f5ff] text-xs leading-relaxed">
                    Pay your approved invoices now and free up your credit limit
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle 
                    percentage={availablePercentage} 
                    available={availableLimit} 
                    total={totalLimit} 
                  />
                </div>
              </div>
              <button
                onClick={redirectToPayment}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Bottom Sheets */}
        {/* Congratulations Sheet */}
        {sheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-[#f7f5ff] w-full max-w-[450px] mx-auto rounded-t-2xl h-90">
              <div className="text-right p-3">
                <button onClick={closeBottomSheet} className="text-[#7E67DA] text-xl">
                  ×
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="w-3/5">
                    <span className="text-2xl text-[#4328ae] font-bold">Congratulations!</span>
                    <br />
                    <div className="text-xs leading-relaxed">Your pre approved limit is</div>
                    <div className="text-green-500 font-bold text-2xl leading-relaxed">
                      ₹{totalLimit.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="w-2/5">
                    <img src={uploadDocumentThankyou} alt="Document" className="w-32" />
                  </div>
                </div>
                <div className="font-bold text-xs leading-relaxed mt-2">
                  Upload invoices and setup autopay to avail your limit and also earn rewards!
                </div>
                <button
                  onClick={redirectToDashBoard}
                  className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-full py-2 rounded-lg"
                >
                  Upload Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Sheet */}
        {statusSheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-[#f7f5ff] w-full max-w-[450px] mx-auto rounded-t-2xl h-90">
              <div className="text-right p-3">
                <button onClick={closeStatusSheet} className="text-[#7E67DA] text-xl">
                  ×
                </button>
              </div>
              <span className="text-[#4328ae] px-4 text-xl font-bold">Your Current status</span>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="w-3/5">
                    <div>
                      <span className="text-sm font-bold">KYC Verification</span>
                      <br />
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        kycStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        kycStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {kycStatus}
                      </span>
                    </div>
                    <div className="mt-6">
                      <span className="text-sm font-bold">Credit Approval</span>
                      <br />
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        creditStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        creditStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {creditStatus}
                      </span>
                    </div>
                  </div>
                  <div className="w-2/5">
                    <img src={statusIcon} alt="Document" className="w-32" />
                  </div>
                </div>
                <div className="mt-12 text-xs">
                  Want more details about your current Status ?
                </div>
                <button
                  onClick={dial}
                  className="border border-[#7E67DA] mt-4 mb-2 font-bold text-[#7E67DA] w-full py-2 rounded-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tailwind CSS for custom font */}
      {/* <style jsx>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style> */}
    </div>
  );
};