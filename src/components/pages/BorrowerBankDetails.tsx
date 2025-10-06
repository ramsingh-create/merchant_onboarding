import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import bankverification from "../../assets/images/bankverification.png";

// Types
interface Bank {
    id: string;
    name: string;
}

interface BankDetails {
    bankName: string;
    isfcCode: string;
    name: string;
    accountType: string;
    bankAccountNo: string;
    accountHolderName: string;
    activeFlag: boolean;
    micrCode: string;
}

interface IFSCDetail {
    ifscCode: string;
    branch: string;
    city: string;
}


const BorrowerBankDetails: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app)
    const [searchParams] = useSearchParams();

    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    // Form state
    const [bankList, setBankList] = useState<Bank[]>([]);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNo, setAccountNo] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');
    const [ifscDetails, setIfscDetails] = useState<IFSCDetail[]>([]);
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [setBankID, setSetBankID] = useState('');

    // Bank selection state
    const [existingBank, setExistingBank] = useState(false);
    const [bankFinalList, setBankFinalList] = useState<BankDetails[]>([]);
    const [selectedBankIndex, setSelectedBankIndex] = useState(0);
    const [selectedBankDetails, setSelectedBankDetails] = useState<BankDetails | null>(null);

    // Route parameters
    const borrowerId = searchParams.get('borrowerId');
    const borrowerName = searchParams.get('borrowerName');
    const availableLimit = searchParams.get('availableLimit');
    const applicationId = searchParams.get('applicationId');
    const companyName = searchParams.get('companyName');

    const accountTypes = ["Savings", "Current"];

    // Validation rules
    const validateAccountNo = (value: string): boolean => {
        const pattern = /^[A-Za-z0-9 ]+$/;
        return pattern.test(value) && value.length >= 8 && value.length <= 18;
    };

    const validateName = (value: string): boolean => {
        const pattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
        return pattern.test(value) && value.length > 0;
    };

    // Initialize
    useEffect(() => {
        bankListFun();
    }, []);

    const bankListFun = () => {
        dispatch(routeChange('start'))

        let url = "/mintLoan/mintloan/getBankDetails";
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
            successCallBack: (response: any) => {

                let hostStatus = response.header.hostStatus;

                if (hostStatus === "S" || hostStatus === "s") {
                    dispatch(setAuthToken(response.header.authToken))
                    setBankList(response.data.bankDetails);

                    //self.getbankDetails();
                } else {
                    setAlertMessage(response.header.error?.errorDesc || 'Failed to load bank list');
                    setAlert(true);
                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
                dispatch(routeChange('end'))

            }
        }

        makeAPIPOSTRequest(url, {}, employeeDetails, options)
    };

    const handleBankIfscSearch = async (searchText: string) => {
        if (!selectedBank || searchText.length <= 4 || searchText.length >= 11) return;
        dispatch(routeChange('start'))

        let url = "/mintLoan/mintloan/ifscSearch";
        let data = {
            bankCode: selectedBank.id,
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
            successCallBack: (res: any) => {
                dispatch(setAuthToken(res.header.authToken))
                if (res.header.hostStatus === "S") {
                    setIfscDetails(res.data.ifscDetails);
                    setSetBankID(selectedBank.id);
                } else {
                    setAlertMessage(res.data.error?.[0]?.errorMessage || 'Failed to search IFSC');
                    setAlert(true);
                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.error('Failed to search IFSC:', error);
            }
        }

        makeAPIPOSTRequest(url, {}, employeeDetails, options);
    };

    const changeSelection = (index: number) => {
        setSelectedBankIndex(index);
        setSelectedBankDetails(bankFinalList[index]);
    };

    const toggleBankView = () => {
        setExistingBank(!existingBank);
    };

    const addNewBank = () => {
        if (existingBank && selectedBankDetails) {
            // Use existing bank
            const data = {
                accNo: selectedBankDetails.bankAccountNo,
                accType: selectedBankDetails.accountType,
                accHoldName: selectedBankDetails.accountHolderName,
                defaultAccountFlag: true,
                ifscCode: selectedBankDetails.isfcCode,
                micrCode: selectedBankDetails.micrCode,
                personalAccountFlag: true,
                applicationId: applicationId,
            };
            callAddBankFunction(data);
        } else {
            // Validate new bank form
            if (!selectedBank) {
                setAlertMessage("Please Select Bank Name");
                setAlert(true);
                return;
            }

            if (!validateAccountNo(accountNo)) {
                setAlertMessage("Please Enter Valid Bank Account Number");
                setAlert(true);
                return;
            }

            if (!bankIfsc || bankIfsc.length === 0) {
                setAlertMessage("Please Select Bank IFSC");
                setAlert(true);
                return;
            }

            if (!validateName(accountName)) {
                setAlertMessage("Please Enter Valid Name");
                setAlert(true);
                return;
            }

            if (!accountType) {
                setAlertMessage("Please Select Account Type");
                setAlert(true);
                return;
            }

            const data = {
                accNo: accountNo,
                accType: accountType,
                accHoldName: accountName,
                defaultAccountFlag: true,
                ifscCode: bankIfsc,
                micrCode: selectedBank?.id || '',
                personalAccountFlag: true,
                applicationId: applicationId,
            };

            callAddBankFunction(data);
        }
    };

    const callAddBankFunction = (data: any) => {
        dispatch(routeChange('start'))

        let url = "/mintLoan/mintloan/addBankV2";

        let msgHeader = {
            authToken: localStorage.getItem("authtoken"), //dynamic
            loginId: app.loginId,
            channelType: "M",
            consumerId: "414",
            deviceId: "SwiggyLoans",
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
            successCallBack: (res: any) => {
                let successFlag = res.data.successFlag;
                dispatch(setAuthToken(res.header.authToken))
                if (successFlag === true) {
                    const queryParams = new URLSearchParams({
                        borrowerId: borrowerId || '',
                        borrowerName: borrowerName || '',
                        availableLimit: availableLimit || '',
                        applicationId: applicationId || '',
                        companyName: companyName || ''
                    }).toString();
                    navigate(`/BankMandateInfoInvoice?${queryParams}`)
                } else {
                    const errorMsg = res.header.hostStatus === "E"
                        ? res.header.error.errorDesc
                        : res.data.message;
                    setAlertMessage(errorMsg);
                    setAlert(true);
                }
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.error('Failed to add bank:', error);
                setAlertMessage('Server Connection Failed');
                setAlert(true);
                dispatch(routeChange('end'))
            }
        }
        makeAPIPOSTRequest(url, {}, employeeDetails, options)
    };

    const sortedIfscDetails = ifscDetails.sort((a, b) =>
        a.ifscCode.localeCompare(b.ifscCode)
    );

    const renderBankCard = (bank: BankDetails, index: number) => (
        <div
            key={index}
            className={`bg-[#f7f5ff] rounded-xl p-5 mb-4 cursor-pointer transition-all ${selectedBankIndex === index ? 'border border-[#7E67DA]' : 'border-0'
                }`}
            onClick={() => changeSelection(index)}
        >
            <div className="flex justify-between mb-3">
                <div>
                    <div className="text-xs font-bold">HDFC Bank</div>
                    <div className="text-xs text-[#828282]">A/C : {bank.bankName}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-[#636266]">IFSC code</div>
                    <div className="text-xs font-bold">{bank.isfcCode}</div>
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                    <div className="text-xs text-[#636266]">Account Holder's Name</div>
                    <div className="text-xs font-bold">{bank.name}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-[#636266]">Account Type</div>
                    <div className="text-xs font-bold">{bank.accountType}</div>
                </div>
            </div>
        </div>
    );

    const renderNewBankForm = () => (
        <div className="mt-5 space-y-4">
            {/* Bank Select */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select your bank
                </label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E67DA]"
                    value={selectedBank?.id || ''}
                    onChange={(e) => {
                        const bank = bankList.find(b => b.id === e.target.value);
                        setSelectedBank(bank || null);
                    }}
                >
                    <option value="">Select Bank</option>
                    {bankList.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Account Number */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Number
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E67DA]"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    maxLength={18}
                    placeholder="Enter account number"
                />
            </div>

            {/* IFSC Code */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC code
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E67DA]"
                    value={bankIfsc}
                    onChange={(e) => {
                        setBankIfsc(e.target.value);
                        handleBankIfscSearch(e.target.value);
                    }}
                    placeholder="Enter IFSC code"
                    list="ifsc-list"
                />
                <datalist id="ifsc-list">
                    {sortedIfscDetails.map((ifsc, index) => (
                        <option key={index} value={ifsc.ifscCode} />
                    ))}
                </datalist>
            </div>

            {/* Account Holder Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E67DA]"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account holder name"
                />
                <div className="text-xs text-[#4328ae] mt-1 leading-5">
                    Put Primary Account Holder Name for Joint Account
                </div>
            </div>

            {/* Account Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                </label>
                <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7E67DA]"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                >
                    <option value="">Select Account Type</option>
                    {accountTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
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
                <div
                    className="bg-[#f3f0fc] pb-11 pt-[10px]"
                    style={{
                        backgroundImage: "url('https://www.supermoney.in/pobbg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <img
                        src={bankverification}
                        alt="Bank Verification"
                        className="ml-10 mt-14"
                    />
                    <div className="text-start ml-10 mt-4">
                        <span className="text-[#4328ae] text-base font-bold">
                            Bank Verification
                        </span>
                        <br />
                        <span className="text-xs">
                            Please provide the details of your Principal <br />
                            Bank Account of Business.
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress Bar - Hidden as per original code */}
            <div className="bg-[#ede7f6] mx-4 mt-5 p-3 rounded-lg flex items-center hidden">
                <div className="bg-[#97C93E] rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="text-black text-xs ml-2">/4</span>
                <span className="text-black text-xs ml-3">Bank Verification</span>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-t-3xl -mt-5 px-4 py-6">
                {/* Existing Banks */}
                {existingBank && bankFinalList.map((bank, index) =>
                    renderBankCard(bank, index)
                )}

                {/* Add New Bank Button */}
                {existingBank && (
                    <button
                        className="border border-[#7E67DA] text-[#7e67da] w-full py-3 rounded-lg font-bold flex items-center justify-center mb-6"
                        onClick={toggleBankView}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Bank
                    </button>
                )}

                {/* New Bank Form */}
                {!existingBank && renderNewBankForm()}

                {/* Submit Button */}
                <div className="pt-12 pb-6">
                    <button
                        className="bg-[#7E67DA] text-white w-full py-4 rounded-lg font-bold cursor-pointer"
                        onClick={addNewBank}
                        disabled={app.preloader}
                    >
                        {app.preloader ? 'Processing...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BorrowerBankDetails;