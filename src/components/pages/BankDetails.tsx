import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';

// Import your image
import bankIcon from '../../assets/images/Bank.png';

interface Bank {
    id: string;
    name: string;
}

interface IFSCDetail {
    ifscCode: string;
    branch: string;
    city: string;
    status: string;
}

const BankDetails: React.FC = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [banklist, setBanklist] = useState<Bank[]>([]);
    const [bankID, setBankID] = useState<Bank | null>(null);
    const [bankIfsc, setBankIfsc] = useState<IFSCDetail | null>(null);
    const [ifscDetails, setIfscDetails] = useState<IFSCDetail[]>([]);
    const [accountType, setAccountType] = useState<string>('');
    const [accountNo, setAccountNo] = useState<string>('');
    const [accontName, setAccontName] = useState<string>('');
    const [setBankIDs, setSetBankID] = useState<string>('');
    const [accuntFlag, setAccuntFlag] = useState<boolean>(false);

    const [supplierName, setSupplierName] = useState<string>('');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [gst, setGst] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [borrowerId, setBorrowerId] = useState<string>('');
    const [availableLimit, setAvailableLimit] = useState<string>('');

    const accountTypes = ["Savings", "Current"];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const app = useSelector((state: RootState) => state.app);

    // Validation rules
    const rules = {
        required: (value: string) => !!value || "Required",
        accountno: (value: string) => {
            const pattern = /^[A-Za-z0-9 ]+$/;
            return pattern.test(value) || "Invalid Account number.";
        },
        name: (value: string) => {
            const pattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            return pattern.test(value) || "Invalid Name.";
        },
    };

    useEffect(() => {
        dispatch(routeChange("end"));
        setBorrowerId(searchParams.get('borrowerId') || '');
        setSupplierName(searchParams.get('name') || '');
        setGst(searchParams.get('gst') || '');
        setPhoneNo(searchParams.get('phoneNo') || '');
        setEmail(searchParams.get('email') || '');
        setAvailableLimit(searchParams.get('availableLimit') || '');
        bankListFun();
    }, [dispatch]);

    const bankIfscNew = (searchText: string) => {
        if (searchText.length > 4 && searchText.length < 11) {
            dispatch(routeChange("start"));
            const data = {
                bankCode: setBankIDs,
                searchTxt: searchText,
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
                successCallBack: (responseData: any) => {
                    dispatch(setAuthToken(responseData.header.authToken))
                    setIfscDetails(responseData.data.ifscDetails);
                    dispatch(routeChange("end"));
                },
                failureCallback: (error: any) => {
                    setAlert(true);
                    setAlertMessage(error.response?.data?.error?.[0]?.errorMessage || "Error fetching IFSC details");
                    dispatch(routeChange("end"));
                }
            };

            makeAPIPOSTRequest("/mintLoan/mintloan/ifscSearch", {}, employeeDetails, options);
        }
    };

    const bankListFun = () => {
        dispatch(routeChange("start"));
        let data = {};
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
            successCallBack: (responseData: any) => {
                setBanklist(responseData.data.bankDetails);
                dispatch(routeChange("end"));
            },
            failureCallback: (error: any) => {
                setAlert(true);
                setAlertMessage(error.response?.data?.error?.errorDesc || "Error fetching bank list");
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/getBankDetails", {}, employeeDetails, options);
    };

    const handleBankChange = (selectedBank: Bank) => {
        setBankID(selectedBank);
        setBankIfsc(null);
        setIfscDetails([]);

        dispatch(routeChange("start"));

        const data = {
            bankCode: selectedBank.id,
            searchTxt: selectedBank.name,
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
            successCallBack: (responseData: any) => {
                setIfscDetails(responseData.data.ifscDetails);
                setSetBankID(selectedBank.id);
                dispatch(routeChange("end"));
            },
            failureCallback: (error: any) => {
                setAlert(true);
                setAlertMessage(error.response?.data?.error?.[0]?.errorMessage || "Error fetching IFSC details");
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/ifscSearch", {}, employeeDetails, options);
    };

    const handleAccountNoChange = (value: string) => {
        if (value.length <= 18) {
            setAccountNo(value);
            // Check for special characters
            const character = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
            setAccuntFlag(!character.test(value));
        }
    };

    const addSupplier = () => {
        // Validation
        if (!bankID) {
            setAlertMessage("Please Select Bank Name");
            setAlert(true);
            return;
        }

        if (!accountNo || accountNo.length < 8 || !accuntFlag) {
            setAlertMessage("Please Enter Valid Bank Account Number");
            setAlert(true);
            return;
        }

        if (!bankIfsc) {
            setAlertMessage("Please Select IFSC Code");
            setAlert(true);
            return;
        }

        if (!accontName || accontName.length === 0) {
            setAlertMessage("Please Enter Valid Account Holder Name");
            setAlert(true);
            return;
        }

        if (!accountType) {
            setAlertMessage("Please Select Account Type");
            setAlert(true);
            return;
        }

        dispatch(routeChange("start"));

        const data = {
            invoiceType: "createSupplier",
            request: {
                companyName: app.companyName,
                borrowerId: borrowerId,
                planCode: "0@JIO_INAUGRAL",
                name: supplierName,
                phoneNumber: phoneNo,
                email: email,
                pan: "",
                gstinNumber: gst,
                address: "",
                city: "",
                state: "",
                pincode: "",
                ifscCode: bankIfsc.ifscCode,
                accountNo: accountNo,
                externalId: "",
                accountHolderName: accontName,
                accountType: accountType,
                bankName: bankID.name,
                branch: bankIfsc.branch,
                branchCity: bankIfsc.city,
                micrCode: "",
                documentStatus: "Under Process",
                docUrl: "",
                netbankEnabled: bankIfsc.status,
                maxDaysForFinance: 25,
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
            successCallBack: (responseData: any) => {
                const successFlag = responseData.data.successFlag;
                if (successFlag === true) {
                    dispatch(routeChange("end"));
                    navigate({
                        pathname: "/SelectSupplier",
                        search: new URLSearchParams({
                            borrowerId: borrowerId,
                            availableLimit: availableLimit,
                            applicationId: searchParams.get('applicationId') || '',
                        }).toString()
                    });
                } else {
                    let errorMessage = "Error creating supplier";
                    if (responseData.header?.hostStatus === "E") {
                        errorMessage = responseData.header?.error?.errorDesc || errorMessage;
                    } else {
                        errorMessage = responseData.data?.details?.errors?.[0] || errorMessage;
                    }
                    setAlertMessage(errorMessage);
                    setAlert(true);
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                console.error("Error adding supplier:", error);
                setAlertMessage("Error creating supplier");
                setAlert(true);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/invoiceFinancing", {}, employeeDetails, options);
    };

    const sortedIfscDetails = [...ifscDetails].sort((a, b) => {
        if (a.ifscCode < b.ifscCode) return -1;
        if (a.ifscCode > b.ifscCode) return 1;
        return 0;
    });

    return (
        <div className="max-w-[450px] text-left font-montserrat min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4">
                    {alertMessage}
                </div>
            )}

            <div className="h-auto pb-12 mx-4 mt-5">
                {/* Header Section */}
                <div className="flex items-start mb-8">
                    <div className="w-1/4 flex justify-center">
                        <img
                            src={bankIcon}
                            alt="Bank Details"
                            className="w-12 h-12"
                        />
                    </div>
                    <div className="w-3/4 pl-4">
                        <h1 className="text-base font-bold text-gray-900">
                            Supplier Bank Account
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Please provide the details of your supplier's Principal Bank
                            Account of Business
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                    {/* Bank Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Supplier Bank
                        </label>
                        <select
                            value={bankID?.id || ''}
                            onChange={(e) => {
                                const selectedBank = banklist.find(bank => bank.id === e.target.value);
                                if (selectedBank) handleBankChange(selectedBank);
                            }}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                        >
                            <option value="">Select Bank</option>
                            {banklist.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Account Number
                        </label>
                        <input
                            type="text"
                            value={accountNo}
                            onChange={(e) => handleAccountNoChange(e.target.value.toUpperCase())}
                            maxLength={18}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent uppercase"
                            placeholder="Enter account number"
                            onKeyPress={(e) => {
                                if (accountNo.length >= 18) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {accountNo && !rules.accountno(accountNo) && (
                            <p className="text-red-500 text-xs mt-1">Invalid Account number</p>
                        )}
                    </div>

                    {/* IFSC Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC code
                        </label>
                        <select
                            value={bankIfsc?.ifscCode || ''}
                            onChange={(e) => {
                                const selectedIfsc = ifscDetails.find(ifsc => ifsc.ifscCode === e.target.value);
                                setBankIfsc(selectedIfsc || null);
                            }}
                            onFocus={() => ifscDetails.length === 0 && bankID && bankIfscNew(bankID.name)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                        >
                            <option value="">Select IFSC Code</option>
                            {sortedIfscDetails.map((ifsc, index) => (
                                <option key={index} value={ifsc.ifscCode}>
                                    {ifsc.ifscCode} - {ifsc.branch}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Start typing to search IFSC..."
                            onChange={(e) => bankIfscNew(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent mt-2 text-sm"
                        />
                    </div>

                    {/* Account Holder Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name
                        </label>
                        <input
                            type="text"
                            value={accontName}
                            onChange={(e) => setAccontName(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                            placeholder="Enter account holder name"
                        />
                        <div className="text-xs text-[#4328ae] mt-2 leading-5">
                            Put Primary Account Holder Name for Joint Account
                        </div>
                        {accontName && !rules.name(accontName) && (
                            <p className="text-red-500 text-xs mt-1">Invalid Name</p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Type
                        </label>
                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                        >
                            <option value="">Select Account Type</option>
                            {accountTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={addSupplier}
                        className="w-1/2 bg-[#4328AE] text-white py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors mt-6"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankDetails;