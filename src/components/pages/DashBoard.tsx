import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, X, Upload, Circle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import CompanyImage from '../../assets/images/companyimage.png'
import NoApplication from '../../assets/images/noapplication.png'
import ApplicationInProgress from '../../assets/images/applicationinprogress.png'
import ApplicationRejectedDashboard from '../../assets/images/applicationrejecteddashboard.png'
import StatusIcon from '../../assets/images/statusicon.png'
import UploadInvoiceDashboard from '../../assets/images/uploadinvoicedashboard.png'
import OnboardingCompleted from '../../assets/images/onboardingcompletedashboard.png'

import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken, setWorkFlowID } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import axios from 'axios';

declare const JSBridge: {
    call: (number: string) => void;
    redirectToBrowser: (url: string) => void;
};

// Types
interface ProgramDetails {
    programName: string;
    company: string;
    onboardingPartner: string;
    mandateTypeAllowed: string;
    invoiceUploadAvailable: boolean;
    psbLeadId?: string;
    leadCreationStatus?: string;
    leadStatus?: string;
    offers?: Offer[];
}

interface Offer {
    lendername: string;
    channelpartnerlimit: number;
    channelpartnerroi: number;
}

interface Application {
    applicationId: string;
    programDetails: ProgramDetails;
    programLenderResp?: {
        programName: string;
    };
}

interface Invoice {
    purchaseOrderNumber: string;
    approvedInvoiceAmount: number;
    invoiceAmount: number;
    status: string;
    createdAt: string;
}

interface FinancePlan {
    // Define based on your API response
}


