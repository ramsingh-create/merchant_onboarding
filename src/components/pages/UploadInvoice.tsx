import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Download, Archive, X, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import moment from 'moment';

// Import your images
import uploadInvoiceDocument from '../../assets/images/uploadinvoicedocument.png';
import noInvoiceImage from '../../assets/images/noinvoice.png';

interface InvoiceDetailsProps {
    availableLimit?: string;
    supplierName?: string;
    supplierID?: string;
    borrowerId?: string;
    companyName?: string;
    applicationId?: string;
}

const UploadInvoice: React.FC = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().substr(0, 10));
    const [dueDate, setDueDate] = useState<string>(new Date().toISOString().substr(0, 10));
    const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
    const [showDueDatePicker, setShowDueDatePicker] = useState<boolean>(false);
    const [sheet, setSheet] = useState<boolean>(false);
    const [supplierName, setSupplierName] = useState<string>('');
    const [invoiceAmount, setInvoiceAmount] = useState<string>('');
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [supplierID, setSupplierID] = useState<string>('');
    const [borrowerId, setBorrowerId] = useState<string>('');
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>('');
    const [fileLocation, setFileLocation] = useState<string>('');
    const [docTypeId, setDocTypeId] = useState<string>('');
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const [invoiceID, setInvoiceID] = useState<string>('');
    const [docSeqId, setDocSeqId] = useState<string>('');
    const [availableLimit, setAvailableLimit] = useState<string>('');
    const [invoiceFlag, setInvoiceFlag] = useState<boolean>(false);
    const [frontPubLocation, setFrontPubLocation] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);
    const [searchParams] = useSearchParams();

    const downloadImg = () => {
        if (docSeqId != null) {
            if (invoiceFile != null) {
                let breakDown = invoiceFile.name.split(".");
                const fileExtension = breakDown[breakDown.length - 1];
                setFileType(fileExtension);

            
            const url = `https://.mintwalk.com/python/mlS3Read?customerID=${app.customerID}&docSeqID=${docSeqId}`;

            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    let blobUrl = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");
                    a.download = `${invoiceID}.${fileExtension}`;
                    a.href = blobUrl;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            console.log("downloading", url);
            }
        }
    };

    const archiveImage = () => {
        setInvoiceFile(null);
    };

    const closeBottomSheet = () => {
        setSheet(false);
    };

    const chooseFiles = () => {
        closeBottomSheet();
        const input = document.getElementById('invoiceImage') as HTMLInputElement;
        if (input) {
            input.click();
        }
    };

    const checkInvoiceImageUploaded = () => {
        if (fileUploaded) {
            finalUploadInvoice();
        } else {
            setSheet(true);
        }
    };

    const finalUploadInvoice = () => {
        closeBottomSheet();
        dispatch(routeChange("start"));

        const data = {
            invoiceType: "createInvoice",
            request: {
                companyName:searchParams.get('companyName'),
                supplierId: searchParams.get('supplierId'),
                borrowerId: searchParams.get('borrowerId'),
                purchaseOrderNumber: invoiceNumber,
                invoiceAmount: invoiceAmount,
                invoiceDate: moment(date).format("YYYY-MM-DD"),
                invoiceDueDate: moment(dueDate).format("YYYY-MM-DD"),
                submittedBy: "app",
                invoiceUrl: frontPubLocation,
                byBorrower: true,
            },
        };
        let timestamp = Math.round(+new Date() / 1000);
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
                    setInvoiceID(responseData.data.details.invoiceId);
                    dispatch(routeChange("end"));

                    navigate({
                        pathname: "/InvoiceLoanDetails",
                        search: new URLSearchParams({
                            invoiceIDSent: responseData.data.details.invoiceId,
                            invoiceID: invoiceNumber,
                            invoiceAmount: invoiceAmount,
                            supplier: searchParams.get('supplierName') || '',
                            supplierID: searchParams.get('supplierId') || '',
                            invoiceDate: date,
                            docSeqId: docSeqId,
                            applicationId: searchParams.get('applicationId') || '',
                            fileType: fileType,
                        }).toString()
                    });
                } else {
                    const errors = responseData.data.details.errors[0];
                    setAlert(true);
                    setAlertMessage(errors);
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                console.error("Error creating invoice:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/invoiceFinancing", {}, employeeDetails, options);
    };

    const createInvoice = () => {
        if (!invoiceAmount || invoiceFlag) {
            setAlertMessage("Enter Valid Invoice Amount.");
            setAlert(true);
            return;
        }

        if (Number(invoiceAmount) < 500) {
            setAlertMessage("Invoice Amount Should Be Greater Than 500.");
            setAlert(true);
            return;
        }

        if (!invoiceNumber) {
            setAlertMessage("Enter Valid Invoice Number");
            setAlert(true);
            return;
        }

        if (!date) {
            setAlertMessage("Enter Valid Date Of Invoice");
            setAlert(true);
            return;
        }

        if (!dueDate) {
            setAlertMessage("Enter Valid Due Date");
            setAlert(true);
            return;
        }

        checkInvoiceImageUploaded();
    };

    const uploadStatus = () => {
        dispatch(routeChange("start"));

        const data = {
            profileId: app.profileID,
            documentDetails: [
                {
                    docSeqId: "",
                    docStatus: "N",
                    docTypeId: docTypeId,
                    docURL: fileLocation,
                    applicationId: searchParams.get('applicationId'),
                },
            ],
        };

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
            successCallBack: (responseData: any) => {
                const successFlag = responseData.data.successFlag;
                if (successFlag === true) {
                    setFileUploaded(true);
                    setDocSeqId(responseData.data.docSeqId);
                    dispatch(routeChange("end"));
                } else {
                    let errorMessage = "Upload failed";
                    if (responseData.header?.hostStatus === "E") {
                        errorMessage = responseData.header?.error?.errorDesc ||
                            responseData.data?.errorDetails?.errorDesc ||
                            errorMessage;
                    } else {
                        errorMessage = responseData.data?.errorDetails?.[0]?.errorDesc || errorMessage;
                    }
                    setAlertMessage(errorMessage);
                    setAlert(true);
                    dispatch(routeChange("end"));
                }
            },
            failureCallback: (error: any) => {
                console.error("Error uploading status:", error);
                dispatch(routeChange("end"));
            }
        };

        makeAPIPOSTRequest("/mintLoan/mintloan/kycDocumentUploadStatus", {}, employeeDetails, options);
    };

    const uploadInvoice = (file: File) => {
        dispatch(routeChange("start"));
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "data",
            JSON.stringify({
                custid: "407",
                filetype: "OTHER",
                filename: file.name,
                access: "PRIVATE"
            })
        );
        formData.append(
            "msgHeader",
            JSON.stringify({
                loginId: app.loginId,
                consumerId: "414",
                authToken: localStorage.getItem("authtoken"),
                channelType: "M",
                deviceId: "SwiggyLoans",
                source: "WEB"
            })
        );

        fetch("/mintLoan/mintloan/uploadFile", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(responseData => {
                const successFlag = responseData.data.successFlag;
                dispatch(setAuthToken(responseData.header.authToken));

                if (successFlag === true) {
                    setDocTypeId("160");
                    setFileLocation(responseData.data.fileLocation);
                    setFrontPubLocation(responseData.data.pubFileLocation);
                    uploadStatus();
                } else {
                    let errorMessage = "Upload failed";
                    if (responseData.header?.hostStatus === "E") {
                        errorMessage = responseData.header?.error?.errorDesc ||
                            responseData.data?.errorDetails?.errorDesc ||
                            errorMessage;
                    } else {
                        errorMessage = responseData.data?.errorDetails?.[0]?.errorDesc || errorMessage;
                    }
                    setAlertMessage(errorMessage);
                    setAlert(true);
                    dispatch(routeChange("end"));
                }
            })
            .catch(error => {
                console.error("Upload error:", error);
                setAlertMessage("Server Connection Failed");
                setAlert(true);
                dispatch(routeChange("end"));
            });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setInvoiceFile(file);
            uploadInvoice(file);
        }
    };

    const handleInvoiceAmountChange = (value: string) => {
        setInvoiceAmount(value);

        if (value && Number(value) > Number(availableLimit)) {
            setAlert(true);
            setInvoiceFlag(true);
            setAlertMessage("Amount Cannot Be Greater Than Available Limit");
        } else {
            setAlert(false);
            setInvoiceFlag(false);
        }
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
                {/* <div className="bg-gradient-to-b from-purple-50 to-white pt-14 pb-8">
                    <div className="flex items-start px-10">
                        <img
                            src={uploadInvoiceDocument}
                            alt="Upload Invoice"
                            className="w-16 h-16"
                        />
                        <div className="ml-4">
                            <h1 className="text-[#4328ae] text-base font-bold">
                                Invoice Details
                            </h1>
                            <p className="text-xs text-gray-600 mt-1">
                                Enter the details below to complete<br />
                                invoice upload
                            </p>
                        </div>
                    </div>
                </div> */}
                <div
                    className="bg-cover bg-center pt-14 pb-8"
                    style={{
                        backgroundImage: 'linear-gradient(to bottom, #f3f0fc, #ffffff)',
                        background: '#f3f0fc'
                    }}
                >
                    <div className="flex flex-col items-start px-10" style={{
                        backgroundImage: 'url("https://www.supermoney.in/pobbg.png")',
                        backgroundColor: '#f3f0fc',
                        paddingBottom: '45px',
                    }}>
                        <img
                            src={uploadInvoiceDocument}
                            alt="Supplier Header"
                            className="w-16 h-16"
                        />
                        <div className="mt-4">
                            <h1 className="text-[#4328ae] text-base font-bold">
                                Invoice Details
                            </h1>
                            <p className="text-xs text-gray-600 mt-1">
                                Enter the details below to complete<br />
                                invoice upload
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="mt-[-20px] bg-white rounded-[22px] px-4 py-6 mx-4 shadow-sm">
                    {/* Supplier Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier
                        </label>
                        <input
                            type="text"
                            value={supplierName}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                    </div>

                    {/* Invoice Amount */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Amount
                        </label>
                        <input
                            type="number"
                            value={invoiceAmount}
                            onChange={(e) => handleInvoiceAmountChange(e.target.value)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent"
                            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                        />
                    </div>

                    {/* Invoice Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                        </label>
                        <input
                            id="invoiceNumber"
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent uppercase"
                        />
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Invoice
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent"
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            <div className="text-xs text-[#2c2c2c] mt-1">DD-MM-YYYY format</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due By
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent"
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                            <div className="text-xs text-[#2c2c2c] mt-1">DD-MM-YYYY format</div>
                        </div>
                    </div>

                    <hr className="border-gray-300 my-6" />

                    {/* File Upload Section */}
                    {!invoiceFile ? (
                        <button
                            onClick={chooseFiles}
                            className="w-full border-2 border-[#7E67DA] text-[#7E67DA] py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors mt-5"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Upload Document</span>
                        </button>
                    ) : (
                        <div className="mt-5 p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#97C93E]" />
                                    <span className="text-sm text-gray-600">
                                        {invoiceFile.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={downloadImg} className="text-[#7E67DA] hover:text-purple-700">
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button onClick={archiveImage} className="text-[#7E67DA] hover:text-purple-700">
                                        <Archive className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hidden file input */}
                    <input
                        id="invoiceImage"
                        type="file"
                        className="hidden"
                        accept="image/png, image/jpeg, image/bmp, application/pdf"
                        onChange={handleFileChange}
                    />

                    {/* Continue Button */}
                    <div className="pt-12 pb-8">
                        <button
                            onClick={createInvoice}
                            className="w-full bg-[#7E67DA] text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Sheet */}
            {sheet && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 max-w-[450px] mx-auto">
                    <div className="bg-[#f7f5ff] w-full rounded-t-2xl h-[360px]">
                        <div className="text-right p-2">
                            <X
                                className="w-6 h-6 text-[#7E67DA] inline-block cursor-pointer"
                                onClick={closeBottomSheet}
                            />
                        </div>
                        <div className="px-5 pb-5">
                            <div className="text-center">
                                <img src={noInvoiceImage} alt="No Invoice" className="mx-auto w-24 h-24" />
                            </div>
                            <div className="mt-5 font-semibold text-sm text-[#636266] leading-relaxed text-center">
                                Do you want to continue without uploading any invoice image?
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <button
                                    onClick={chooseFiles}
                                    className="bg-[#7E67DA] text-white py-3 px-6 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Invoice</span>
                                </button>
                                <button
                                    onClick={finalUploadInvoice}
                                    className="border-2 border-[#7E67DA] text-[#4328ae] py-3 px-6 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadInvoice;