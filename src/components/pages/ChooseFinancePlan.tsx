import { useState, useEffect } from 'react';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";
import companyLightImage from "../../assets/images/companylightimage.png";
import wave2 from "../../assets/images/wave2.png";
import wave1 from "../../assets/images/wave1.png";
import financePlan1 from "../../assets/images/financeplan1.png";
import financePlan2 from "../../assets/images/financeplan2.png";
import financePlan3 from "../../assets/images/financeplan3.png";
import drawerGreen from "../../assets/images/drawergreen.png";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProgramDetails {
  onboardingPartner: string;
  company: string;
  productName: string;
  description: string;
  isCashbackAvailable?: boolean;
}

interface FinancePlan {
  financingPlanName: string;
  minimumAmount: number;
  maximumAmount: number;
  tenure: string;
  interestFreeTerm: string;
  interestRatePerAnnum: string;
  interestFreePeriod: string;
  penalInterest: string;
  penalInterestPeriod: string;
  financingPlanId: string;
  validTill: string;
}

interface OnboardingStep {
  taskName: string;
}

export const ChooseFinancePlan = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [sheet, setSheet] = useState(false);
  const [financePlanList, setFinancePlanList] = useState<FinancePlan[]>([]);
  const [programDetails, setProgramDetails] = useState<ProgramDetails>({
    onboardingPartner: '',
    company: '',
    productName: '',
    description: '',
  });
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [onboarding, setOnboarding] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [alert, setAlert] = useState(false);
  const [workflowID, setWorkflowID] = useState('');

  const financePlanImageList = ['financePlan1', 'financePlan2', 'financePlan3'];
  const gapBetween = 0;

  const mobile = '9920111300';
  const mobile1 = '02269516677';

  useEffect(() => {
    dispatch(routeChange('end'));
    fetchApplicationId();
    fetchApplicationFinancePlan();
  }, []);

  const dial = () => {
    const number = app.companyName == "NETMEDS" || app.companyName == "JIOMART" ? mobile1 : mobile;
    try {
      window.open(`tel:${number}`, '_self');
    } catch (err) {
      window.open(`tel:${number}`, '_self');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const getAcronime = (value: number) => {
    const amount = Math.round(value);
    if (amount.toString().length <= 5) {
      return `${value / 1000}K`;
    } else {
      return `${value / 100000}L`;
    }
  };

  const onSwiper = (swiper: any) => {
    console.log(swiper);
  };

  const onSlideChange = (swiper: any) => {
    setOnboarding(swiper.activeIndex + 1);
  };

  const createApplicationFinancePlanMapping = (item: FinancePlan) => {
    dispatch(routeChange('start'));

    const data = {
      customerId: app.customerID,
      applicationId: app.applicationId,
      supplierId: "",
      lender: "",
      financingPlanId: item.financingPlanId,
      validTill: item.validTill,
      createdBy: "InvoiceFinancing",
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        navigate('/BusinessDetails');
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==", error);
      },
    };

    makeAPIPOSTRequest('/supermoney-service/application/finance/create', {}, data, options);
  };

  const fetchApplicationFinancePlan = () => {
    dispatch(routeChange('start'));

    const data = {
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        if (res.getApplicationFinancePlanMappingResp.length > 0) {
          navigate('/BusinessDetails');
        }
      },
      failureCallBack: (error: any) => {
        console.log("display  ==", error);
      },
    };

    makeAPIPOSTRequest('/supermoney-service/application/finance/get', {}, data, options);
  };

  const getOnboardingSteps = () => {

      dispatch(routeChange('start'));
      let url = "https://.mintwalk.com/tomcatb/workflow-management-services/workflow/getTaskList";

      let request = {
        customerId: app.customerID,
        profileId: app.profileID,
        workFlowId: workflowID,
      };
      axios
        .post(url, request)

        .then(function (res) {
          dispatch(routeChange('end'));
          setOnboardingSteps(res.data.tasks);
        })
        .catch(function (error) {
          // handle error
          console.log("display  ==" + error);
        })
        .finally(function () {
          // always executed
        });
  };

  const fetchFinancePlan = (programId: string) => {
    dispatch(routeChange('start'));

    const data = {
      programId: programId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        setFinancePlanList(res.getFinancePlanRespList);
        setProgramDetails(res.getFinancePlanRespList[0].programDetails[0]);
      },
      failureCallBack: (error: any) => {
        console.log("display  ==", error);
      },
    };

    makeAPIPOSTRequest('/supermoney-service/financeplan/get', {}, data, options);
  };

  const fetchApplicationId = () => {
    dispatch(routeChange('start'));

    const data = {
      customerId: app.customerID,
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        setWorkflowID(res.getCustomerApplicationResponseList[0].programDetails.workflowId);
        fetchFinancePlan(res.getCustomerApplicationResponseList[0].programDetails.programId);
        getOnboardingSteps();
      },
      failureCallBack: (error: any) => {
        // handle error
        // console.log("display  ==", error);
      },
    };

    makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, data, options);
  };

  return (
    <div
      className="max-w-[450px] text-left font-montserrat h-full bg-white mx-auto"
      style={{ fontFamily: 'Montserrat' }}
    >
      <div className="h-auto pb-[50px]">
        {/* Header */}
        <div className="m-4">
          <div className="flex items-center">
            <div
              className="text-left cursor-pointer w-1/4"
              onClick={goBack}
            >
              <ArrowLeft className="cursor-pointer text-[#4328ae]" size={24} />
            </div>
            <div className="text-center w-2/4">
              <img
                className="w-[138px] mx-auto"
                alt="logo"
                src={landingLogoBlue}
              />
            </div>
            <div
              className="cursor-pointer text-right w-1/4"
              onClick={dial}
            >
              <Phone className="text-[#4328ae] inline" size={24} />
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4">
            {alertMessage}
          </div>
        )}

        {/* Program Details Card */}
        <div className="bg-[#4328ae] m-4 rounded-xl relative overflow-hidden">
          <div className="p-6 pb-4">
            <span className="text-white font-bold">
              {programDetails.onboardingPartner}
            </span>
            <div className="flex items-center mt-1">
              <img
                src={companyLightImage}
                className="h-4 w-4"
                alt="company"
              />
              <div className="text-[12px] text-[#d1c4e9] ml-1">
                {programDetails.company}
              </div>
            </div>
            <div className="flex mt-8">
              <div className="w-1/2">
                <div>
                  <span className="text-white text-[12px] font-bold">Product</span>
                  <br />
                  <span className="text-white text-[12px]">
                    {programDetails.productName}
                  </span>
                </div>
              </div>
              <div className="w-1/2">
                <div className="w-fit">
                  <span className="text-white text-[12px] font-bold">
                    Program Description
                  </span>
                  <br />
                  <span className="text-white text-[12px]">
                    {programDetails.description}
                  </span>
                </div>
              </div>
            </div>
            <img
              className="top-[70px] right-[17px] absolute"
              src={wave2}
              alt="wave"
            />
            <img
              className="mt-[-8px] ml-[-16px] absolute"
              src={wave1}
              alt="wave"
            />
          </div>
        </div>

        {/* Finance Plans Section */}
        <div
          className="text-start rounded-t-[22px] bg-[#f7f5ff] pl-4 pt-3 pr-4 h-full"
        >
          {/* Plan Selection Header */}
          {financePlanList.length > 1 && (
            <div className="m-4 mx-[26px]">
              <div className="w-full">
                <span className="font-bold text-[16px] text-[#666666]">
                  Choose a Financing Plan
                </span>
                <div className="flex mt-2">
                  {financePlanList.map((_, index) => (
                    <button key={`btn-${index}`} className="mr-[27px]">
                      {onboarding === index + 1 ? (
                        <div className="w-2 h-2 bg-[#7E67DA] rounded-full" />
                      ) : (
                        <div className="w-1 h-1 bg-[#7E67DA] rounded-full opacity-40" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Single Plan View */}
          {financePlanList.length === 1 && (
            <div className="bg-white shadow-md m-6 rounded-xl">
              <div className="p-3">
                <span className="text-[#4328ae] font-bold">
                  Plan - {financePlanList[0].financingPlanName}
                </span>
              </div>
              <hr className="border-t-2 border-[#d1c4e9]" />

              <div className="text-center p-5">
                <div className="bg-[#f2f0fb] pt-2 flex rounded-lg">
                  <div className="w-2/5">
                    <img src={financePlan1} alt="finance plan" />
                  </div>
                  <div className="w-3/5 text-left">
                    <span className="text-[12px] text-[#666666]">
                      Credit Amount Range
                    </span>
                    <br />
                    <span className="text-[14px] text-[#666666] font-bold">
                      ₹ {getAcronime(financePlanList[0].minimumAmount)} -{' '}
                      {getAcronime(financePlanList[0].maximumAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex">
                  <div className="w-1/2 text-left">
                    <span className="text-[12px] text-[#666666]">Tenure</span>
                    <br />
                    <span className="text-[14px] text-[#666666] font-bold">
                      {parseInt(financePlanList[0].tenure) +
                        parseInt(financePlanList[0].interestFreeTerm)}{' '}
                      Days
                    </span>
                  </div>
                  <div className="w-1/2 text-right">
                    <span className="text-[12px] text-[#666666]">Interest Rate</span>
                    <br />
                    <span className="text-[14px] text-[#666666] font-bold">
                      {financePlanList[0].interestRatePerAnnum}% p.a
                    </span>
                  </div>
                </div>

                <div className="flex mt-2">
                  <div className="w-1/2 text-left">
                    <span className="text-[12px] text-[#666666]">
                      Interest Free Period
                    </span>
                    <br />
                    <span className="text-[14px] text-[#666666]">
                      {financePlanList[0].interestFreeTerm}{' '}
                      {financePlanList[0].interestFreePeriod}
                    </span>
                  </div>
                  <div className="w-1/2 text-right">
                    <span className="text-[12px] text-[#666666]">
                      Late Payment Penalty
                    </span>
                    <br />
                    <span className="text-[14px] text-[#666666]">
                      {financePlanList[0].penalInterest}% per{' '}
                      {financePlanList[0].penalInterestPeriod}
                    </span>
                  </div>
                </div>

                <button
                  className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-[90%] py-2 rounded-lg"
                  onClick={() => createApplicationFinancePlanMapping(financePlanList[0])}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Multiple Plans Swiper */}
          {financePlanList.length > 1 && (
            <Swiper
              slidesPerView={1.1}
              spaceBetween={gapBetween}
              onSwiper={onSwiper}
              onSlideChange={onSlideChange}
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
              className="mySwiper mt-[-20px]"
            >
              {financePlanList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white shadow-md m-6 rounded-xl">
                    <div className="p-3">
                      <span className="text-[#4328ae] font-bold">
                        Plan - {item.financingPlanName}
                      </span>
                    </div>
                    <hr className="border-t-2 border-[#d1c4e9]" />

                    <div className="text-center p-5">
                      <div className="bg-[#f2f0fb] pt-2 flex rounded-lg">
                        <div className="w-2/5">
                          <img
                            // src={`../assets/img/${financePlanImageList[index % 2]}.png`}
                            src={index % 2 === 0 ? financePlan1 : financePlan2}
                            alt="finance plan"
                          />
                        </div>
                        <div className="w-3/5 text-left">
                          <span className="text-[12px] text-[#666666]">
                            Credit Amount Range
                          </span>
                          <br />
                          <span className="text-[14px] text-[#666666] font-bold">
                            ₹ {getAcronime(item.minimumAmount)} -{' '}
                            {getAcronime(item.maximumAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex">
                        <div className="w-1/2 text-left">
                          <span className="text-[12px] text-[#666666]">Tenure</span>
                          <br />
                          <span className="text-[14px] text-[#666666] font-bold">
                            {parseInt(item.tenure)} Days
                          </span>
                        </div>
                        <div className="w-1/2 text-right">
                          <span className="text-[12px] text-[#666666]">
                            Interest Rate
                          </span>
                          <br />
                          <span className="text-[14px] text-[#666666] font-bold">
                            {item.interestRatePerAnnum}% p.a
                          </span>
                        </div>
                      </div>

                      <div className="flex mt-2">
                        <div className="w-1/2 text-left">
                          <span className="text-[12px] text-[#666666]">
                            Interest Free Period
                          </span>
                          <br />
                          <span className="text-[14px] text-[#666666]">
                            {item.interestFreeTerm} {item.interestFreePeriod}
                          </span>
                        </div>
                        <div className="w-1/2 text-right">
                          <span className="text-[12px] text-[#666666]">
                            Late Payment Penalty
                          </span>
                          <br />
                          <span className="text-[14px] text-[#666666]">
                            {item.penalInterest}% per {item.penalInterestPeriod}
                          </span>
                        </div>
                      </div>

                      <button
                        className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-[90%] py-2 rounded-lg"
                        onClick={() => createApplicationFinancePlanMapping(item)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Bottom Sheet Trigger */}
      <div
        className="fixed max-w-[450px] w-full bottom-0 z-10 mt-5 bg-white p-[18px_26px_21px] rounded-t-[22px]"
      >
        <div className="flex">
          <div className="flex w-1/2 text-left text-[12px] text-[#666666] items-center">
            <img className="m-auto mr-1" src={drawerGreen} alt="drawer" />
            <div>Onboarding Steps</div>
          </div>
          <div
            className="w-1/2 text-end text-[12px] text-[#4328ae] cursor-pointer"
            onClick={() => setSheet(true)}
          >
            View Details
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      {sheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end">
          <div className="bg-white w-full max-w-[450px] mx-auto rounded-t-xl p-4">
            <span className="text-[16px] font-bold">Onboarding Steps</span>
            <div className="mt-3">
              {onboardingSteps.map((item, index) => (
                <div
                  key={index}
                  className="rounded bg-[#f2f0fb] p-2 h-fit flex my-2"
                >
                  <CheckCircle className="text-[#99989E] mr-2" size={20} />
                  <div className="flex w-[70%] text-left text-[14px] text-[#666666] h-fit items-center">
                    {item.taskName}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                className="bg-[#7E67DA] mt-5 font-bold text-white w-1/2 py-2 rounded-lg"
                onClick={() => setSheet(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
