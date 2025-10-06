import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Info } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import axios from 'axios';
import mandateHeadIcon from '../../assets/images/mandateheadicon.png';
import nachLogo from '../../assets/images/NACH.png';
import npciLogo from '../../assets/images/NPCI.png';
import digioLogo from '../../assets/images/digio.png';

// Types
interface BankDetails {
    bankName: string;
    bankAccountNo: string;
    defaultFlag: boolean;
    mandateDetails?: {
        isActive: boolean;
    };
}


const BankMandateInfoInvoice: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);
    const [searchParams] = useSearchParams();

    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

    // Initialize
    useEffect(() => {
        getBankDetails();
    }, []);

    const getBankDetails = async () => {
        dispatch(routeChange('start'))
        const instance = axios.create({
            baseURL: "https://.mintwalk.com/tomcat/mintLoan/mintloan/",
            headers: { "content-type": "application/json" },
        });

        let data = {
            applicationId: app.applicationId,
        };
        let msgHeader = {
            authToken: localStorage.getItem("authtoken"), //dynamic
            loginId: app.loginId,
            channelType: "M",
            consumerId: "414",
            deviceId: "BankMandate",
            source: "WEB",
        };
        let deviceFPmsgHeader = {
            clientIPAddress: "192.168.0.122",
            connectionMode: "WIFI",
            country: "United States",
            deviceManufacturer: "Xiaomi",
            deviceModelNo: "Mi A2",
            dualSim: false,
            imeiNo: "09d9212a07553637",
            latitude: "",
            longitude: "",
            nwProvider: "xxxxxxxx",
            osName: "Android",
            osVersion: 28,
            timezone: "Asia/Kolkata",
            versionCode: "58",
            versionName: "5.5.1",
        };
        let employeeDetails = { data, deviceFPmsgHeader, msgHeader };
        instance
            .post("getActiveBankAccountDetailsV2", employeeDetails)

            .then(function (response) {

                if (response.data.header.hostStatus === "S" || response.data.header.hostStatus === "s") {
                    // Store auth token logic here if needed
                    dispatch(setAuthToken(response.data.header.authToken))
                    const userBankList = response.data.data.userBankList;
                    let existingBank = false;
                    let activeBankDetails: BankDetails | null = null;

                    if (userBankList.length !== 0) {
                        userBankList.forEach((item: BankDetails) => {
                            if (item.defaultFlag === true) {
                                existingBank = true;
                                activeBankDetails = item;
                            }
                        });
                    }

                    if (activeBankDetails) {
                        setBankDetails(activeBankDetails);
                    } else {
                        setAlertMessage('No active bank account found');
                        setAlert(true);
                    }
                } else {
                    const errorMsg = response.data.header.hostStatus === "E"
                        ? response.data.header.error.errorDesc
                        : response.data.errorDetails[0].errorDesc;
                    setAlertMessage(errorMsg);
                    setAlert(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            })
    };

    const redirectToMandate = () => {
        const queryParams = new URLSearchParams({
            borrowerId: searchParams.get('borrowerId') as string,
            borrowerName: searchParams.get('borrowerName') as string,
            availableLimit: searchParams.get('availableLimit') as string,
            applicationId: searchParams.get('applicationId') as string,
            companyName: searchParams.get('companyName') as string
        }).toString();
        navigate(`/BankMandateSelect?${queryParams}`)
    };

    const openFAQs = () => {
        console.log('Opening FAQs');
    };

    const renderStep = (content: string, isLast: boolean = false) => (
        <div className="flex mb-4">
            <div className="w-1/12 text-center">
                <CheckCircle className="text-[#97C93E] w-5 h-5 mx-auto" />
                {!isLast && <div className="border-l border-[#a1a1a1] h-8 mx-auto w-0.5 mt-1"></div>}
            </div>
            <div className="w-11/12 pl-3">
                <span className="text-xs text-[#616065]">
                    {content}
                </span>
            </div>
        </div>
    );

    return (
        <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
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

            {/* Header Section */}
            <div className="pt-10 pb-8 bg-[#f3f0fc]">
                <div className="flex items-center px-4">
                    <div className="w-1/4 text-center">
                        <img
                            src={mandateHeadIcon}
                            alt="Auto Repayment"
                            className="w-12 h-12 mx-auto"
                        />
                    </div>
                    <div className="w-3/4 pl-4">
                        <span className="text-[#4328ae] text-base font-bold block">
                            Set Up Auto Repayment
                        </span>
                        <span className="text-[#616065] text-xs block mt-1">
                            Follow instructions to set up auto<br />
                            repayment
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar - Hidden as per original code */}
            <div className="bg-[#ede7f6] mx-4 mt-5 p-3 rounded-lg hidden">
                <div className="flex items-center">
                    <div className="bg-[#97C93E] rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <span className="text-black text-xs ml-2">/4</span>
                    <span className="text-black text-xs ml-3">Setup Autopay</span>
                </div>
            </div>

            {/* Bank Details Section */}
            <div className="bg-white rounded-t-3xl -mt-5 px-8 py-6">
                <div className="text-xs text-[#333333]">
                    {bankDetails?.bankName}
                </div>
                <div className="text-xs text-[#828282] mt-1">
                    A/C : {bankDetails?.bankAccountNo}
                </div>
            </div>

            <hr className="border-t border-[#d1c4e9]" />

            {/* Instructions Section */}
            <div className="bg-white px-8 py-6">
                <span className="text-sm font-bold text-[#333333]">
                    Please follow these steps
                </span>

                <div className="mt-4">
                    {renderStep(
                        "Select the relevant repayment option which is well supported with your bank"
                    )}
                    {renderStep(
                        "You will be redirected to our secured partnered portal 'Digio'"
                    )}
                    {renderStep(
                        "Enter required details for processing authentication and set up auto repayment",
                        true
                    )}
                </div>

                {/* Action Button */}
                <div className="pt-12 pb-6 max-w-[450px] mx-auto">
                    <button
                        className="bg-[#7E67DA] text-white w-full py-4 rounded-lg font-bold cursor-pointer"
                        onClick={redirectToMandate}
                    >
                        Set Up Autopay
                    </button>
                </div>

                {/* Footer Information */}
                <div className="text-xs text-[#aaa8a8] mb-4">
                    *Due amount will be deducted using auto <br />
                    debit only once they are due
                </div>

                {/* FAQ Link */}
                <div className="flex items-center mt-4 mb-6 cursor-pointer" onClick={openFAQs}>
                    <Info className="text-[#7E67DA] w-4 h-4 mr-2" />
                    <span className="text-xs text-[#737477]">
                        Want to know more - <u>FAQs</u>
                    </span>
                </div>

                {/* Powered By Section */}
                <div className="text-center pb-12">
                    <span className="text-xs text-[#737477] block mb-2">Powered by</span>
                    <div className="flex justify-center items-center space-x-4">
                        <img src={nachLogo} alt="NACH" className="w-12 h-auto" />
                        <img src={npciLogo} alt="NPCI" className="w-12 h-auto" />
                        <img src={digioLogo} alt="Digio" className="w-7 h-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankMandateInfoInvoice;