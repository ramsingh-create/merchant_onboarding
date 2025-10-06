import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import LogoBlue from '../../assets/images/landinglogoblue.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routeChange } from '../../store/appSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import RewardTransactionItem from '../molecules/RewardTransactionItem';

// Types
interface Transaction {
    invoiceId: string;
    cashbackDate: string;
    type: 'Credit' | 'Debit';
    cashbackAmount: number;
    loanId: string;
    repayAmount: number;
}

const RewardsTransactionList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);
    const [searchParams] = useSearchParams();

    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [transactionList, setTransactionList] = useState<Transaction[]>([]);
    const [notificationColor] = useState('#4328AE');

    const applicationId = searchParams.get('applicationId');

    // Initialize
    useEffect(() => {
        fetchRewardTransaction();
    }, []);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchRewardTransaction = async () => {

        dispatch(routeChange("start"));

        let url = "/supermoney-service/cashback/transactions";
        let request = {
            customerId: app.customerID,
            applicationId: applicationId,
        };

        const options = {
            succesCallBack: function (response: any) {
                dispatch(routeChange("end"));
                const allTransactions = [
                    ...response.cashbackReqDetails.map((item: any) => ({ ...item, type: 'Credit' as const })),
                    ...response.cashbackUtilizationReqDetails.map((item: any) => ({ ...item, type: 'Debit' as const }))
                ];

                // Sort by date (newest first)
                allTransactions.sort((a, b) =>
                    new Date(b.cashbackDate).getTime() - new Date(a.cashbackDate).getTime()
                );

                setTransactionList(allTransactions);
            },
            failureCallBack: function (error: any) {
                dispatch(routeChange("end"));
                console.log("Error fetching transactions: ", error);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
    };

    const handleBack = () => {
        navigate(-1);
    };

    // const renderTransactionItem = (item: Transaction, index: number) => (
    //     <div key={index}>
    //         <div className="py-2.5">
    //             <div className="flex">
    //                 <div className="w-1/2">
    //                     <div className="text-[12px] text-[#a1a1a1]">
    //                         Purchase Order No.
    //                     </div>
    //                     <div className="text-[12px] text-[#7e67da]">
    //                         {item.invoiceId}
    //                     </div>
    //                 </div>
    //                 <div className="w-1/2 text-right">
    //                     <div className="text-[12px] text-[#a1a1a1]">
    //                         {formatDate(item.cashbackDate)}
    //                     </div>
    //                     <div className={`text-[12px] ${item.type === 'Credit' ? 'text-[#97c93e]' : 'text-[#ff5252]'}`}>
    //                         {item.type === 'Credit' ? '+' : '-'} ₹ {item.cashbackAmount.toLocaleString()}
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="flex mt-3">
    //                 <div className="w-1/2">
    //                     <div className="text-[12px] text-[#a1a1a1]">Loan#</div>
    //                     <div className="text-[12px] text-[#666666]">
    //                         {item.loanId}
    //                     </div>
    //                 </div>
    //                 <div className="w-1/2 text-right">
    //                     <div className="text-[12px] text-[#a1a1a1]">
    //                         Repayment Amt.
    //                     </div>
    //                     <div className="text-[12px] text-[#666666]">
    //                         ₹ {item.repayAmount.toLocaleString()}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //         {index < transactionList.length - 1 && (
    //             <hr className="border-t border-[#d1c4e9] my-2" />
    //         )}
    //     </div>
    // );


    return (
        <div
            className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-[#f3f0fc] mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4">
                    {alertMessage}
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setAlert(false)}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="pt-5 px-4">
                <div className="flex items-center justify-between">
                    <div >
                        <ArrowLeft
                            onClick={handleBack}
                            style={{ color: notificationColor }}
                            className="p-0 cursor-pointer"
                            size={24}
                        />
                    </div>
                    <div className="text-center">
                        <img
                            style={{ width: '138px' }}
                            alt="logo"
                            src={LogoBlue}
                        />
                    </div>
                    <div className="text-right cursor-pointer">
                        {/* Uncomment if you want to add bell icon */}
                        <Bell
                            style={{ color: notificationColor }}
                            className="p-0"
                            size={24}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="h-auto bg-[#f3f0fc] pb-12 pt-10">
                {transactionList.length > 0 ? (
                    <div className="bg-white p-4.5 mx-4 rounded-xl shadow-sm">
                        <div className="mb-4">
                            <span className="text-[#666666] font-bold">
                                Recent Cashbacks
                            </span>
                        </div>
                        <div>
                            {transactionList.map((item, index) =>
                                // renderTransactionItem(item, index)
                                <RewardTransactionItem
                                    item={item}
                                    index={index}
                                    totalItems={transactionList.length}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-8 mx-4 mt-10 rounded-xl shadow-sm text-center">
                        <div className="text-[#666666] text-[16px] mb-4">
                            No transactions found
                        </div>
                        <div className="text-[#a1a1a1] text-[12px]">
                            You don't have any cashback transactions yet.
                        </div>
                    </div>
                )}

                {/* FAQ Link - Commented out as per original code */}
                {/* <div className="w-fit text-center mx-auto mt-8">
          <div 
            className="flex items-center cursor-pointer"
            onClick={openFaqList}
          >
            <Info className="text-[#7E67DA] mr-2.5 w-5 h-5" />
            <span className="text-[11px] text-[#737477]">
              Want to know more - FAQs
            </span>
          </div>
        </div> */}
            </div>
        </div>
    );
};

export default RewardsTransactionList;