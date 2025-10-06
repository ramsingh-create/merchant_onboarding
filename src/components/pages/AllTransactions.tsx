// AllTransactions.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, ChevronDown, Download, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import * as XLSX from 'xlsx';
import moment from 'moment';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";

interface ProgramDetails {
  programName: string;
  company: string;
}

interface ApplicationItem {
  applicationId: string;
  programDetails: ProgramDetails;
}

interface TransactionItem {
  invoiceNo: string;
  transactionDate: string;
  loanId: string;
  amount: number;
}

export const AllTransactions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [transactionList, setTransactionList] = useState<TransactionItem[]>([]);
  const [applicationList, setApplicationList] = useState<ApplicationItem[]>([]);
  const [applicationSelected, setApplicationSelected] = useState<ApplicationItem | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');

  useEffect(() => {
    dispatch(routeChange('start'));
    fetchApplicationId();
  }, []);

  const dial = () => {
    const number = app.companyName === "NETMEDS" || app.companyName === "JIOMART"
      ? "02269516677"
      : "9920111300";

    try {
      // @ts-ignore - Assuming JSBridge exists in global scope
      JSBridge.call(number);
    } catch (err) {
      window.open(`tel:${number}`, "_self");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const downloadTransaction = () => {
    if (!applicationSelected) return;

    const fileData = XLSX.utils.json_to_sheet(getTransactionList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, fileData, "File");

    const b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    console.log(b64);

    try {
      // @ts-ignore - Assuming JSBridge exists in global scope
      JSBridge.download(b64, `AllTransactions_${applicationSelected.applicationId}`, "xlsx");
    } catch (err) {
      XLSX.writeFile(wb, `AllTransactions_${applicationSelected.applicationId}.xlsx`);
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("DD MMM, YYYY");
  };

  const setData = () => {
    if (!applicationSelected) return;
    fetchTransaction(applicationSelected.applicationId);
  };

  const fetchTransaction = (applicationId: string) => {
    dispatch(routeChange('start'));

    const request = {
      customerId: app.customerID,
      applicationId: applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        setTransactionList(res.transactionDetailsResp || []);
      },
      failureCallBack: (error: any) => {
        console.log(error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/supermoney-service/payment/transactions/get', {}, request, options);
  };

  const fetchApplicationId = () => {
    const request = {
      customerId: new URLSearchParams(window.location.search).get('customerId'),
    };

    // console.log("Nitin==");
    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        const applicationList = res.getCustomerApplicationResponseList || [];
        setApplicationList(applicationList);
        if (applicationList.length > 0) {
          const appselect = applicationList.find((item: any) => item.applicationId == new URLSearchParams(window.location.search).get('applicationId'))
          setApplicationSelected(appselect);
          setTimeout(() => {
            fetchTransaction(appselect);
          }, 0);
        }
      },
      failureCallBack: (error: any) => {
        // handle error
      }
    };

    makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, request, options);
  };

  const handleApplicationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedApp = applicationList.find(app => app.applicationId === event.target.value);
    if (selectedApp) {
      setApplicationSelected(selectedApp);
      setData();
    }
  };

  // Filter transactions based on invoice number search
  const getTransactionList = invoiceNumber
    ? transactionList.filter(item =>
      item.invoiceNo.toLowerCase().includes(invoiceNumber.toLowerCase())
    )
    : transactionList;

  return (
    <div className="max-w-[450px] mx-auto text-left font-['Montserrat'] min-h-screen bg-[#f3f0fc]">
      <div className="h-auto bg-[#f3f0fc] pb-12">
        {/* Header */}
        <div className="p-4 ">
          <div className="flex items-center">
            <div className="w-1/4 text-left">
              <ArrowLeft
                className="cursor-pointer text-[#4328ae]"
                size={24}
                onClick={goBack}
              />
            </div>
            <div className="w-2/4 text-center">
              <img
                className="w-32 mx-auto"
                alt="logo"
                src={landingLogoBlue}
              />
            </div>
            <div className="w-1/4 text-right">
              <Phone
                className="cursor-pointer text-[#4328ae] ml-auto"
                size={24}
                onClick={dial}
                fill={'#4328ae'}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 bg-white rounded-t-3xl min-h-[calc(100vh-120px)]">
          {/* Title */}
          <div className="mb-4">
            <span className="text-[#4328ae] font-bold text-lg">
              All Transaction History
            </span>
          </div>

          {/* Program Select and Download */}
          <div className="flex items-center mb-6">
            <div className="w-1/2 text-left">
              <select
                value={applicationSelected?.applicationId || ''}
                onChange={handleApplicationChange}
                className="w-full text-xs bg-[#ede7f6] rounded px-2 py-2 text-[#4328ae] focus:outline-none"
              >
                {applicationList.map((app) => (
                  <option key={app.applicationId} value={app.applicationId}>
                    {app.programDetails.programName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2 text-right">
              <div
                className="inline-flex items-center border border-[#7e67da] rounded px-2 py-1 cursor-pointer ml-auto"
                onClick={downloadTransaction}
              >
                <Download className="text-[#7e67da] mr-1" size={16} />
                <span className="text-[#7e67da] text-xs">Download</span>
              </div>
            </div>
          </div>

          {/* Search Field */}
          <div className="mt-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter Invoice No."
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e67da] focus:border-transparent"
              />
            </div>
          </div>

          {/* Transaction History */}
          <div className="p-3 bg-[#f7f5ff] rounded-xl mt-6">
            {getTransactionList.slice().reverse().map((item, index) => (
              <div key={index}>
                <div className="py-3">
                  <div className="flex justify-between items-start">
                    <div className="w-1/2">
                      <div className="text-[#a1a1a1] text-xs">Invoice No.</div>
                      <div className="text-[#7e67da] text-sm">{item.invoiceNo}</div>
                    </div>
                    <div className="w-1/2 text-right">
                      <div className="text-[#a1a1a1] text-xs">Date</div>
                      <div className="text-[#666666] text-xs">
                        {formatDate(item.transactionDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mt-3">
                    <div className="w-1/2">
                      <div className="text-[#a1a1a1] text-xs">Loan#</div>
                      <div className="text-[#666666] text-xs">{item.loanId}</div>
                    </div>
                    <div className="w-1/2 text-right">
                      <div className="text-[#a1a1a1] text-xs">Amount</div>
                      <div className="text-[#666666] text-xs">
                        ₹ {item.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {index < getTransactionList.length - 1 && (
                  <hr className="border-t-2 border-[#d1c4e9] my-2" />
                )}
              </div>
            ))}

            {getTransactionList.length === 0 && (
              <div className="text-center py-8 text-[#a1a1a1] text-sm">
                {invoiceNumber ? 'No transactions found for this invoice number' : 'No transactions found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};