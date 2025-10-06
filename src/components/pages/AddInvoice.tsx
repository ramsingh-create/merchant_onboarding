import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import axios from 'axios';
import uploadInvoice from "../../assets/images/uploadinvoicedocument.png";


// Types
interface AlertState {
    show: boolean;
    message: string;
    type: 'error' | 'success';
}

const AddInvoice: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app)

    // State management
    const [alert, setAlert] = useState<AlertState>({ show: false, message: '', type: 'error' });
    const [invoiceProofFileName, setInvoiceProofFileName] = useState('');
    const [ewayProofFileName, setEwayProofFileName] = useState('');
    const [invoiceProof, setInvoiceProof] = useState<File | null>(null);
    const [ewayBillProof, setEwayBillProof] = useState<File | null>(null);
    const [programName, setProgramName] = useState('');
    const [invoiceUploadAvailable, setInvoiceUploadAvailable] = useState(true);

    // Initialize
    useEffect(() => {
        const appId = searchParams.get('applicationId') || app.applicationId!;
        fetchApplicationId(appId);
    }, []);

    const showAlert = (message: string, type: 'error' | 'success' = 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: 'error' }), 5000);
    };

    const fetchApplicationId = (appId?: string) => {
        dispatch(routeChange('start'))

        let url = "/supermoney-service/customer/application/get";
        let request = {
            customerId: app.customerID,
            applicationId: appId,
        };

        const options = {
            successCallBack: (res: any) => {
                const applicationData = res.getCustomerApplicationResponseList[0];
                setProgramName(applicationData.programDetails.programName);
                setInvoiceUploadAvailable(applicationData.programDetails.invoiceUploadAvailable);
                dispatch(routeChange('end'))
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
                dispatch(routeChange('end'))
            }
        }

        makeAPIPOSTRequest(url, {}, request, options);
    };

    const onInvoiceProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInvoiceProof(file);
            setInvoiceProofFileName(file.name);
        }
    };

    const onEwayProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEwayBillProof(file);
            setEwayProofFileName(file.name);
        }
    };

    const mailInvoicesToEmailId = () => {
        dispatch(routeChange('start'))
        const appId = searchParams.get('applicationId') || app.applicationId!;


        let url = "https://uatgateway.supermoney.in/supermoney-service/email/send";
        let formData = new FormData();
        formData.append("emailId", "ashwathi@supermoney.in");
        formData.append(
            "subject",
            "Invoice Received for Application ID " + appId
        );
        formData.append(
            "body",
            `Please find attached invoice document for \n\nCustomer ID : ${app.customerID} \nApplication ID : ${appId}`
        );
        formData.append("imageUrls", invoiceProof as Blob);
        if (ewayBillProof) {
            formData.append("imageUrls", ewayBillProof);
        }

        axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": 'Bearer ' + app.authToken
            },
        })
            .then(function (response) {
                dispatch(routeChange('end'))
                const JSONData = response.data;
                if (JSONData.successFlag) {
                    showAlert('Invoice uploaded successfully!', 'success');

                    // Reset form
                    setInvoiceProofFileName('');
                    setEwayProofFileName('');
                    setInvoiceProof(null);
                    setEwayBillProof(null);

                    // Reset file inputs
                    const invoiceInput = document.getElementById('invoice-proof') as HTMLInputElement;
                    const ewayInput = document.getElementById('eway-proof') as HTMLInputElement;
                    if (invoiceInput) invoiceInput.value = '';
                    if (ewayInput) ewayInput.value = '';
                } else {
                    showAlert('Failed to upload invoice. Please try again.');
                }
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
            })
            .finally(function () {
                dispatch(routeChange('end'))
            });
    };

    const FileUploadButton = ({
        id,
        label,
        fileName,
        onFileChange
    }: {
        id: string;
        label: string;
        fileName: string;
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
        <label className="flex items-start cursor-pointer w-fit">
            <input
                id={id}
                type="file"
                className="hidden"
                onChange={onFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <div className="
        w-14 h-14 border-2 border-dashed border-[#7e67da] 
        bg-[#ede7fa] flex items-center justify-center 
        rounded-lg mr-4
      ">
                <span className="text-[#7e67da] text-3xl font-normal">+</span>
            </div>
            <div className="flex flex-col my-auto">
                <span className="text-[#7a7687] text-sm font-medium">
                    {label}
                </span>
                {fileName && (
                    <span className="text-[#4328ae] text-sm mt-1">
                        {fileName}
                    </span>
                )}
            </div>
        </label>
    );

    return (
        <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert.show && (
                <div className={`px-4 py-3 rounded relative mx-4 mt-4 ${alert.type === 'error'
                    ? 'bg-red-100 border border-red-400 text-red-700'
                    : 'bg-green-100 border border-green-400 text-green-700'
                    }`}>
                    {alert.message}
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setAlert({ ...alert, show: false })}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Header Section */}
            <div className="pt-10 pb-8 bg-[#f3f0fc]">
                <div
                    className="bg-[#f3f0fc] pb-11 pt-[10px] flex px-4 flex justify-around"
                    style={{
                        backgroundImage: "url('https://www.supermoney.in/pobbg.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <img
                        src={uploadInvoice}
                        alt="Bank Verification"
                        className="ml-2 mt-4"
                    />
                    <div className="text-start ml-10 mt-4">
                        <span className="text-[#4328ae] text-base font-bold">
                            Invoice Details
                        </span>
                        <br />
                        <span className="text-xs">
                            Upload invoice to be financed <br />
                            Upload E-way bill if details are not in invoice
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-t-3xl -mt-5 px-4 py-6">
                <div className="flex flex-col gap-7 mb-6">
                    {/* Invoice Proof Upload */}
                    <FileUploadButton
                        id="invoice-proof"
                        label="Upload Invoice Proof"
                        fileName={invoiceProofFileName}
                        onFileChange={onInvoiceProofUpload}
                    />

                    {/* E-way Bill Proof Upload */}
                    <FileUploadButton
                        id="eway-proof"
                        label="Upload E-way bill Proof"
                        fileName={ewayProofFileName}
                        onFileChange={onEwayProofUpload}
                    />

                    {/* Submit Button */}
                    <button
                        className={`
              bg-[#7E67DA] text-white py-3 rounded-lg font-bold 
              w-42 mt-2 transition-all
              ${!invoiceProofFileName ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6b5abc]'}
              ${app.preloader ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        onClick={mailInvoicesToEmailId}
                        disabled={!invoiceProofFileName || app.preloader}
                    >
                        {app.preloader ? 'Uploading...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInvoice;