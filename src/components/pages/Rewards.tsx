import React, { useState, useEffect } from 'react';
import { Info, Circle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Bar as BarMolecules } from '../molecules/Bar';
import RewardsCup from '../../assets/images/rewardscup.png';
import NoRewardStar from '../../assets/images/norewardstar.png';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { useNavigate } from 'react-router-dom';
import RewardCard from '../molecules/RewardCard';

declare const JSBridge: {
    call: (number: string) => void;
    redirectToBrowser: (url: string) => void;
};
// Types
interface Transaction {
    invoiceId: string;
    cashbackDate: string;
    type: 'Credit' | 'Debit';
    cashbackAmount: number;
    loanId: string;
    repayAmount: number;
}

interface RewardData {
    applicationId: string;
    programDetails: {
        programName: string;
    };
    approvedCreditLimit: number;
    totalCashbackAmountAvailed: number;
    utilizedCashbackAmount: number;
    unutilizedCashbackAmount: number;
    averageEarning: number;
    averageUtilization: number;
    transactionList: Transaction[];
    percentage?: number;
}

interface ChartData {
    name: string;
    Earning: number;
    Utilization: number;
}

const Rewards: React.FC = () => {
    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [rewardAvailable, setRewardAvailable] = useState(true);
    const [rewardList, setRewardList] = useState<RewardData[]>([]);
    const [onboarding, setOnboarding] = useState(1);
    const [viewDetails, setViewDetails] = useState(false);
    const [gapBetween] = useState(10);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Current reward data
    const [currentReward, setCurrentReward] = useState<RewardData | null>(null);
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app)

    // Initialize
    useEffect(() => {
        fetchApplicationId();
    }, []);

    // Mock functions
    const onSwiper = (swiper: any) => {
        console.log('Swiper initialized:', swiper);
    };

    const onSlideChange = (swiper: any) => {
        console.log('Slide changed:', swiper.activeIndex);
        setCurrentSlide(swiper.activeIndex);
        if (rewardList[swiper.activeIndex]) {
            setNewData(swiper.activeIndex);
        }
    };

    const redirectToPayment = () => {

        dispatch(routeChange("start"));

        let url = "supermoney-service/generatePaymentIdV2";
        let data = {
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange("end"));
                try {
                    JSBridge.redirectToBrowser(
                        res.url +
                        "&applicationId=" +
                        app.applicationId
                    );
                } catch (err) {
                    window.location.href =
                        res.url +
                        "&applicationId=" +
                        app.applicationId;
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to generate payment ID:', err);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest(url, {}, data, options);
    };

    const openAllTransaction = () => {
        navigate(`/RewardsTransactionList?applicationId=${currentReward?.applicationId}`);
    };

    const openFaqList = () => {
        navigate('/FaqList');
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchApplicationId = () => {
        dispatch(routeChange("start"));

        let url = "/supermoney-service/customer/application/get";
        let request = {
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange("end"));
                //setApplicationId(self.applicationList[0].applicationId);
                //setCompanyName(self.applicationList[0].programDetails.programName);
                //setUiData(self.applicationList);
                checkRewards(res.getCustomerApplicationResponseList);
            },
            failureCallBack: (err: any) => {
                console.error('Failed to fetch applications:', err);
                setAlertMessage('Failed to fetch applications');
                setAlert(true);
            }
        }
        makeAPIPOSTRequest(url, {}, request, options)
    };

    const checkRewards = (applications: any[]) => {
        for (let i = 0; i < applications.length; i++) {
            setUiData(i, applications[i], applications);
        }
    };

    const setUiData = async (position: any, item: any, applicationList: any) => {
        let flag = await fetchCashBackDetails(item.applicationId) as any;
        let isRewardsllength = false;
        if (flag != undefined && flag.status) {
            setRewardList((prev) => [...prev, item]);
            isRewardsllength = true
        }

        console.log("position==" + position);
        console.log("Calculatedposition==" + applicationList.length);
        console.log("rewardLength==" + rewardList.length);
        setCurrentReward((prev: any) => ({...prev, ...item}));
        if (
            position == applicationList.length - 1 &&
            isRewardsllength
        ) {
            fetchRewardDetails(rewardList[0]?.applicationId || item.applicationId);
            fetchRewardTransaction(rewardList[0]?.applicationId || item.applicationId);
        }

        dispatch(routeChange("end"));
    }

    const fetchCashBackDetails = async (applicationId: string) => {
        dispatch(routeChange("start"));

        let url = "/supermoney-service/cashback/getAccountDetails";
        let request = {
            customerId: app.customerID,
            applicationId: applicationId,
        };

        return new Promise((resolve, reject) => {
            const options = {
                successCallBack: (res: any) => {
                    dispatch(routeChange("end"));
                    resolve(res); // ✅ resolve the promise with response
                },
                failureCallBack: (err: any) => {
                    console.error('Failed to fetch cashback details:', err);
                    reject(err); // ✅ reject the promise on error
                }
            };

            makeAPIPOSTRequest(url, {}, request, options);
        });
    };


    const fetchRewardDetails = (applicationId: string) => {
        dispatch(routeChange("start"));

        let url = "/supermoney-service/cashback/getAccountDetails";
        let request = {
            customerId: app.customerID,
            applicationId: applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange("end"));
                if (res.status) {
                    const details = res.getCashbackAccountDetails[0];
                    setRewardAvailable(res.successFlag);
                    setCurrentReward((prev) => ({
                        ...prev as any,
                            approvedCreditLimit: details.approvedCreditLimit,
                            totalCashbackAmountAvailed: details.totalCashbackAmountAvailed,
                            utilizedCashbackAmount: details.utilizedCashbackAmount,
                            unutilizedCashbackAmount: details.unutilizedCashbackAmount,
                            percentage: (details.unutilizedCashbackAmount / details.totalCashbackAmountAvailed) * 100
                        }));
                    

                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to fetch reward details:', err);
            }
        };

        makeAPIPOSTRequest(url, {}, request, options);
    };

    const fetchRewardTransaction = (applicationId: string) => {
        dispatch(routeChange("start"));

        let url = "/supermoney-service/cashback/transactions";
        let request = {
            customerId: app.customerID,
            applicationId: applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange("end"));
                const allTransactions = [
                    ...res.cashbackReqDetails.map((item: any) => ({ ...item, type: 'Credit' as const })),
                    ...res.cashbackUtilizationReqDetails.map((item: any) => ({ ...item, type: 'Debit' as const }))
                ];

                // Sort by date
                allTransactions.sort((a, b) =>
                    new Date(b.cashbackDate).getTime() - new Date(a.cashbackDate).getTime()
                );

                setTransactionList(allTransactions);

                // Prepare chart data
                const finalMonths = [];
                let monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ];

                let today = new Date();
                let d;
                let month;

                for (var i = 5; i >= 0; i -= 1) {
                    d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    month = monthNames[d.getMonth()];
                    finalMonths.push(month);
                }
                const chartData = finalMonths.map(month => {
                    const monthIndex = getMonthPosition(month);
                    const monthTransactions = allTransactions.filter(item =>
                        new Date(item.cashbackDate).getMonth() + 1 === monthIndex
                    );

                    const earning = monthTransactions
                        .filter(item => item.type === 'Credit')
                        .reduce((sum, item) => sum + item.cashbackAmount, 0) / 1000;

                    const utilization = monthTransactions
                        .filter(item => item.type === 'Debit')
                        .reduce((sum, item) => sum + item.cashbackAmount, 0) / 1000;

                    return {
                        name: month,
                        Earning: earning,
                        Utilization: utilization
                    };
                });

                setChartData(chartData);
            },
            failureCallBack: (err: any) => {
                dispatch(routeChange("end"));
                console.error('Failed to fetch transactions:', err);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options);
    };

    const setNewData = (activeIndex: number) => {
        const reward = rewardList[activeIndex];
        if (reward) {
            setCurrentReward(reward);
            fetchRewardDetails(reward.applicationId);
            fetchRewardTransaction(reward.applicationId);
        }
    };

    const getMonthPosition = (month: string): number => {
        const months: { [key: string]: number } = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        return months[month] || 1;
    };

    return (
        <div
            className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-[#f3f0fc] mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {alertMessage}
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setAlert(false)}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Render functions for different sections */}
            <div className="bg-[#f3f0fc] p-4 bg-cover bg-center" style={{ backgroundImage: 'url("https://www.supermoney.in/pobbg.png")' }}>
                <div className="flex items-center">
                    <div className="w-1/4 text-center p-2">
                        <img
                            src={RewardsCup}
                            alt="Rewards Cup"
                            className="mx-auto"
                        />
                    </div>
                    <div className="w-3/4 p-2 text-left">
                        <span className="text-[16px] font-bold text-[#4328ae]">
                            SuperRewards
                        </span>
                        <br />
                        <span className="text-[12px] text-[#616065]">
                            Earn more by repaying more <br />invoices
                        </span>
                    </div>
                </div>

                {rewardAvailable && rewardList.length > 0 && (
                    <div className="mt-4 ml-4 flex">
                        {rewardList.map((_, index) => (
                            <button key={`btn-${index}`} className="mr-6">
                                {onboarding === index + 1 ? (
                                    <div className="w-4 h-1 bg-[#7E67DA] rounded"><BarMolecules /></div>
                                ) : (
                                    <Circle className="w-2 h-2 text-[#7E67DA] opacity-40" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* {renderHeader()} */}

            <div className="h-auto bg-[#f3f0fc] pb-12">
                {rewardList.length === 0 ? (
                    <div className="text-center mx-5 mt-24">
                        <span className="text-[24px] text-[#606165] font-bold">
                            No Rewards Yet!
                        </span>
                        <br />
                        <img
                            src={NoRewardStar}
                            alt="No Rewards"
                            className="mt-10 mx-auto"
                        />
                    </div>
                ) : rewardList.length > 1 ? (
                    <>
                        <Swiper
                            slidesPerView={1.1}
                            spaceBetween={gapBetween}
                            onSwiper={onSwiper}
                            onSlideChange={onSlideChange}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                            {rewardList.map((reward, index) => (
                                <SwiperSlide key={index}>
                                    <RewardCard
                                        reward={reward}
                                        viewDetails={viewDetails}
                                        setViewDetails={setViewDetails}
                                        redirectToPayment={redirectToPayment}
                                        chartData={chartData}
                                        transactionList={transactionList}
                                        openAllTransaction={openAllTransaction}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* FAQ Link */}
                        <div className="pb-12 w-fit text-center mx-auto">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={openFaqList}
                            >
                                <Info className="text-[#7E67DA] mr-2.5 w-5 h-5" />
                                <span className="text-[11px] text-[#737477]">
                                    Want to know more - FAQs
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {currentReward &&
                            < RewardCard
                                reward={currentReward}
                                viewDetails={viewDetails}
                                setViewDetails={setViewDetails}
                                redirectToPayment={redirectToPayment}
                                chartData={chartData}
                                transactionList={transactionList}
                                openAllTransaction={openAllTransaction}
                            />
                        }

                        {/* FAQ Link */}
                        <div className="pb-12 w-fit text-center mx-auto">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={openFaqList}
                            >
                                <Info className="text-[#7E67DA] mr-2.5 w-5 h-5" />
                                <span className="text-[11px] text-[#737477]">
                                    Want to know more - FAQs
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Rewards;