const DashBoard: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app)

    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [consentPopup, setConsentPopup] = useState(false);
    const [statusSheet, setStatusSheet] = useState(false);
    const [applicationList, setApplicationList] = useState<Application[]>([]);
    const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
    const [onboarding, setOnboarding] = useState(1);
    const [gapBetween] = useState(0);

    // Application states
    const [kycStage, setKycStage] = useState("COMPLETED");
    const [creditStage, setCreditStage] = useState("Not Started");
    const [onboardingStage, setOnboardingStage] = useState("");
    const [applicationStage, setApplicationStage] = useState("");
    const [kycStatus, setKycStatus] = useState("Approved");
    const [creditStatus, setCreditStatus] = useState("Not Started");

    // Financial data
    const [totalLimit, setTotalLimit] = useState(0);
    const [availableLimit, setAvailableLimit] = useState(0);
    const [utilisedLimit, setUtilisedLimit] = useState(0);
    const [avilablePercentage, setAvilablePercentage] = useState(0);
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);

    // User data
    const [borrowerId, setBorrowerId] = useState("");
    const [borrowerName, setBorrowerName] = useState("");
    const [applicationId, setApplicationId] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [financePlan, setFinancePlan] = useState<FinancePlan | null>(null);

    // UI states
    const [activeBankFlag, setActiveBankFlag] = useState(false);
    const [activeMandateFlag, setActiveMandateFlag] = useState(false);
    const [payNowCard, setPayNowCard] = useState(false);
    const [invoiceUploadAvailable, setInvoiceUploadAvailable] = useState(false);
    const [mandateType, setMandateType] = useState("");
    const [companyName, setCompanyName] = useState("");

    const mobile = "9920111300";
    const mobile1 = "02269516677";

    // Initialize
    useEffect(() => {
        fetchApplicationId();
    }, []);

    // API Methods
    const fetchApplicationId = () => {
        dispatch(routeChange('start'));

        let url = "/supermoney-service/customer/application/get";
        let request = {
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'));
                const applications = response.getCustomerApplicationResponseList;
                setApplicationList(applications);

                if(applications.length > 0) {
                    const firstApp = applications[0];
                    setCurrentApplication(firstApp);
                    setApplicationId(firstApp.applicationId);
                    setCompanyName(firstApp.programDetails.company);
                    setMandateType(firstApp.programDetails.mandateTypeAllowed);
                    setInvoiceUploadAvailable(firstApp.programDetails.invoiceUploadAvailable);
                    // self.kycStage = "COMPLETED";
                    // self.creditStage = "Not Started";
                    // self.onboardingStage = "";
                    // self.activeBankFlag = false;
                    // self.activeMandateFlag = false;
                    // self.invoiceList = [];

                    // Check for PSBX programs
                    const hasPSBX = applications.some((app: any) =>
                        app.programLenderResp?.programName?.startsWith("PSBX")
                    );

                    if (hasPSBX) {
                        fetchPSBXData();
                    }

                    stagesFetch(firstApp.applicationId);
                    fetchApplicationFinancePlan(firstApp.applicationId);
                }
            },
            failureCallBack: (err: any) => {
                console.log(err)
                dispatch(routeChange('end'));

            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
    };

    const fetchPSBXData = async () => {
        const psbxApplications = applicationList
            .map((app, index) => ({ app, index }))
            .filter(({ app }) => app.programLenderResp?.programName?.startsWith("PSBX"));

        const requests = psbxApplications.map(({ app, index }) =>
            axios.post('/psbxService/partner/lead/get', { applicationId: app.applicationId })
                .then((psbxData: any) => {
                    const updatedApplications = [...applicationList];
                    updatedApplications[index] = {
                        ...updatedApplications[index],
                        programDetails: {
                            ...updatedApplications[index].programDetails,
                            psbLeadId: psbxData.psbLeadId,
                            leadStatus: psbxData.leadStatus,
                            leadCreationStatus: psbxData.leadCreationStatus,
                            offers: psbxData.offerDetails
                        }
                    };
                    setApplicationList(updatedApplications);
                })
                .catch(error => {
                    console.error(`PSBX data fetch failed for ${app.applicationId}:`, error);
                })
        );

        await Promise.all(requests);
    };

    const fetchApplicationFinancePlan = (applicationId: string) => {
        dispatch(routeChange('start'))

        let url = "/supermoney-service/application/finance/get";
        let request = {
            applicationId: applicationId,
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))
                console.log(response);
                setFinancePlan(response.getApplicationFinancePlanMappingResp[0]);
            },
            failureCallBack: (error: any) => {
                setFinancePlan(null);
                // handle error
                console.log("1display  ==" + error);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
    };

    const stagesFetch = (applicationId: string) => {

        let url = "/supermoney-service/stage/fetch";
        let request = {
            customerId: app.customerID,
            profileId: app.profileID,
            applicationId: applicationId,
            stageName: "Onboarding",
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))
                const stages = response.data;

                if (stages.length > 0) {
                    const stage = stages[0];
                    setOnboardingStage(stage.stageStatus);
                    customerProfile(applicationId);

                    if (stage.stageStatus === "CREATED" || stage.stageStatus === "IN_PROGRESS") {
                        // Set workflow ID logic here
                        dispatch(setWorkFlowID(stages.workFlowId))
                    } else {
                        stagesFetchCredit(applicationId);
                    }
                    
                } else {
                    setOnboardingStage("");
                }
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("1display  ==" + error);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
        if (!currentApplication) return;
    };

    const stagesFetchCredit = (applicationId: string, bID?: string) => {
        dispatch(routeChange('start'))

        let url = "/supermoney-service/stage/fetch";
        let request = {
            applicationId: applicationId,
            customerId: app.customerID,
            profileId: app.profileID,
            stageName: "CREDIT",
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))
                const stages = response.data;
                setCreditStage('Not Started')
                if (stages.length > 0) {
                    const stage = stages[0];
                    setCreditStage(stage.stageStatus);

                    if (stage.stageStatus === "APPROVED_BY_LENDER") {
                        setCreditStatus("Approved");
                        creditLimit(applicationId, bID);
                    } else if (stage.stageStatus === "REJECTED_BY_LENDER") {
                        setCreditStatus("Rejected");
                    } else {
                        setCreditStatus("In Process");
                    }
                }
            },
                failureCallBack: (error: any) => {
                    // handle error
                    console.log("1display  ==" + error);
                }
        }
        makeAPIPOSTRequest(url, {}, request, options)
    };

    const creditLimit = (applicationId: string, bID? : string) => {
        // if (!currentApplication) return;

        dispatch(routeChange('start'))
        let custId = Number(app.customerID);

        let data = {
            applicationId: Number(applicationId),
            customerId: custId,
        };
        // let timestamp = Math.round(+new Date() / 1000);
        const options = {
            successCallBack: (response: any) => {

                setTotalLimit(response.totalCreditLimit);
                setUtilisedLimit(response.utilizedCreditLimit);
                setAvailableLimit(response.unutilizedCreditLimit);
                // setAvilablePercentage(parseInt((response.unutilizedCreditLimit / response.totalCreditLimit) * 100));
                setAvilablePercentage((response.unutilizedCreditLimit / response.totalCreditLimit) * 100);
                dashboardApi(bID!);

                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.log("8display  ==" + error);
                dashboardApi(bID!);
                dispatch(routeChange('end'))
            }
        }
        makeAPIPOSTRequest('/credit-analytics-service/application/creditlimit/get', {}, data, options)

    };

    const dashboardApi = (b: string) => {
        // if (!borrowerId) return;
        console.log(borrowerId, "yash")

        let url =
            "/invoice-finance-services/invoice-services/finance/invoices/get/borrower";
        let data = {
            countFrom: 0,
            countTo: 20,
            companyName: app.companyName,
            borrowerId: b,
        };
        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))
                const invoiceDetails = response.invoiceDetails;

                // Combine all invoice statuses
                const allInvoices = [
                    ...invoiceDetails.REPAID.map((inv: any) => ({ ...inv, status: "REPAID" })),
                    ...invoiceDetails.REJECT.map((inv: any) => ({ ...inv, status: "REJECT" })),
                    ...invoiceDetails.SUBMITTED.map((inv: any) => ({ ...inv, status: "SUBMITTED" })),
                    ...invoiceDetails.APPROVED.map((inv: any) => ({ ...inv, status: "APPROVED" })),
                    ...invoiceDetails.AWAITING_APPROVAL.map((inv: any) => ({ ...inv, status: "AWAITING_APPROVAL" })),
                    ...invoiceDetails.IGNORED.map((inv: any) => ({ ...inv, status: "IGNORED" }))
                ];

                // Sort by date (newest first)
                allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setInvoiceList(allInvoices);
                setPayNowCard(invoiceDetails.APPROVED.length > 0);
                setAlert(false)
            },
            failureCallBack: (error: any) => {
                console.log("8display  ==" + error);
                setAlert(true);
                setAlertMessage(error.message);
                dispatch(routeChange('end'))
            }
        }
        makeAPIPOSTRequest(url, {}, data, options)
    };

    const customerProfile = (applicationId: string) => {
        // if (!currentApplication) return;

        dispatch(routeChange('start'))

        let url = "/supermoney-service/customer/profile";
        let request = {
            loginId: app.loginId,
            applicationId: applicationId,
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))
                if (!response.errorMessage) {
                    setBorrowerId(response.borrowerId);
                    setPanNumber(response.panNumber);
                    setBorrowerName(response.name);

                    if (response.borrowerId === "") {
                        createBorrower(applicationId, response.panNumber);
                    }
                    stagesFetchCredit(applicationId, response.borrowerId)
                } else {
                    setAlertMessage(response.errorMessage);
                    setAlert(true);
                }
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("1display  ==" + error);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
    };

    const createBorrower = (applicationId: string, paNNumber: any) => {
        // if (!currentApplication) return;

        dispatch(routeChange('start'))

        let url = "/mintLoan/mintloan/invoiceFinancing";
        let data = {
            invoiceType: "createBorrower",
            request: {
                companyName: companyName,
                supplierId: companyName == "YARAELECTRONICS" ? "200076" : "",
                planCode: "0@JIO_INAUGRAL",
                supplierBankDetailId:
                    companyName == "YARAELECTRONICS" ? "1" : "",
                name: borrowerName,
                phoneNumber: app.loginId,
                email: "",
                pan: paNNumber,
                gstinNumber: "",
                ifsc: "",
                bankAccountNo: "",
                applicationId: applicationId,
                externalId: JSON.stringify(parseInt(app.customerID!)),
                company: app.companyName,
                onboardingPartner: app.onboardingName,
            },
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

        const options = {
            successCallBack: (response: any) => {
                if (response.data.successFlag) {
                    dispatch(routeChange('end'))
                    dispatch(setAuthToken(response.header.authToken))
                    setBorrowerId(response.data.details.borrowerId);
                    // Store auth token logic here
                } else {
                    setAlertMessage(response.data.details.errors?.[0] || "Failed to create borrower");
                    setAlert(true);
                }
        },
            failureCallBack: (error: any) => {
                console.error('Failed to create borrower:', error);
            }
        }

        makeAPIPOSTRequest(url, {}, employeeDetails, options)
        
    };

    // UI Handlers
    const handleSwiper = (swiper: any) => {
        console.log('Swiper initialized:', swiper);
    };

    const handleSlideChange = (swiper: any) => {
        const newIndex = swiper.activeIndex;
        setOnboarding(newIndex + 1);
        setNewData(newIndex);
    };

    const setNewData = (index: number) => {
        if (applicationList[index]) {
            const app = applicationList[index];
            setCurrentApplication(app);
            setApplicationId(app.applicationId);
            setCompanyName(app.programDetails.company);
            setInvoiceUploadAvailable(app.programDetails.invoiceUploadAvailable);
            setMandateType(app.programDetails.mandateTypeAllowed);

            // Reset states
            setKycStage("COMPLETED");
            setCreditStage("Not Started");
            setOnboardingStage("");
            setActiveBankFlag(false);
            setActiveMandateFlag(false);
            setInvoiceList([]);

            stagesFetch(app.applicationId);
            fetchApplicationFinancePlan(app.applicationId);
        }

    };

    const dial = () => {
        const number = ["NETMEDS", "JIOMART"].includes(app.companyName!) ? mobile1 : mobile;
        window.open(`tel:${number}`, '_self');
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'SUBMITTED':
            case 'AWAITING_APPROVAL':
                return '#fb8c00';
            case 'REPAID':
                return '#4328AE';
            case 'APPROVED':
                return '#97C93E';
            case 'REJECT':
                return '#FF5252';
            default:
                return '#fb8c00';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'SUBMITTED':
            case 'AWAITING_APPROVAL':
                return 'In Process';
            case 'REPAID':
                return 'Repaid';
            case 'APPROVED':
                return 'Approved';
            case 'REJECT':
                return 'Rejected';
            default:
                return 'In Process';
        }
    };

    // Navigation methods
    const redirectToAllInvoice = () => {
        navigate(`/AllInvoices?applicationId=${applicationId}&borrowerId=${borrowerId}`);
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

    const redirectToDashBoard = () => {
        if (availableLimit === 0) {
            setAlertMessage("Credit Limit Is currently Not Available For This Account. Please Try After Sometime");
            setAlert(true);
            return;
        }

        const queryParams = new URLSearchParams({
            borrowerId,
            borrowerName,
            availableLimit: availableLimit.toString(),
            applicationId: currentApplication?.applicationId || '',
            companyName
        }).toString();

        if (activeBankFlag && activeMandateFlag) {
            navigate(`/SelectSupplier?${queryParams}`);
        } else if (activeBankFlag && !activeMandateFlag) {
            const path = mandateType === "others" ? "/BankMandateInfoInvoice" : "/UPIMandateInfoInvoice";
            navigate(`${path}?${queryParams}`);
        } else {
            navigate(`/BorrowerBankDetails?${queryParams}`);
        }
    };


    const redirectToAddInvoice = () => {
        navigate('/AddInvoice');
    };

    const openProgress = (app: Application) => {
        setApplicationId(app.applicationId);
        // Store application details logic here
        setStatusSheet(true);
    };

    const openStatusSheet = () => {
        setStatusSheet(true);
    };

    const closeStatusSheet = () => {
        setStatusSheet(false);
    };

    // Render methods
    const renderPaginationDots = () => {
        if (applicationList.length <= 1) return null;

        return (
            <div className="flex mt-4">
                {applicationList.map((_, index) => (
                    <button key={`btn-${index}`} className="mr-6">
                        {onboarding === index + 1 ? (
                            <div className="w-4 h-1 bg-[#7E67DA] rounded"></div>
                        ) : (
                            <Circle className="w-2 h-2 text-[#7E67DA] opacity-40" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    const renderPSBXCard = (app: Application) => (
        <div className="bg-[#f7f5ff] mx-4 mt-6 rounded-xl shadow-sm">
            <div className="p-5">
                <div className="mb-4">
                    <b>{app.programDetails.programName}</b>
                </div>

                <div className="mb-2">
                    <span className="font-semibold text-[#b39ddb]">Lead ID: </span>
                    <span className="text-[#7e67da]">{app.programDetails.psbLeadId}</span>
                </div>

                <div className="mb-2">
                    <span className="font-semibold text-[#b39ddb]">Lead Creation Status: </span>
                    <span className="text-[#7e67da]">{app.programDetails.leadCreationStatus}</span>
                </div>

                <div className="mb-4">
                    <span className="font-semibold text-[#b39ddb]">Lead Status: </span>
                    <span className="text-[#7e67da]">{app.programDetails.leadStatus}</span>
                </div>

                {app.programDetails.offers && app.programDetails.offers.length > 0 && (
                    <div>
                        <div className="font-semibold text-[#4328ae] mb-2">Offers</div>
                        {app.programDetails.offers.map((offer, index) => (
                            <div key={index} className="mb-3 p-3 bg-[#ede7f6] rounded-lg">
                                <div><b>Lender Name: </b> {offer.lendername}</div>
                                <div><b>Channel Partner Limit: </b> ₹{offer.channelpartnerlimit.toLocaleString('en-IN')}</div>
                                <div><b>Channel Partner ROI: </b> {offer.channelpartnerroi}%</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderApplicationCard = (app: Application) => (
        <div className="bg-[#f7f5ff] mx-4 mt-6 rounded-xl shadow-sm">
            {/* Header */}
            <div className="p-3">
                <div className="flex justify-between items-center">
                    <span className="font-bold">{app.programDetails.programName}</span>
                    {creditStage === "APPROVED_BY_LENDER" && (
                        <button
                            className="border border-[#7E67DA] rounded px-3 py-1 text-[#4328ae] font-bold text-sm"
                            onClick={redirectToAddInvoice}
                        >
                            Add Invoice
                        </button>
                    )}
                </div>

                <div className="flex items-center mt-1">
                    <img src={CompanyImage} className="h-4 w-4 mr-2" />
                    <div className="text-xs text-[#7e67da]">{app.programDetails.company}</div>
                </div>

                <div className="flex mt-1">
                    <div className="text-xs text-[#b39ddb]">Onboarding Partner</div>
                    <div className="text-xs text-[#7e67da] ml-1">{app.programDetails.onboardingPartner}</div>
                </div>
            </div>

            <hr className="border-t border-[#d1c4e9]" />

            {/* Status Sections */}
            {renderStatusSection(app)}

            {/* Recent Invoices */}
            {renderRecentInvoices()}

            {/* Action Sections */}
            {renderActionSection(app)}
        </div>
    );

    const renderStatusSection = (app: Application) => {
        if (onboardingStage === "") {
            return (
                <div className="text-center my-5">
                    <img src={NoApplication} className="mb-5 mx-auto" />
                    <span className="font-bold text-base text-[#4328ae] block">
                        You have not applied for any<br />invoice credit
                    </span>
                </div>
            );
        }

        if (onboardingStage === "CREATED" || onboardingStage === "IN_PROGRESS") {
            return (
                <div className="text-center my-5">
                    <img src={ApplicationInProgress} className="mb-5 mx-auto" />
                    <span className="font-bold text-base text-[#4328ae] block">
                        Application in Progress
                    </span>
                </div>
            );
        }

        if (applicationStage === "REJECTED") {
            return (
                <div className="text-center my-5">
                    <img src={ApplicationRejectedDashboard} className="mb-5 mx-auto" />
                    <span className="font-bold text-base text-[#ff5252] block">
                        Application Rejected !
                    </span>
                </div>
            );
        }

        if ((onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") &&
            (kycStage !== "COMPLETED" || creditStage !== "APPROVED_BY_LENDER") &&
            applicationStage !== "REJECTED") {
            return (
                <div className="text-center my-5">
                    <img src={OnboardingCompleted} className="mb-5 mx-auto" />
                    <span className="font-bold text-base text-[#4328ae] block">
                        Congratulations!<br />Onboarding is completed
                    </span>
                </div>
            );
        }

        return renderCreditLimitSection(app);
    };

    const renderCreditLimitSection = (app: Application) => {
        if (!(onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") ||
            kycStage !== "COMPLETED" || creditStage !== "APPROVED_BY_LENDER") {
            return null;
        }

        return (
            <div className="p-3">
                <span className="text-xs text-[#b39ddb]">
                    Application ID #{app.applicationId}
                </span>

                {invoiceList.length > 0 ? (
                    <>
                        <div className="flex mt-2">
                            <div className="w-1/2">
                                <span className="text-xs text-[#9c9ba1]">Financed</span>
                                <div className="text-base text-[#7e67da] font-bold">
                                    ₹{totalLimit.toLocaleString()}
                                </div>
                            </div>
                            <div className="w-1/2 text-right">
                                <span className="text-xs text-[#9c9ba1]">Remaining</span>
                                <div className="text-base text-[#7e67da] font-bold">
                                    ₹{availableLimit.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-[#D1C4E9] rounded-full h-1.5 mt-1 mb-3">
                            <div
                                className="bg-[#7E67DA] h-1.5 rounded-full"
                                style={{ width: `${avilablePercentage}%` }}
                            ></div>
                        </div>

                        {utilisedLimit > 0 && (
                            <>
                                <div className="text-xs text-[#9c9ba1] text-center">
                                    Total Outstanding
                                </div>
                                <div className="text-center mt-2">
                                    <button
                                        className="bg-[#7E67DA] text-white px-4 py-2 rounded font-bold w-11/12"
                                        onClick={() => redirectToPayment()}
                                    >
                                        PAY ₹{utilisedLimit.toLocaleString()}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex mt-2">
                            <div className="w-1/2">
                                <span className="text-xs text-[#636266]">Credit Limit</span>
                            </div>
                            <div className="w-1/2 text-right">
                                <div className="text-base text-[#7e67da] font-bold">
                                    ₹{totalLimit.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-[#D1C4E9] rounded-full h-1.5 mt-1 mb-3">
                            <div
                                className="bg-[#7E67DA] h-1.5 rounded-full"
                                style={{ width: `${avilablePercentage}%` }}
                            ></div>
                        </div>

                        <div className="flex mt-2 mb-8">
                            <div className="w-1/2">
                                <span className="text-xs text-[#9c9ba1]">Utilized Limit</span>
                                <div className="text-base text-[#636266] font-bold">
                                    ₹{utilisedLimit.toLocaleString()}
                                </div>
                            </div>
                            <div className="w-1/2 text-right">
                                <span className="text-xs text-[#9c9ba1]">Available Limit</span>
                                <div className="text-base text-[#636266] font-bold">
                                    ₹{availableLimit.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderRecentInvoices = () => {
        if (!(onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") ||
            kycStage !== "COMPLETED" || creditStage !== "APPROVED_BY_LENDER" ||
            invoiceList.length === 0) {
            return null;
        }

        return (
            <div className="bg-white rounded-t-2xl rounded-b-xl p-4 mx-4 mt-4">
                <div className="flex pb-3">
                    <div className="w-1/2 font-bold text-sm">Recent Invoices</div>
                    <div
                        className="w-1/2 text-right font-bold text-xs text-[#7e67da] cursor-pointer"
                        onClick={redirectToAllInvoice}
                    >
                        Show All
                    </div>
                </div>

                {invoiceList.slice(0, 3).map((invoice, index) => (
                    <div key={index}>
                        <div className="py-2.5">
                            <div className="flex">
                                <div className="w-3/5">
                                    <span className="text-sm text-[#a1a1a1]">
                                        {invoice.purchaseOrderNumber}
                                    </span>
                                </div>
                                <div className="w-2/5 text-right">
                                    <span className="text-sm text-[#666666]">
                                        ₹{(invoice.approvedInvoiceAmount > 0 ? invoice.approvedInvoiceAmount : invoice.invoiceAmount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex mt-1">
                                <div className="w-1/2">
                                    <span className="text-sm text-[#a1a1a1]">
                                        {formatDate(invoice.createdAt)}
                                    </span>
                                </div>
                                <div className="w-1/2 text-right">
                                    <span
                                        className="text-xs px-3 py-1 rounded-full text-white"
                                        style={{ backgroundColor: getStatusColor(invoice.status) }}
                                    >
                                        {getStatusText(invoice.status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {index < 2 && <hr className="border-t border-[#d1c4e9]" />}
                    </div>
                ))}
            </div>
        );
    };

    const renderActionSection = (app: Application) => {
        // Upload Invoice CTA at bottom
        if (invoiceUploadAvailable &&
            (onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") &&
            kycStage === "COMPLETED" && creditStage === "APPROVED_BY_LENDER" &&
            invoiceList.length > 0) {
            return (
                <div className="text-center p-4 cursor-pointer" onClick={redirectToDashBoard}>
                    <Upload className="inline w-4 h-4 mr-2 text-[#7e67da]" />
                    <span className="text-[#7e67da] font-bold">Upload Invoice</span>
                </div>
            );
        }

        // Main action sections
        return (
            <div className="bg-white rounded-t-2xl rounded-b-xl p-4 text-center">
                {onboardingStage === "" && (
                    <>
                        <div className="text-xs text-[#666666] py-2.5">
                            Apply Now to get instant invoice credit at affordable rate
                        </div>
                        <button
                            className="bg-[#4328ae] text-white px-6 py-3 rounded font-bold my-5"
                            onClick={() => openProgress(app)}
                        >
                            Apply Now
                        </button>
                    </>
                )}

                {(onboardingStage === "CREATED" || onboardingStage === "IN_PROGRESS") && (
                    <>
                        <div className="text-xs text-[#666666] py-2.5">
                            Click Check Status to get current <br />verification status
                        </div>
                        <button
                            className="bg-[#4328ae] text-white px-6 py-3 rounded font-bold my-5"
                            onClick={() => openProgress(app)}
                        >
                            Continue
                        </button>
                    </>
                )}

                {(onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") &&
                    (kycStage !== "COMPLETED" || creditStage !== "APPROVED_BY_LENDER") &&
                    applicationStage !== "REJECTED" && (
                        <>
                            <div className="text-xs text-[#666666] py-2.5">
                                Click Check Status to get current <br />verification status
                            </div>
                            <button
                                className="bg-[#4328ae] text-white px-6 py-3 rounded font-bold my-5"
                                onClick={openStatusSheet}
                            >
                                CHECK STATUS
                            </button>
                            <div className="text-xs text-[#666666] py-2.5">
                                For More Information contact
                            </div>
                            <div className="text-center cursor-pointer" onClick={dial}>
                                <Phone className="inline w-4 h-4 mr-2 text-[#7E67DA]" />
                                <span className="text-xs text-[#7e67da] font-bold">
                                    {["NETMEDS", "JIOMART"].includes(companyName) ? mobile1 : mobile}
                                </span>
                            </div>
                            <div className="text-xs text-[#666666] py-2.5">
                                from 9.30 am to 6.30 pm Monday to Saturday
                            </div>
                        </>
                    )}

                {applicationStage === "REJECTED" && (
                    <>
                        <div className="text-xs text-[#666666] py-2.5">
                            Your credit history does not <br />satisfy our acceptance criteria
                        </div>
                        <div className="text-xs text-[#666666] py-8">
                            For More Information contact
                        </div>
                        <button
                            className="bg-[#4328ae] text-white px-6 py-3 rounded font-bold my-1"
                            onClick={dial}
                        >
                            Contact Us
                        </button>
                        <div className="text-xs text-[#666666]">
                            from 9.30 am to 6.30 pm Monday to Saturday
                        </div>
                    </>
                )}

                {invoiceUploadAvailable &&
                    (onboardingStage === "INFORMATION_PROVIDED" || onboardingStage === "BE_MANUALSTEP") &&
                    kycStage === "COMPLETED" && creditStage === "APPROVED_BY_LENDER" &&
                    invoiceList.length === 0 && (
                        <>
                            <img src={UploadInvoiceDashboard} className="mx-auto" />
                            <div className="text-xs text-[#666666] py-2.5">
                                Upload Invoices and set up<br />
                                auto-repayment to utilize this limit
                            </div>
                            <button
                                className="bg-[#4328ae] text-white px-6 py-3 rounded font-bold my-5"
                                onClick={redirectToDashBoard}
                            >
                                <Upload className="inline w-4 h-4 mr-2" />
                                Upload Invoice
                            </button>
                        </>
                    )}
            </div>
        );
    };

    const renderStatusSheet = () => (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end transition-opacity ${statusSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-[#f7f5ff] w-full max-w-[450px] mx-auto rounded-t-2xl h-96">
                <div className="text-right">
                    <X
                        onClick={closeStatusSheet}
                        className="inline m-3 text-[#7E67DA] cursor-pointer"
                        size={24}
                    />
                </div>

                <div className="px-5">
                    <span className="text-[#4328ae] text-xl font-bold">Your Current status</span>

                    <div className="flex mt-5">
                        <div className="w-7/12">
                            <div>
                                <span className="text-sm font-bold">KYC Verification</span>
                                <br />
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-white text-xs mt-1 ${kycStatus === 'Approved' ? 'bg-[#97C93E]' :
                                            kycStatus === 'Rejected' ? 'bg-[#FF5252]' : 'bg-[#FB8C00]'
                                        }`}
                                >
                                    {kycStatus}
                                </span>
                            </div>

                            <div className="mt-6">
                                <span className="text-sm font-bold">Credit Approval</span>
                                <br />
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-white text-xs mt-1 ${creditStatus === 'Approved' ? 'bg-[#97C93E]' :
                                            creditStatus === 'Rejected' ? 'bg-[#FF5252]' : 'bg-[#FB8C00]'
                                        }`}
                                >
                                    {creditStatus}
                                </span>
                            </div>
                        </div>

                        <div className="w-5/12 text-right">
                            <img src={StatusIcon} className="w-32 inline-block" alt="Status" />
                        </div>
                    </div>

                    <div className="mt-12 text-xs">
                        Want more details about your current Status ?
                    </div>

                    <button
                        className="border border-[#7E67DA] text-[#7e67da] px-6 py-2 rounded font-bold mt-4 w-50"
                        onClick={dial}
                    >
                        <Phone className="inline w-4 h-4 mr-2" />
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    );

    if (applicationList.length === 0) {
        return (
            <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
                <div className="p-4">Loading applications...</div>
            </div>
        );
    }

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

            {/* Header */}
            <div className="px-6 py-4">
                <div className="w-full">
                    <span className="font-bold text-base text-[#4328ae]">
                        Invoice Credit
                    </span>
                    <br />
                    <span className="font-bold text-sm text-[#666666]">
                        All Programs
                    </span>
                    {renderPaginationDots()}
                </div>
            </div>

            {/* Application Cards */}
            {applicationList.length > 1 ? (
                <Swiper
                    slidesPerView={1.1}
                    spaceBetween={gapBetween}
                    onSwiper={handleSwiper}
                    onSlideChange={handleSlideChange}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {applicationList.map((app, index) => (
                        <SwiperSlide key={app.applicationId}>
                            {app.programLenderResp?.programName?.startsWith("PSBX")
                                ? renderPSBXCard(app)
                                : renderApplicationCard(app)
                            }
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                applicationList[0].programLenderResp?.programName?.startsWith("PSBX")
                    ? renderPSBXCard(applicationList[0])
                    : renderApplicationCard(applicationList[0])
            )}

            {/* Status Sheet Modal */}
            {renderStatusSheet()}
        </div>
    );
};

export default DashBoard;