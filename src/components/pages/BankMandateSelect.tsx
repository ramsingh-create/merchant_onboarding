import React, { useEffect, useState } from 'react';
import { ChevronRight, Lock, X, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { routeChange, setAuthToken, setCompanyName } from '../../store/appSlice';
import { RootState } from '../../store/store';
import { makeAPIPOSTRequest } from '../../utils/apiActions';

// Import your images
import mandateHeadIcon from '../../assets/images/mandateheadicon.png';
import aadhaarMandateIcon from '../../assets/images/aadhaarmandate.png';
import debitCardMandateIcon from '../../assets/images/debitcardmandate.png';
import netBankingMandateIcon from '../../assets/images/netbankingmandate.png';
import qrMandateIcon from '../../assets/images/qrmandate.png';
import digioLogo from '../../assets/images/digio.png';
import axios from 'axios';

interface BankDetails {
    bankName: string;
    bankAccountNo: string;
    name?: string;
    isfcCode?: string;
    accountType?: string;
}

interface FinancePlan {
    financePlanDetails: {
        lenderAccountId: string;
        tenure?: number;
        tenurePeriod?: string;
    };
}

const BankMandateSelect: React.FC = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('Something went wrong!');
    const [netBankingVisible, setNetBankingVisible] = useState<boolean>(true);
    const [debitCardVisible, setDebitCardVisible] = useState<boolean>(true);
    const [aadhaarVisible, setAadhaarVisible] = useState<boolean>(true);
    const [physicalMandateVisible, setPhysicalMandateVisible] = useState<boolean>(true);
    const [pendingSheet, setPendingSheet] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('In Process');
    const [createdDate, setCreatedDate] = useState<string>('');
    const [urmnNo, setUrmnNo] = useState<string>('');
    const [financePlan, setFinancePlan] = useState<FinancePlan | null>(null);
    const [programId, setProgramId] = useState<string>('');
    const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);
    const [searchParams] = useSearchParams();


    // API Functions
    const getBankDetails = () => {
        dispatch(routeChange('start'))
        const instance = axios.create({
            baseURL: "https://.mintwalk.com/tomcat/mintLoan/mintloan/",
            headers: { "content-type": "application/json" },
        });

        let data = { applicationId: searchParams.get('applicationId') };
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
                const JSONData = response.data;

                let hostStatus = JSONData.header.hostStatus;

                if (hostStatus === "S" || hostStatus === "s") {
                    dispatch(setAuthToken(JSONData.header.authToken))
                    let userBankList = JSONData.data.userBankList;
                    if (userBankList.length != 0) {
                        userBankList.forEach((item: any) => {
                            if (item.defaultFlag === true) {
                                setNetBankingVisible(item.netBankingMandateEnabled);
                                setAadhaarVisible(item.eSignMandateEnabled);
                                setDebitCardVisible(item.debitCardMandateEnabled);
                                setBankDetails(item);
                            }
                        });
                    }
                } else {
                    if (JSONData.header.hostStatus === "E") {
                        setAlert(true);
                        setAlertMessage(JSONData.header.error.errorDesc)
                    } else {
                        setAlert(true);
                        setAlertMessage(JSONData.data.errorDetails[0].errorDesc)
                    }
                }
                dispatch(routeChange('end'))
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            })
            .finally(function () {
                // always executed
            });
    };

    const fetchApplicationFinancePlan = () => {
        dispatch(routeChange("start"));
        const request = {
            applicationId: searchParams.get('applicationId')
        };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setFinancePlan(responseData.getApplicationFinancePlanMappingResp[0]);
            },
            failureCallback: (error: any) => {
                console.error("Error fetching finance plan:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/supermoney-service/application/finance/get", {}, request, options);
    };

    const getMandateDetails = () => {
        dispatch(routeChange("start"));
        const instance = axios.create({
            baseURL:
                "https://.mintwalk.com/mandate-services/mandate/digio/details/",
            headers: { "content-type": "application/json" },
        });

        //  let url = 'http://13.126.28.53:8080/MintReliance/MintReliance/kycCheck'
        let data = {
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
        };
        instance
            .post("get", data)

            .then(function (response) {
                const JSONData = response.data;

                if (JSONData.getMandateDetailsRespList.length > 0) {
                    setUrmnNo(JSONData.getMandateDetailsRespList[0].umrn);
                    setCreatedDate(JSONData.getMandateDetailsRespList[0].creationDate);
                }
                dispatch(routeChange("end"));
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
                dispatch(routeChange("end"));

            })
    };

    // Mandate Functions
    const openDigio = (KID: string, identifier: string) => {
        const applicationId = searchParams.get('applicationId')
        const baseUrl = "https://app.digio.in/#/gateway/login/";
        const finalUrl = `${baseUrl}${KID}/${app.customerID}${Date.now()}/${identifier}?redirect_url=https%3A%2F%2Fwww.supermoney.in%2FIF%2F%23%2FDigioMandateSuccessInvoice%3FapplicationId%3D${applicationId}&logo=https://www.supermoney.in/supermoneylogo.png&theme=theme: {primaryColor: '#AB3498',secondaryColor: '#000000',}`;
        window.location.href = finalUrl;
    };

    const netBankingMandate = (type: string) => {
        const accountType = bankDetails?.accountType === "Saving" ? "Savings" : "Current";
        const custIdentifer = app.loginId as string;
        dispatch(routeChange("start"));
        const instance = axios.create({
            baseURL: "https://.mintwalk.com/mandate-services/mandate/digio/",

            headers: { "content-type": "application/json" },
        });

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "api",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: accountType,
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
            lenderAccountId: financePlan?.financePlanDetails.lenderAccountId,
        };

        instance
            .post("create", data)

            .then(function (response) {
                console.log(response);
                const JSONData = response.data;

                if (JSONData.id != "") {
                    openDigio(JSONData.id, custIdentifer);

                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                }
                dispatch(routeChange('end'))

            })
            .catch(function (error) {
                let alertMessage = error.response.data.errors[0];
                if (
                    alertMessage ==
                    "You have already registered for auto repayment"
                ) {
                    openStatusSheet();
                    getMandateDetails();
                } else {
                    setAlert(true);
                    setAlertMessage(alertMessage)
                }
                dispatch(routeChange('end'))
            });
    };

    const aadhaarMandate = () => {
        const accountType = bankDetails?.accountType === "Saving" ? "Savings" : "Current";
        const custIdentifer = app.loginId as string;
        dispatch(routeChange("start"));
        const instance = axios.create({
            baseURL: "https://.mintwalk.com/mandate-services/mandate/digio/",

            headers: { "content-type": "application/json" },
        });

        let data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "api",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: accountType,
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
            lenderAccountId: financePlan?.financePlanDetails.lenderAccountId,
        };

        instance
            .post("create", data)

            .then(function (response) {
                console.log(response);
                const JSONData = response.data;

                if (JSONData.id != "") {
                    openDigio(JSONData.id, custIdentifer);

                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate");
                }
                dispatch(routeChange('end'))

            })
            .catch(function (error) {
                let alertMessage = error.response.data.errors[0];
                if (
                    alertMessage ==
                    "You have already registered for auto repayment"
                ) {
                    openStatusSheet();
                    getMandateDetails();
                } else {
                    setAlert(true);
                    setAlertMessage(alertMessage)
                }
                dispatch(routeChange('end'))
            });
    };

    const physicalMandate = () => {
        const accountType = bankDetails?.accountType === "Saving" ? "Savings" : "Current";
        dispatch(routeChange("start"));

        const instance = axios.create({
            baseURL: "https://.mintwalk.com/mandate-services/mandate/digio/",

            headers: { "content-type": "application/json" },
        });

        const data = {
            customerMobile: app.loginId,
            companyName: app.companyName,
            authMode: "physical",
            instrumentType: "debit",
            isRecurring: true,
            frequency: "adhoc",
            firstCollectionDate: new Date(Date.now()).toISOString().substring(0, 10),
            managementCategory: "L001",
            customerName: bankDetails?.name,
            customerAccountNumber: bankDetails?.bankAccountNo,
            customerBankIfscCode: bankDetails?.isfcCode,
            customerBankName: bankDetails?.bankName,
            customerAccountType: accountType,
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
            lenderAccountId: financePlan?.financePlanDetails.lenderAccountId,
            programId: programId,
        };

        instance
            .post("create", data)

            .then(function (response) {
                console.log(response);
                const JSONData = response.data;

                if (JSONData.id != "") {
                    physicalMandateLink(JSONData.id);
                    
                } else {
                    setAlert(true);
                    setAlertMessage('Could Not Create Bank Mandate')
                }

                dispatch(routeChange('end'))
            })
            .catch(function (error) {
                let alertMessage = error.response.data.errors[0];
                if (
                    alertMessage ==
                    "You have already registered for auto repayment"
                ) {
                    openStatusSheet();
                    getMandateDetails();
                } else {
                    setAlert(true)
                    setAlertMessage(alertMessage)
                }
                dispatch(routeChange('end'))
            });
    };

    const physicalMandateLink = (mandateId: string) => {
        dispatch(routeChange("start"));
        const instance = axios.create({
            baseURL:
                "https://.mintwalk.com/mandate-services/mandate/digio/physical/form/",

            headers: { "content-type": "application/json" },
        });

        let data = {
            mandateId: mandateId,
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
        };
        instance
            .post("get", data)

            .then(function (response) {
                console.log(response);
                const JSONData = response.data;

                if (JSONData.mandateId != "") {
                    const fileDownloadUrl = JSONData.fileDownloadUrl;
                    const queryParams = new URLSearchParams({
                        page: "physical",
                        agreementUrl: fileDownloadUrl,
                        borrowerId: searchParams.get('borrowerId') || '',
                        availableLimit: searchParams.get('availableLimit') || '',
                        applicationId: searchParams.get('applicationId') || '',
                        companyName: searchParams.get('companyName') || '',
                    }).toString()
                    navigate(`/PhysicalMandateInvoice?${queryParams}`)
                } else {
                    setAlert(true);
                    setAlertMessage("Could Not Create Bank Mandate")
                }
                dispatch(routeChange('end'))

            })
            .catch((error) => {
                dispatch(routeChange('end'))
                if (error) {
                    console.log("display  ==" + error);
                }
            });
    };

    // Helper Functions
    const closeStatusSheet = () => {
        setPendingSheet(false);
    };

    const openStatusSheet = () => {
        setPendingSheet(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return '#97C93E';
            case 'Rejected': return '#FF5252';
            default: return '#FB8C00';
        }
    };

    useEffect(() => {
        getBankDetails();
        fetchApplicationFinancePlan()
    }, []);

    return (
        <div className="max-w-[450px] text-left font-montserrat min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {alertMessage}
                </div>
            )}

            {/* Main Content */}
            <div className="h-auto pt-10 bg-[#f3f0fc]">
                {/* Header */}
                <div className="flex items-start px-6 py-10">
                    <div className="w-1/4 text-center">
                        <img
                            src={mandateHeadIcon}
                            alt="Mandate Icon"
                            className="mx-auto"
                        />
                    </div>
                    <div className="w-3/4 text-left pl-4">
                        <h1 className="text-base font-bold text-[#4328ae]">
                            Select Autopay Method
                        </h1>
                        <p className="text-xs text-[#616065] mt-1">
                            Choose an auto repayment method supported by your bank
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                {/* <div className="mt-5 bg-[#ede7f6] rounded-t-[22px] px-4 pb-7 pt-2 flex items-center">
                    <div className="bg-[#97c93e] rounded-xl text-white text-xs px-2 py-1">
                        <span className="font-bold">3</span>
                    </div>
                    <div className="text-black text-xs mt-1 ml-1">/4</div>
                    <div className="text-black text-xs ml-2">Select Autopay Method</div>
                </div> */}

                {/* Bank Details */}
                <div className="mt-[-20px] bg-white rounded-t-[22px] px-8 py-6">
                    <div className="flex items-center">
                        {/* <img src={bankDetailsSmallIcon} alt="Bank Icon" className="mr-3" /> */}
                        <div>
                            <div className="text-xs font-semibold">{bankDetails?.bankName}</div>
                            <div className="text-xs text-[#828282]">A/C : {bankDetails?.bankAccountNo}</div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-gray-300" />

                {/* Mandate Options */}
                <div className="bg-white px-8 py-6 space-y-6">
                    {/* Net Banking */}
                    {netBankingVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => netBankingMandate('netBanking')}
                        >
                            <div className="flex items-center">
                                <div className="w-1/6 flex justify-center">
                                    <img
                                        src={netBankingMandateIcon}
                                        alt="Net Banking"
                                        className=""
                                    />
                                </div>
                                <div className="w-4/6 px-4">
                                    <span className="text-base font-bold text-[#7e67da]">
                                        Net Banking
                                    </span>
                                </div>
                                <div className="w-1/6 flex justify-end">
                                    <ChevronRight className="text-[#7E67DA] w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Debit Card */}
                    {debitCardVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => netBankingMandate('debitCard')}
                        >
                            <div className="flex items-center">
                                <div className="w-1/6 flex justify-center">
                                    <img
                                        src={debitCardMandateIcon}
                                        alt="Debit Card"
                                        className=""
                                    />
                                </div>
                                <div className="w-4/6 px-4">
                                    <span className="text-base font-bold text-[#7e67da]">
                                        Debit Card
                                    </span>
                                </div>
                                <div className="w-1/6 flex justify-end">
                                    <ChevronRight className="text-[#7E67DA] w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aadhaar Mandate */}
                    {aadhaarVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={aadhaarMandate}
                        >
                            <div className="flex items-start">
                                <div className="w-1/6 flex justify-center mt-1">
                                    <img
                                        src={aadhaarMandateIcon}
                                        alt="Aadhaar Mandate"
                                        className=""
                                    />
                                </div>
                                <div className="w-4/6 px-4 mt-1">
                                    <span className="text-base font-bold text-[#7e67da]">
                                        Aadhaar Mandate
                                    </span>
                                </div>
                                <div className="w-1/6 flex justify-end mt-1">
                                    <ChevronRight className="text-[#7E67DA] w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-xs text-[#a1a1a1] mt-2 ml-4">
                                Phone No. should be linked with Aadhaar
                            </div>
                        </div>
                    )}

                    {/* Physical QR Mandate */}
                    {physicalMandateVisible && (
                        <div
                            className="border border-[#d1c4e9] rounded-[18px] p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={physicalMandate}
                        >
                            <div className="flex items-start">
                                <div className="w-1/6 flex justify-center mt-1">
                                    <img
                                        src={qrMandateIcon}
                                        alt="Physical QR Mandate"
                                        className=""
                                    />
                                </div>
                                <div className="w-4/6 px-4 mt-1">
                                    <span className="text-base font-bold text-[#7e67da]">
                                        Physical QR Mandate
                                    </span>
                                </div>
                                <div className="w-1/6 flex justify-end mt-1">
                                    <ChevronRight className="text-[#7E67DA] w-5 h-5" />
                                </div>
                            </div>
                            <div className="text-xs text-[#ff5252] mt-2 ml-4">
                                Higher Processing Time
                            </div>
                        </div>
                    )}

                    {/* Security Info */}
                    <div className="mt-4 text-center">
                        <Lock className="w-4 h-4 text-[#7E67DA] inline mr-1" />
                        <span className="text-xs text-[#a1a1a1]">
                            This payment is secured by{' '}
                        </span>
                        <img
                            src={digioLogo}
                            alt="Digio"
                            className="h-6 inline align-middle"
                        />
                    </div>

                    {/* Information Box */}
                    <div className="mt-4 mb-12 bg-[#f7f5ff] p-3 rounded-xl">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-[#97C93E] mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-[#9c9ba1] ml-2">
                                Autopay mandate will be registered for the credit approved
                                limit. But on due date only due amount will be deducted using
                                Auto Debit
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet */}
            {pendingSheet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 max-w-[450px] mx-auto">
                    <div className="bg-[#f7f5ff] w-full rounded-t-2xl h-[400px]">
                        <div className="text-right p-2">
                            <X
                                className="w-6 h-6 text-[#7E67DA] inline-block cursor-pointer"
                                onClick={closeStatusSheet}
                            />
                        </div>
                        <div className="text-[#4328ae] px-5 text-xl font-bold">
                            You have already registered<br />
                            for auto repayment
                        </div>
                        <div className="p-5">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[#2c2c2c] text-sm">Registered on</span>
                                    <br />
                                    <span className="text-[#636266] text-sm font-bold">
                                        {formatDate(createdDate)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[#2c2c2c] text-sm">UMRN No.</span>
                                    <br />
                                    <span className="text-[#636266] text-sm font-bold">
                                        {urmnNo}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm font-bold">KYC Verification</span>
                                    <br />
                                    <span
                                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white mt-1"
                                        style={{ backgroundColor: getStatusColor(status) }}
                                    >
                                        {status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 text-sm font-bold">
                                Kindly try again after bank confirmation for this<br />
                                autopay mandate
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankMandateSelect;