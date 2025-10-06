
import { ChevronRight } from 'lucide-react';

import RewardDocument from '../../assets/images/rewarddocument.png';
import RewardRupeeSmall from '../../assets/images/rewardsrupeesmall.png';
import RewardRupee from '../../assets/images/rewardsrupee.png';
import RewardWalletSmall from '../../assets/images/rewardswalletsmall.png';
import RewardWallet from '../../assets/images/rewardswallet.png';
import RewardsGift from '../../assets/images/rewrdsgift.png';

import RewardsChart from './RewardsChart';
import RewardTransactionItem from './RewardTransactionItem';

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

interface Transaction {
    invoiceId: string;
    cashbackDate: string;
    type: 'Credit' | 'Debit';
    cashbackAmount: number;
    loanId: string;
    repayAmount: number;
}

interface ChartData {
    name: string;
    Earning: number;
    Utilization: number;
}
const RewardCard = ({reward, viewDetails, setViewDetails, redirectToPayment, chartData, transactionList, openAllTransaction}: {reward: RewardData, viewDetails: boolean, setViewDetails: (value: boolean) => void, redirectToPayment: () => void, chartData: ChartData[], transactionList: Transaction[], openAllTransaction: () => void}) => {

    return (
        <div className="bg-white p-4.5 mx-4 mt-6 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex">
                <div className="w-1/2">
                    <span className="text-[#7e67da] font-bold">
                        Program {reward?.programDetails?.programName || "TEST"}
                    </span>
                </div>
                <div
                    className="w-1/2 text-right cursor-pointer"
                    onClick={() => setViewDetails(!viewDetails)}
                >
                    <span className="text-[#7e67da] text-[12px]">
                        {viewDetails ? "Hide Details" : "Show Details"}
                    </span>
                </div>
            </div>

            {/* Cashback Info */}
            <div className="flex mt-4">
                <div className="w-1/2">
                    <img
                        src={RewardsGift}
                        alt="Rewards Gift"
                        className="w-34"
                    />
                </div>
                <div className="w-1/2">
                    <span className="text-[#666666] text-[12px]">Current Cashback</span>
                    <br />
                    <span className="text-[#7e67da] text-[16px] font-bold">
                        ₹ {reward?.unutilizedCashbackAmount?.toLocaleString()}
                    </span>
                    <br />
                    <span className="text-[#666666] text-[12px]">Total Cashback Earned</span>
                    <br />
                    <span className="text-[#666666] text-[16px] font-bold">
                        ₹ {reward?.totalCashbackAmountAvailed?.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex mt-4">
                <div
                    className="w-1/2 cursor-pointer bg-[#7e67da] rounded-xl mx-3 p-3"
                    onClick={redirectToPayment}
                >
                    <div className="flex">
                        <div className="w-3/4 cursor-pointer">
                            <img
                                src={RewardRupee}
                                alt="Earn More"
                                className="w-12"
                            />
                        </div>
                        <div className="w-1/4 text-right">
                            <ChevronRight className="text-[#F7F5FF] w-5 h-5" />
                        </div>
                    </div>
                    <span className="text-white text-[14px] font-bold">Earn More</span>
                </div>
                <div
                    className="w-1/2 cursor-pointer bg-[#7e67da] rounded-xl mx-3 p-3"
                    onClick={redirectToPayment}
                >
                    <div className="flex">
                        <div className="w-3/4 cursor-pointer">
                            <img
                                src={RewardWallet}
                                alt="Utilize Cashback"
                                className="w-11"
                            />
                        </div>
                        <div className="w-1/4 text-right">
                            <ChevronRight className="text-[#F7F5FF] w-5 h-5" />
                        </div>
                    </div>
                    <span className="text-white text-[14px] font-bold">Utilize Cashback</span>
                </div>
            </div>

            {/* Details Section */}
            {viewDetails && (
                <>
                    <div className="bg-[#f7f5ff] rounded-xl my-5 p-4.5 mx-4 p-4">
                        <div className="flex p-4">
                            <div className="w-1/2 text-left">
                                <span className="text-[10px] font-bold text-[#636266]">
                                    Avg. Monthly Earning
                                </span>
                                <br />
                                <span className="text-[12px] text-[#636266]">
                                    ₹ <b>{Math.round(reward?.averageEarning).toLocaleString()}</b>
                                </span>
                            </div>
                            <div className="w-1/2 text-left">
                                <span className="text-[10px] font-bold text-[#636266]">
                                    Avg. Monthly Utilization
                                </span>
                                <br />
                                <span className="text-[12px] text-[#636266]">
                                    ₹ <b>{Math.round(reward?.averageUtilization).toLocaleString()}</b>
                                </span>
                            </div>
                        </div>

                        <div className="flex mt-4.5">
                            <div className="w-2/5 flex items-center">
                                <div className="w-3.5 h-3.5 bg-[#7e67da] rounded-full mr-1.5"></div>
                                <span className="text-[12px] text-[#636266]">Earning</span>
                            </div>
                            <div className="w-2/5 flex items-center">
                                <div className="w-3.5 h-3.5 bg-[#d1c4e9] rounded-full mr-1.5"></div>
                                <span className="text-[12px] text-[#636266]">Utilization</span>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="mt-4 w-full">
                            <RewardsChart chartData={chartData} />
                        </div>
                    </div>

                    <div className="mt-5 mx-4">
                        <div className="mb-3.5 text-[14px] font-bold text-[#636266]">
                            How it Works
                        </div>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((position) => (
                                <div key={position} className="w-1/5 flex justify-center">
                                    {position === 1 && <img src={RewardDocument} alt="Document" />}
                                    {position === 3 && <img src={RewardRupeeSmall} alt="Rupee" />}
                                    {position === 5 && <img src={RewardWalletSmall} alt="Wallet" />}
                                </div>
                            ))}
                        </div>
                        <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((position) => (
                                <div key={position} className="w-1/5 flex justify-center">
                                    {[1, 3, 5].includes(position) ? (
                                        <div className="bg-[#97c93e] rounded-full w-6 h-6 flex items-center justify-center">
                                            <span className="text-[12px] text-white font-bold">
                                                {position === 1 ? 1 : position === 3 ? 2 : 3}
                                            </span>
                                        </div>
                                    ) : (
                                        <hr className="w-full border-t-2 border-dashed border-[#a1a1a1] my-3" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <div className="w-1/5 text-center">
                                <span className="text-[12px] text-[#636266]">Re-Pay<br />Invoice</span>
                            </div>
                            <div className="w-1/5"></div>
                            <div className="w-1/5 text-center">
                                <span className="text-[12px] text-[#636266]">Earn<br />Cashback</span>
                            </div>
                            <div className="w-[10%]"></div>
                            <div className="w-[30%] text-center">
                                <span className="text-[12px] text-[#636266]">Utilize for next <br />re-payments</span>
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-[#d1c4e9] my-5 -mx-4.5" />
                </>
            )}

            {/* Recent Transactions */}
            {transactionList.length > 0 && (
                <div className="mt-5">
                    <div className="flex">
                        <div className="w-1/2">
                            <span className="text-[#7e67da] font-bold">Recent Cashbacks</span>
                        </div>
                        <div
                            className="w-1/2 text-right cursor-pointer"
                            onClick={openAllTransaction}
                        >
                            <span className="text-[#7e67da] text-[12px]">Show All</span>
                        </div>
                    </div>

                    <div className="mt-3">
                        {transactionList.slice(0, 3).map((item, index) =>
                            <RewardTransactionItem 
                                item={item}
                                index={index}
                                totalItems={Math.min(transactionList.length, 3)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default RewardCard;