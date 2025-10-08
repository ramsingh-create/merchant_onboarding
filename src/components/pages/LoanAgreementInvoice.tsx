import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';

// Import your images
import loanAgreementHeader from '../../assets/images/loanagreementheader.png';

// PDF Viewer Component (you'll need to install a PDF viewer library)
// For example: react-pdf or @react-pdf-viewer
const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
    return (
        <div className="h-[500px] border border-gray-300 rounded-lg overflow-hidden">
            <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Loan Agreement PDF"
            />
        </div>
    );
};

interface FinancePlan {
    financePlanDetails: {
        interestFreeTerm: string;
        interestFreePeriod: string;
        tenure: string;
        tenurePeriod: string;
        loanProductId: string;
        financingPlanId: string;
    };
}

interface ProgramDetails {
    programId: string;
}

const LoanAgreementInvoice: React.FC = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [creditFacilityAmount, setCreditFacilityAmount] = useState<string>('');
    const [financedAmount, setFinancedAmount] = useState<string>('');
    const [intrestRate, setIntrestRate] = useState<string>('');
    const [amountONDueDate, setAmountONDueDate] = useState<string>('');
    const [overdueIntrestRate, setOverdueIntrestRate] = useState<string>('');
    const [docSeqId, setDocSeqId] = useState<string>('');
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [financePlan, setFinancePlan] = useState<FinancePlan | null>(null);
    const [program, setProgram] = useState<ProgramDetails | null>(null);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);

    useEffect(() => {
        dispatch(routeChange("end"));
        fetchApplicationId();
    }, [dispatch]);

    const fetchApplicationFinancePlan = () => {
        dispatch(routeChange("start"));
        const request = {
            applicationId: searchParams.get('applicationId'),
        };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setFinancePlan(responseData.getApplicationFinancePlanMappingResp[0]);
                generateAgreement();
            },
            failureCallback: (error: any) => {
                console.error("Error fetching finance plan:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/supermoney-service/application/finance/get", {}, request, options);
    };

    const fetchApplicationId = () => {
        dispatch(routeChange("start"));
        const request = {
            customerId: app.customerID,
            applicationId: searchParams.get('applicationId'),
        };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                setProgram(responseData.getCustomerApplicationResponseList[0].programDetails);
                fetchApplicationFinancePlan();
            },
            failureCallback: (error: any) => {
                console.error("Error fetching application:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/supermoney-service/customer/application/get", {}, request, options);
    };

    const generateAgreement = () => {
        dispatch(routeChange("start"));

        const data = {
            lender: "GETCLARITY2",
            loanAmount: searchParams.get('invoiceAmount'),
            company: app.companyName,
            customerId: app.customerID,
            loanProductId: financePlan?.financePlanDetails.loanProductId,
            financingPlanId: financePlan?.financePlanDetails.financingPlanId,
            loanRequestId: "",
            loanTemplateId: "",
            applicationId: searchParams.get('applicationId'),
            programId: program?.programId,
        };

        let msgHeader = {
            authToken: localStorage.getItem("authtoken"), //dynamic
            loginId: app.loginId,
            channelType: "M",
            consumerId: "414",
            deviceId: "MerchantWebApp",
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
        let createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

        const options = {
            successCallBack: (responseData: any) => {
                dispatch(routeChange("end"));
                dispatch(setAuthToken(responseData.header.authToken));

                if (responseData.data.successFlag) {
                    setPdfUrl(responseData.data.fileLocation);
                    setCreditFacilityAmount(responseData.data.creditFacilityAmount.toLocaleString());
                    setFinancedAmount(responseData.data.financedAmount.toLocaleString());
                    setIntrestRate(responseData.data.interest);
                    setAmountONDueDate(responseData.data.amountOnDueDate.toLocaleString());
                    setOverdueIntrestRate(responseData.data.overdueInterestRate);
                    setDocSeqId(responseData.data.docSeqId);
                }
            },
            failureCallback: (error: any) => {
                console.error("Error generating agreement:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/generateUnsignedDynamicLoanAgreement", {}, createWorkflowRequest, options);
    };

    const moveToOTP = () => {
        navigate({
            pathname: "/LoanAgreementOTPInvoice",
            search: new URLSearchParams({
                docSeqId: docSeqId,
                applicationId: searchParams.get('applicationId') || '',
            }).toString()
        });
    };

    const formatCurrency = (amount: string) => {
        return parseFloat(amount).toLocaleString();
    };

    return (
        <div className="max-w-[450px] text-left font-montserrat min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {alertMessage}
                </div>
            )}

            <div className="h-auto pb-12">
                {/* Header Section */}
                <div className="bg-gradient-to-b from-purple-50 to-white pt-14 pb-8">
                    <div className="flex items-start px-10">
                        <img
                            src={loanAgreementHeader}
                            alt="Loan Agreement"
                            className="w-16 h-16"
                        />
                        <div className="ml-4">
                            <h1 className="text-[#4328ae] text-base font-bold">
                                Loan Agreement
                            </h1>
                            <p className="text-xs text-gray-600 mt-1">
                                Please read the loan agreement carefully <br />and sign it with OTP
                                in the next step.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mt-[-20px] bg-white rounded-[22px] px-4 py-6 mx-4 shadow-sm">
                    {/* Loan Agreement Summary */}
                    <div className="text-[#7e67da] font-bold px-2 py-3">
                        Loan Agreement Summary
                    </div>

                    {/* Credit Facility Amount & Interest Rate */}
                    <div className="text-black">
                        <div className="flex justify-between items-center mb-3 px-2">
                            <div>
                                <div className="text-xs text-gray-600">Credit Facility Amount</div>
                                <div className="text-sm font-semibold">
                                    ₹ <span className="text-base">{creditFacilityAmount}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-600">Interest Rate</div>
                                <div className="text-sm font-semibold">
                                    <span className="text-base">{intrestRate}% p.a.</span>
                                </div>
                            </div>
                        </div>
                        <hr className="border-t border-[#ede7f6] my-3" />
                    </div>

                    {/* Interest Free Period & Tenure */}
                    <div className="text-black">
                        <div className="flex justify-between items-center mb-3 px-2">
                            <div>
                                <div className="text-xs text-gray-600">Interest Free Period</div>
                                <div className="text-sm font-semibold">
                                    <span className="text-base">
                                        {financePlan?.financePlanDetails.interestFreeTerm}{" "}
                                        {financePlan?.financePlanDetails.interestFreePeriod}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-600">Tenure</div>
                                <div className="text-sm font-semibold">
                                    <span className="text-base">
                                        {financePlan?.financePlanDetails.tenure}{" "}
                                        {financePlan?.financePlanDetails.tenurePeriod}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr className="border-t border-[#ede7f6] my-3" />
                    </div>

                    {/* Amount on Due Date */}
                    <div className="text-black">
                        <div className="flex justify-between items-center mb-3 px-2">
                            <div>
                                <div className="text-xs text-gray-600">Amount on Due Date</div>
                                <div className="text-sm font-semibold">
                                    ₹<span className="text-base">{formatCurrency(amountONDueDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF Viewer */}
                    <div className="mt-5 mx-2">
                        {pdfUrl ? (
                            <PDFViewer pdfUrl={pdfUrl} />
                        ) : (
                            <div className="h-[500px] border border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="text-gray-500">Loading PDF...</div>
                            </div>
                        )}
                    </div>

                    {/* Accept Button */}
                    <div className="pt-12 pb-8">
                        <button
                            onClick={moveToOTP}
                            className="w-full bg-[#7E67DA] text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Accept with OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanAgreementInvoice;