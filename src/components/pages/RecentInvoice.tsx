import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CircleX, TriangleAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import landingLogoBlue from "../../assets/images/landinglogoblue.png";

interface InvoiceItem {
  purchaseOrderNumber: string;
  status: string;
  createdAt: string;
  approvedInvoiceAmount: number;
  invoiceAmount: number;
}

export const RecentInvoices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);
  
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [invoiceList, setInvoiceList] = useState<InvoiceItem[]>([]);
  const [notificationColor] = useState('#4328AE');

  useEffect(() => {
    dispatch(routeChange('end'));
    dashboardApi();
  }, []);

  const dashboardApi = () => {
    dispatch(routeChange('start'));
    
    const url = '/invoice-finance-services/invoice-services/finance/invoices/get/borrower';
    const data = {
      countFrom: 0,
      countTo: 20,
      companyName: app.companyName,
      // borrowerId: self.$route.query.borrowerId,
      borrowerId: new URLSearchParams(window.location.search).get('borrowerId'),
    };

    const options = {
      successCallBack: (res: any) => {
        
        let listTemp: InvoiceItem[] = [];
        
        // Process different status types
        const REPAID = res.invoiceDetails.REPAID?.map((el: any) => ({
          ...el,
          status: 'REPAID'
        })) || [];
        
        const REJECT = res.invoiceDetails.REJECT?.map((el: any) => ({
          ...el,
          status: 'REJECT'
        })) || [];
        
        const SUBMITTED = res.invoiceDetails.SUBMITTED?.map((el: any) => ({
          ...el,
          status: 'SUBMITTED'
        })) || [];
        
        const APPROVED = res.invoiceDetails.APPROVED?.map((el: any) => ({
          ...el,
          status: 'APPROVED'
        })) || [];
        
        const AWAITING_APPROVAL = res.invoiceDetails.AWAITING_APPROVAL?.map((el: any) => ({
          ...el,
          status: 'AWAITING_APPROVAL'
        })) || [];
        
        const IGNORED = res.invoiceDetails.IGNORED?.map((el: any) => ({
          ...el,
          status: 'IGNORED'
        })) || [];

        // Combine all arrays
        listTemp = [
          ...REPAID,
          ...REJECT,
          ...SUBMITTED,
          ...APPROVED,
          ...AWAITING_APPROVAL,
          ...IGNORED
        ];

        // Sort by date (newest first)
        listTemp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setInvoiceList(listTemp);
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        setAlert(true);
        setAlertMessage("Server Connection Failed");
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest(url, {}, data, options);
  };

  const redirectToAllInvoice = () => {
    // navigate('/AllInvoices', {    //
    //   state: {
    //     borrowerId: new URLSearchParams(window.location.search).get('borrowerId'),
    //     applicationId: new URLSearchParams(window.location.search).get('applicationId'),
    //   }
    // });

    const queryParams = new URLSearchParams({
      borrowerId: new URLSearchParams(window.location.search).get('borrowerId') || '',
      applicationId: app?.applicationId || '',
    });

    navigate(`/AllInvoices?${queryParams}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'AWAITING_APPROVAL':
        return 'bg-[#fb8c00] text-white';
      case 'REPAID':
        return 'bg-[#4328AE] text-white';
      case 'APPROVED':
        return 'bg-[#97C93E] text-white';
      default:
        return 'bg-[#FF5252] text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'AWAITING_APPROVAL':
        return 'In Process';
      case 'REPAID':
        return 'Repaid';
      case 'APPROVED':
        return 'Approved';
      default:
        return 'Rejected';
    }
  };

  return (
    <div 
      className="max-w-[450px] text-left font-montserrat h-full bg-white mx-auto"
      style={{ fontFamily: 'Montserrat' }}
    >
      <div className="pb-[50px]">
        {/* Alert */}
        {alert && (
          <div
            className="bg-[#ff5252] border border-red-400 text-white px-4 py-3 rounded relative mb-4 flex justify-between "
            role="alert"
          >
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
        <div className="m-4">
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
                className="w-[138px] mx-auto"
                alt="logo"
                src={landingLogoBlue}
              />
            </div>
            <div className="w-1/5 text-right">
              {/* Notification bell icon can be added here if needed */}
            </div>
          </div>
        </div>

        {/* Recent Invoices Section */}
        <div className="mt-10">
          <div className="m-4">
            <div className="flex items-center">
              <div className="w-1/2">
                <span className="font-bold text-[20px] text-[#4328ae]">
                  Recent Invoices
                </span>
              </div>
              <div 
                className="w-1/2 text-right h-fit my-auto cursor-pointer"
                onClick={redirectToAllInvoice}
              >
                <div>
                  <div className="text-[12px] w-fit px-[22px] py-[2px] bg-[#f7f5ff] rounded-xl text-[#4328ae] inline-block">
                    VIEW ALL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Cards */}
          <div className="bg-white shadow-lg m-5 rounded-xl">
            {invoiceList.slice(0, 5).map((item, index) => (
              <div key={index}>
                <div className="p-5 pb-4">
                  {/* First Row */}
                  <div className="flex mb-3">
                    <div className="w-[70%]">
                      <span className="text-[12px] text-[#a1a1a1]">
                        Invoice No.
                      </span>
                      <br />
                      <span className="text-[14px]">
                        {item.purchaseOrderNumber}
                      </span>
                    </div>
                    <div className="w-[30%] pl-1 h-fit my-auto text-right">
                      <div className={`text-[12px] w-fit px-[10px] py-[2px] rounded-xl ${getStatusStyles(item.status)}`}>
                        {getStatusText(item.status)}
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="flex">
                    <div className="w-1/2 pl-1">
                      <span className="text-[12px] text-[#a1a1a1]">Date</span>
                      <br />
                      <span className="text-[14px]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <div className="w-1/2 pl-1 h-fit my-auto text-right">
                      <span className="text-[12px] text-[#a1a1a1]">Amount</span>
                      <br />
                      <span className="text-[14px]">
                        {item.approvedInvoiceAmount > 0
                          ? item.approvedInvoiceAmount.toLocaleString()
                          : item.invoiceAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Separator */}
                {index !== invoiceList.slice(0, 5).length - 1 && (
                  <hr className="border-t-2 border-[#d1c4e9]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};