import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import SupplierHead from '../../assets/images/supplierheader.png'

// Types
interface Supplier {
    id: string;
    name: string;
    supplierId: string;
    gstinNumber: string;
    phoneNumber: string;
    company: string;
    supplierStatus: 'Approved' | 'Awaiting Approval' | 'Reject';
}


const SelectSupplier: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app)

    // State management
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [supplierDetailList, setSupplierDetailList] = useState<Supplier[]>([]);
    const [approvedSupplier, setApprovedSupplier] = useState<Supplier[]>([]);
    const [awaitingApproval, setAwaitingApproval] = useState<Supplier[]>([]);
    const [rejectSupplier, setRejectSupplier] = useState<Supplier[]>([]);

    // Route parameters
    const borrowerId = searchParams.get('borrowerId');
    const availableLimit = searchParams.get('availableLimit');
    const applicationId = searchParams.get('applicationId');
    const companyName = searchParams.get('companyName');

    // Initialize
    useEffect(() => {
        if (app.companyName === "YARAELECTRONICS") {
            // Auto-redirect for YARAELECTRONICS
            const queryParams = new URLSearchParams({
                supplierName: "YARA ELECTRONICS PRIVATE LIMITED",
                supplierID: "64",
                borrowerId: borrowerId as string,
                availableLimit: availableLimit as string,
                supplierType: "APPROVED",
                companyName: companyName as string,
            }).toString();
            navigate(`/UploadInvoice?${queryParams}`);
        } else {
            getSupplier();
        }
    }, []);

    const getSupplier = () => {
        // if (!borrowerId) {
        //     setAlertMessage('Borrower ID not found');
        //     setAlert(true);
        //     return;
        // }
        dispatch(routeChange('start'))

        let url =
            "https://.mintwalk.com/invoice-finance-services/invoice-services/borrower/get";
        let data = {
            borrowerId: borrowerId,
        };
        
        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'))

                if (response.borrowerId) {
                    const suppliers = response.suppliers;

                    // Categorize suppliers by status
                    const approved: Supplier[] = [];
                    const awaiting: Supplier[] = [];
                    const rejected: Supplier[] = [];
                    const allSuppliers: Supplier[] = [];

                    suppliers.forEach((supplier: Supplier) => {
                        if (supplier.supplierStatus === 'Approved') {
                            approved.push(supplier);
                            allSuppliers.push(supplier);
                        } else if (supplier.supplierStatus === 'Awaiting Approval') {
                            awaiting.push(supplier);
                            allSuppliers.push(supplier);
                        } else if (supplier.supplierStatus === 'Reject') {
                            rejected.push(supplier);
                        }
                    });

                    setApprovedSupplier(approved);
                    setAwaitingApproval(awaiting);
                    setRejectSupplier(rejected);
                    setSupplierDetailList(allSuppliers);
                } else {
                    setAlertMessage(response.error[0].errorMessage);
                    setAlert(true);
                }
            },
            failureCallBack: (error: any) => {
                dispatch(routeChange('end'))
                console.log("display  ==" + error);
            }
        }

        makeAPIPOSTRequest(url, {}, data, options)
    };

    const sendSupplier = (supplierName: string, supplierID: string) => {
         const queryParams = new URLSearchParams({
            supplierName: supplierName,
            supplierID: supplierID,
            borrowerId: borrowerId as string,
            availableLimit: availableLimit as string,
            supplierType: "APPROVED",
            applicationId: applicationId as string,
            companyName: companyName as string,
        }).toString(); 
        navigate(`/UploadInvoice?${queryParams}`)
    };

    const addNewSupplier = () => {
        const queryParams = new URLSearchParams({
            borrowerId: borrowerId as string,
            availableLimit: availableLimit as string,
            applicationId: applicationId as string,
            companyName: companyName as string
        }).toString();

        navigate(`/AddSupplier?${queryParams}`)
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'Awaiting Approval':
                return '#fb8c00';
            case 'Approved':
                return '#97C93E';
            case 'Reject':
                return '#FF5252';
            default:
                return '#fb8c00';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'Awaiting Approval':
                return 'In Process';
            case 'Approved':
                return 'Approved';
            case 'Reject':
                return 'Rejected';
            default:
                return 'In Process';
        }
    };

    const renderSupplierCard = (supplier: Supplier) => (
        <div
            key={supplier.id}
            className="bg-[#f7f5ff] rounded-xl mx-1 my-5 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => sendSupplier(supplier.name, supplier.supplierId)}
        >
            <div className="flex items-center mb-3">
                <div className="w-3/4">
                    <div className="text-xs text-[#666666]">Supplier Name</div>
                    <div className="text-sm font-bold text-[#333333]">
                        {supplier.name}
                    </div>
                </div>
                <div className="w-1/4 text-right">
                    <span
                        className="text-xs px-3 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: getStatusColor(supplier.supplierStatus) }}
                    >
                        {getStatusText(supplier.supplierStatus)}
                    </span>
                </div>
            </div>

            <hr className="border-t border-[#d1c4e9] my-3" />

            <div className="mb-3">
                <div className="text-xs text-[#666666]">GSTIN</div>
                <div className="text-sm font-bold text-[#333333]">
                    {supplier.gstinNumber}
                </div>
            </div>

            <hr className="border-t border-[#d1c4e9] my-3" />

            <div>
                <div className="text-xs text-[#666666]">Phone Number</div>
                <div className="text-sm font-bold text-[#333333]">
                    {supplier.phoneNumber}
                </div>
            </div>

            {/* Company Name - Commented out as per original code */}
            {/* <hr className="border-t border-[#d1c4e9] my-3" />
      <div>
        <div className="text-xs text-[#666666]">Company Name</div>
        <div className="text-sm font-bold text-[#333333]">
          {supplier.company}
        </div>
      </div> */}
        </div>
    );

    const renderEmptyState = () => (
        <div className="text-center py-10">
            <div className="text-[#666666] text-lg mb-4">No Suppliers Found</div>
            <div className="text-[#a1a1a1] text-sm mb-6">
                You don't have any approved suppliers yet.
            </div>
            <button
                className="border border-[#4328ae] text-[#4328ae] px-6 py-2 rounded font-bold"
                onClick={addNewSupplier}
            >
                + Add New Supplier
            </button>
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
                        src={SupplierHead}
                        alt="Supplier Header"
                        className="w-16 h-16"
                    />
                    <div className="mt-4">
                        <span className="text-[#4328ae] text-base font-bold block">
                            Select Supplier
                        </span>
                        <span className="text-[#666666] text-xs block mt-1">
                            Please select supplier details
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-t-3xl -mt-5 px-4 pb-8">
                {supplierDetailList.length > 0 && (
                    <div>
                        {supplierDetailList.map(supplier => renderSupplierCard(supplier))}

                        {/* Add New Supplier Button - Hidden as per original code */}
                        <button
                            className="border border-[#4328ae] text-[#4328ae] px-6 py-3 rounded font-bold w-full mt-4 hidden"
                            onClick={addNewSupplier}
                        >
                            + Add New Supplier
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectSupplier;