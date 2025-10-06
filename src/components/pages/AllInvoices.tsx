import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Phone, Bell, Upload, ArrowUp, TriangleAlert, CircleX } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import LogoBlue from '../../assets/images/landinglogoblue.png';
import EmptyApprove from '../../assets/images/emptyApproveList.png';
import EmptyInProcess from '../../assets/images/emptyInProcessList.png';
import EmptyReject from '../../assets/images/emptyRejectList.png';
import EmptyRepaid from '../../assets/images/emptyRepaid.png';

import axios from 'axios';
declare const JSBridge: {
    call: (number: string) => void;
    redirectToBrowser: (url: string) => void;
};
// Types
interface SupplierDetails {
    name: string;
}

interface Invoice {
    purchaseOrderNumber: string;
    createdAt: string;
    approvedInvoiceAmount: number;
    invoiceAmount: number;
    supplierDetails: SupplierDetails;
    status: string;
}

interface EmptyState {
    image: string;
    title: string;
    description: string;
    showContact: boolean;
    showButton: boolean;
    buttonText?: string;
    buttonAction?: () => void;
}

const AllInvoices: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app)
    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [invoiceUploadAvailable, setInvoiceUploadAvailable] = useState(false);

    // Invoice lists
    const [approvedInvoiceList, setApprovedInvoiceList] = useState<Invoice[]>([]);
    const [inProgressList, setInProgressList] = useState<Invoice[]>([]);
    const [rejectedList, setRejectedList] = useState<Invoice[]>([]);
    const [repaidList, setRepaidList] = useState<Invoice[]>([]);

    // User data
    const [borrowerId, setBorrowerId] = useState("");
    const [totalLimit, setTotalLimit] = useState(0);
    const [utilizedLimit, setUtilizedLimit] = useState(0);
    const [availableLimit, setAvailableLimit] = useState(0);

    const mobile = "9920111300";
    const mobile1 = "02269516677";
    const notificationColor = "#4328AE";
    const companyName = "Example Corp"; // Replace with actual company name from store

    const showNumber = ["NETMEDS", "JIOMART"].includes(companyName) ? mobile1 : mobile;

    // Initialize
    useEffect(() => {
        const borrowerIdFromQuery = searchParams.get('borrowerId');
        // if (borrowerIdFromQuery) {
            setBorrowerId(borrowerIdFromQuery || '');
            dashboardApi(borrowerIdFromQuery || "");
            fetchApplicationId();
        // }
    }, []);

    const fetchApplicationId = () => {
        dispatch(routeChange('start'))

        let url = "/supermoney-service/customer/application/get";
        let request = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange('end'));
                const applications = res.getCustomerApplicationResponseList;
                if (applications.length > 0) {
                    setInvoiceUploadAvailable(applications[0].programDetails.invoiceUploadAvailable);
                }
            },
            failureCallBack: (error: any) => {
                console.log(error)
            }
        }

        makeAPIPOSTRequest(url, {}, request, options)
    };

    const dashboardApi = async (borrowerId: string) => {
        let url =
            "/invoice-finance-services/invoice-services/finance/invoices/get/borrower";
        let data = {
            countFrom: 0,
            countTo: 20,
            companyName: app.companyName,
            borrowerId: borrowerId,
        };

        dispatch(routeChange('start'))

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'));
                const invoiceDetails = response.invoiceDetails;

                // Process and categorize invoices
                const repaid = invoiceDetails.REPAID.map((inv: any) => ({ ...inv, status: "REPAID" }));
                const rejected = invoiceDetails.REJECT.map((inv: any) => ({ ...inv, status: "REJECT" }));
                const submitted = invoiceDetails.SUBMITTED.map((inv: any) => ({ ...inv, status: "SUBMITTED" }));
                const approved = invoiceDetails.APPROVED.map((inv: any) => ({ ...inv, status: "APPROVED" }));
                const awaiting = invoiceDetails.AWAITING_APPROVAL.map((inv: any) => ({ ...inv, status: "AWAITING_APPROVAL" }));

                // Combine in-progress invoices
                const inProgress = [...submitted, ...awaiting];

                // Sort by date (newest first)
                const sortByDate = (a: Invoice, b: Invoice) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

                setRepaidList(repaid.sort(sortByDate));
                setRejectedList(rejected.sort(sortByDate));
                setInProgressList(inProgress.sort(sortByDate));
                setApprovedInvoiceList(approved.sort(sortByDate));

            },
            failureCallBack: (error: any) => {
                console.error('Failed to fetch invoices:', error);
                setAlertMessage('Server Connection Failed');
                setAlert(true);
            }
        }

        makeAPIPOSTRequest(url, {}, data, options)
    };

    const dial = () => {
        const number = ["NETMEDS", "JIOMART"].includes(app.companyName || '') ? mobile1 : mobile;
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

    const customerProfile = () => {
        const applicationId = searchParams.get('applicationId');
        if (!applicationId) return;
        dispatch(routeChange('start'))

        let url = "/supermoney-service/customer/profile";
        let request = {
            loginId: app.loginId,
            applicationId: applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange('end'))
                if (res.errorMessage === "") {
                    setBorrowerId(res.borrowerId);
                    creditLimit(applicationId);
                } else {
                    setAlert(true);
                    setAlertMessage(res.errorMessage);
                }
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
            }
        }

        makeAPIPOSTRequest(url, {}, request, options);
    };

    const creditLimit = (applicationId: string) => {
        const borrowerId = searchParams.get('borrowerId')
        dispatch(routeChange('start'))
        let custId = Number(app.customerID);
        const instance = axios.create({
            baseURL:
                "https://.mintwalk.com/tomcatb/credit-analytics-service/application/creditlimit/",
            headers: { "content-type": "application/json" },
        });
        let data = {
            applicationId: Number(applicationId),
            customerId: custId,
        };

        instance
            .post("get", data)
            .then(function (response: any) {
                // self.approvedLimit =
                //   JSONData.data.loanLimitDetails[0].approvedLimit;
                setTotalLimit(response.totalCreditLimit);
                setUtilizedLimit(response.utilizedCreditLimit);
                setAvailableLimit(response.unutilizedCreditLimit);
                redirectToDashBoard(applicationId);

                dispatch(routeChange('end'))
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
                borrowerId && dashboardApi(borrowerId);
                dispatch(routeChange('start'))
            })
            .finally(function () {
                // always executed
            });
    };

    const redirectToDashBoard = (applicationId: string) => {
        if (availableLimit === 0) {
            setAlertMessage('Credit Limit Is currently Not Available For This Account. Please Try After Sometime');
            setAlert(true);
            return;
        }

        const queryParams = new URLSearchParams({
            borrowerId,
            availableLimit: availableLimit.toString(),
            applicationId: applicationId,
        }).toString();
        navigate(`/SelectSupplier?${queryParams}`);

    };

    const getTabColor = (tabIndex: number): string => {
        switch (tabIndex) {
            case 0: return '#97C93E'; // Approved - Green
            case 1: return '#FB8C00'; // In Process - Orange
            case 2: return '#FF5252'; // Rejected - Red
            case 3: return '#C2185B'; // Repaid - Pink
            default: return '#97C93E';
        }
    };

    const renderInvoiceCard = (invoice: Invoice) => (
        <div
            key={invoice.purchaseOrderNumber}
            className="bg-[#f7f5ff] rounded-lg p-5 mt-4"
        >
            <div className="flex items-start mb-5">
                <div className="w-3/5">
                    <div className="text-xs text-[#636266]">Invoice No.</div>
                    <div className="text-sm font-bold break-words mt-1">
                        {invoice.purchaseOrderNumber}
                    </div>
                </div>
                <div className="w-2/5 text-right">
                    <div className="text-xs text-[#636266]">Supplier</div>
                    <div className="text-sm font-bold mt-1">
                        {invoice.supplierDetails.name}
                    </div>
                </div>
            </div>

            <div className="flex items-start">
                <div className="w-1/2">
                    <div className="text-xs text-[#636266]">
                        {activeTab === 0 ? 'Invoice Date' : 'Date'}
                    </div>
                    <div className="text-sm font-bold mt-1">
                        {formatDate(invoice.createdAt)}
                    </div>
                </div>
                <div className="w-1/2 text-right">
                    <div className="text-xs text-[#636266]">Amount</div>
                    <div className="text-sm font-bold mt-1">
                        ₹{(invoice.approvedInvoiceAmount > 0 ? invoice.approvedInvoiceAmount : invoice.invoiceAmount).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEmptyState = (tabIndex: number) => {
        const emptyStates: Record<number, EmptyState> = {
            0: {
                image: EmptyApprove,
                title: "No approved invoice",
                description: "Contact customer care for\nmore information",
                showContact: true,
                showButton: false
            },
            1: {
                image: EmptyInProcess,
                title: "No invoice uploaded",
                description: "Upload invoice to see invoice\ndetails",
                showContact: false,
                showButton: true
            },
            2: {
                image: EmptyReject,
                title: "No rejected invoice",
                description: "Hurray ! You do not have any\nrejected invoices",
                showContact: false,
                showButton: false
            },
            3: {
                image: EmptyRepaid,
                title: "No invoice repaid",
                description: "Click to Pay Now to repay for\nyour invoices",
                showContact: false,
                showButton: true,
                buttonText: "Pay Now",
                buttonAction: redirectToPayment
            }
        };

        const state = emptyStates[tabIndex];

        return (
            <div className="text-center mt-36">
                <img src={state.image} alt="Empty state" className="mx-auto" />
                <div className="mt-15 text-center">
                    <div className="text-xl font-bold">{state.title}</div>
                    <div className="text-sm mt-3 mb-3 whitespace-pre-line">
                        {state.description}
                    </div>

                    {state.showContact && (
                        <div className="text-[#4328ae] cursor-pointer" onClick={dial}>
                            <Phone className="inline w-4 h-4 mr-1" />
                            {showNumber}
                        </div>
                    )}

                    {state.showButton && tabIndex === 1 && invoiceUploadAvailable && (
                        <button
                            className="bg-[#7E67DA] text-white px-10 py-3 rounded-lg font-bold mt-3"
                            onClick={customerProfile}
                        >
                            <ArrowUp className="inline w-4 h-4 mr-2" />
                            Upload
                        </button>
                    )}

                    {state.showButton && tabIndex === 3 && state.buttonText && state.buttonAction && (
                        <button
                            className="bg-[#7E67DA] text-white px-10 py-3 rounded-lg font-bold mt-3"
                            onClick={state.buttonAction}
                        >
                            {state.buttonText}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        const tabContents = [
            { data: approvedInvoiceList, emptyTab: 0 },
            { data: inProgressList, emptyTab: 1 },
            { data: rejectedList, emptyTab: 2 },
            { data: repaidList, emptyTab: 3 }
        ];

        const currentTab = tabContents[activeTab];

        return (
            <div className="mt-3 mx-4">
                {currentTab.data.length > 0 ? (
                    currentTab.data.map(invoice => renderInvoiceCard(invoice))
                ) : (
                    renderEmptyState(currentTab.emptyTab)
                )}
            </div>
        );
    };

    const tabs = [
        { name: "APPROVED", color: "#97C93E" },
        { name: "IN PROCESS", color: "#FB8C00" },
        { name: "REJECTED", color: "#FF5252" },
        { name: "REPAID", color: "#C2185B" }
    ];

    return (
        <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div
                    className="bg-[#ff5252] border border-red-400 text-white px-4 py-3 rounded relative mb-4 flex justify-between "
                    role="alert"
                >
                    {/* <strong className="font-bold">Error! </strong> */}
                    <TriangleAlert color={'#ff5252'} fill='white' size={30} />
                    <span className="content-center">{alertMessage}</span>
                    <div>
                        <button
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setAlert(false)}
                        >
                            <CircleX color={'#ff5252'} fill='white' size={30} />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-4 py-4">
                <div className="flex items-center">
                    <div className="w-1/5">
                        <ArrowLeft
                            onClick={() => navigate(-1)}
                            style={{ color: notificationColor }}
                            className="cursor-pointer"
                            size={24}
                        />
                    </div>
                    <div className="w-3/5 text-center">
                        <img
                            src={LogoBlue}
                            alt="logo"
                            className="w-34 mx-auto"
                        />
                    </div>
                    <div className="w-1/5 text-right cursor-pointer">
                        {/* Uncomment if you want to add bell icon */}
                        {/* <Bell style={{ color: notificationColor }} size={24} /> */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-10">
                <div className="px-4">
                    <div className="w-1/2">
                        <span className="font-bold text-xl text-[#4328ae]">
                            All Invoices
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 hide-scrollbar">
                    <div className="flex min-w-max px-4">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.name}
                                className={`flex-1 px-4 py-3 font-bold text-sm whitespace-nowrap ${activeTab === index
                                    ? 'border-b-2'
                                    : 'text-[#757575]'
                                    }`}
                                style={{
                                    color: activeTab === index ? tab.color : '#757575',
                                    borderBottomColor: activeTab === index ? tab.color : 'transparent'
                                }}
                                onClick={() => setActiveTab(index)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Indicator */}
                <div
                    className="h-0.5 transition-all duration-300"
                    style={{
                        // backgroundColor: getTabColor(activeTab),
                        transform: `translateX(${activeTab * 100}%)`,
                        width: '25%'
                    }}
                />

                {/* Tab Content */}
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AllInvoices;