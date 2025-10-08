// TransactionHistory.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Phone, ChevronDown, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest, makeAPIGETRequest } from '../../utils/apiActions';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
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

export const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);
  const [searchParams] = useSearchParams();


  const [transactionList, setTransactionList] = useState<TransactionItem[]>([]);
  const [applicationList, setApplicationList] = useState<ApplicationItem[]>([]);
  const [applicationSelected, setApplicationSelected] = useState<ApplicationItem | null>(null);
  
  const [totalDue, setTotalDue] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  
  const [series, setSeries] = useState([{ data: [5, 10, 4, 1.5, 5, 0] }]);
  const [finalMonths, setFinalMonths] = useState<string[]>([]);

    const chartOptions: ApexOptions = {
        colors: ["#7E67DA", "#D1C4E9"],
        chart: {
            id: "chart",
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350,
                },
            },
        },
        stroke: {
            show: true,
            curve: "straight",
            lineCap: "round",
            width: 2,
            dashArray: 0,
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false,
        },
        xaxis: {
            categories: finalMonths,
            tickPlacement: "between",
            axisTicks: {
                show: true,
                borderType: "solid",
                color: "#78909C",
                height: 0,
            },
            axisBorder: {
                show: true,
                color: "#EDE7F6",
                height: 0,
            },
            labels: {
                show: true,
                rotate: -45,
                hideOverlappingLabels: true,
                style: {
                    colors: "#A1A1A1",
                    fontSize: "12px",
                    fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                },
            },
        },
        grid: {
            show: true,
            borderColor: "#EDE7F6",
        },
        legend: {
            show: false,
        },
        yaxis: {
            tickAmount: 4,
            forceNiceScale: true,
            labels: {
                style: {
                    colors: "#A1A1A1",
                    fontSize: "12px",
                    fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
                },
                formatter: (value: number) => {
                    return value.toFixed(2) + "K";
                },
            },
        },
    };

  useEffect(() => {
    dispatch(routeChange('start'));
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const months: string[] = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = monthNames[d.getMonth()];
      months.push(month);
    }
    setFinalMonths(months);

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

  const openAllTransaction = () => {
    if (applicationSelected) {
    //   navigate('/AllTransactions', {
    //     state: {
    //       applicationId: applicationSelected.applicationId,
    //       customerId: app.customerID,
    //     }
    //   });

        const queryParams = new URLSearchParams({
            applicationId: applicationSelected.applicationId,
            customerId: app.customerID || '',
        }).toString();

        navigate(`/AllTransactions?${queryParams}`);
    }
  };

  const downloadTransaction = () => {
    if (!applicationSelected) return;

    const fileData = XLSX.utils.json_to_sheet(transactionList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, fileData, "File");

    try {
      const b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      // @ts-ignore - Assuming JSBridge exists in global scope
      JSBridge.download(b64, `Transactions_${applicationSelected.applicationId}`, "xlsx");
    } catch (err) {
      XLSX.writeFile(wb, `Transactions_${applicationSelected.applicationId}.xlsx`);
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("DD MMM, YYYY");
  };

  const setData = () => {
    console.log(applicationSelected);

    //   let outstanding = 0;
    //   setloanList.forEach((loans, index2) => {
    //     if (loans.applicationId == this.applicationSelected.applicationId) {
    //       this.totalOutstanDing =
    //         this.totalOutstanDing + loans.totalOutstanding;
    //     }
    //   });
    //   this.fetchTransaction(this.applicationSelected.applicationId);
    //   this.customerProfile(
    //     this.applicationSelected.applicationId,
    //     this.applicationSelected.programDetails.company
    //   );

    if (!applicationSelected) return;
    let outstanding = 0;
    // Calculate outstanding from loanList (you'll need to implement this based on your data structure)
    
    setTotalOutstanding(outstanding);
    fetchTransaction(applicationSelected.applicationId);
    customerProfile(applicationSelected.applicationId, applicationSelected.programDetails.company);
  };

  const customerProfile = (applicationId: string, companyName: string) => {
    dispatch(routeChange('start'));

    const request = {
      loginId: app.loginId,
      applicationId: applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        DashboardApi(applicationId, companyName, res.borrowerId);
      },
      failureCallBack: (error: any) => {
        dispatch(routeChange('end'));
        console.log("display ==" + error);
      }
    };

    makeAPIPOSTRequest('/supermoney-service/customer/profile', {}, request, options);
  };

  const DashboardApi = (applicationId: string, companyName: string, borrowerId: string) => {
    const data = {
      countFrom: 0,
      countTo: 20,
      companyName: companyName,
      borrowerId: borrowerId,
    };

    const options = {
      successCallBack: (res: any) => {
        let due = 0;

        res.invoiceDetails?.REPAID?.forEach((item: any) => {
          due += item.approvedInvoiceAmount || 0;
        });

        res.invoiceDetails?.APPROVED?.forEach((item: any) => {
          due += item.approvedInvoiceAmount || 0;
        });

        res.invoiceDetails?.PRE_DISBURSEMENT_CLOSED?.forEach((item: any) => {
          due += item.approvedInvoiceAmount || 0;
        });

        setTotalDue(due);
      },
      failureCallBack: (error: any) => {
        console.log("Server Connection Failed", error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/invoice-finance-services/invoice-services/finance/invoices/get/borrower', {}, data, options);
  };

  const fetchTransaction = (applicationId: string) => {
    dispatch(routeChange('start'));
    
    const request = {
    //   customerId: app.customerID, //qy
      customerId: searchParams.get('customerId'), 
      applicationId: applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        setTransactionList(res.transactionDetailsResp);
        
        let paid = 0;
        res.transactionDetailsResp?.forEach((item: TransactionItem) => {
          paid += Number(item.amount) || 0;
        });
        setTotalPaid(paid);

        // Update chart data
        const listCredit: number[] = [];
        finalMonths.forEach((month) => {
          const monthNum = getItemPosition(month);
          let amountCredit = 0;

          res.transactionDetailsResp?.forEach((itemObject: TransactionItem) => {
            if (new Date(itemObject.transactionDate).getMonth() + 1 === monthNum) {
              amountCredit += itemObject.amount;
            }
          });
          listCredit.push(amountCredit / 1000);
        });

        setSeries([{ data: listCredit }]);
      },
      failureCallBack: (error: any) => {
        console.log(error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/supermoney-service/payment/transactions/get', {}, request, options);
  };

  const getItemPosition = (month: string): number => {
    const months: { [key: string]: number } = {
      "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
      "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
    };
    return months[month] || 1;
  };

  const fetchApplicationId = () => {
    dispatch(routeChange('start'));

    const request = {
      customerId: searchParams.get('customerId'),  // qy
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        const applications = res.getCustomerApplicationResponseList;
        setApplicationList(applications);

        setApplicationSelected(applicationList[0]);
        setData();
        // if (applications.length > 0) {
        //   setApplicationSelected(applications[0]);
        //   // Set data for the first application
        //   setTimeout(() => {
        //     const firstApp = applications[0];
        //     let outstanding = 0;
        //     // Calculate outstanding (you'll need to implement this based on your data)
        //     setTotalOutstanding(outstanding);
        //     fetchTransaction(firstApp.applicationId);
        //     customerProfile(firstApp.applicationId, firstApp.programDetails.company);
        //   }, 0);
        // }
      },
      failureCallBack: (error: any) => {
        // handle error
          console.log(error);
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

  return (
    <div className="max-w-[450px] mx-auto text-left font-['Montserrat'] min-h-screen bg-[#f3f0fc]">
      <div className="h-auto bg-[#f3f0fc] pb-12">
        {/* Header */}
        <div className="p-4">
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
                className="w-36 mx-auto" 
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
              Repayment Transaction History
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="text-left">
              <div className="text-[#a1a1a1] text-xs">Total Invoice Amount</div>
              <div className="text-[#666666] text-sm font-bold">
                ₹ {totalDue.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#a1a1a1] text-xs">Paid</div>
              <div className="text-[#666666] text-sm font-bold">
                ₹ {totalPaid.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#a1a1a1] text-xs">Outstanding</div>
              <div className="text-[#666666] text-sm font-bold">
                ₹ {totalOutstanding.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full mt-8">
            <Chart
              type="line"
              height={250}
              options={chartOptions}
              series={series}
            />
          </div>

          {/* Program Select and Download */}
          <div className="flex items-center mt-4 mb-6">
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

          {/* Transaction History */}
          <div className="p-3 bg-[#f7f5ff] rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#636266] text-sm font-bold">
                Transaction History
              </span>
              {transactionList.length > 0 && (
                <span 
                  className="text-[#7e67da] text-xs font-bold cursor-pointer"
                  onClick={openAllTransaction}
                >
                  Show All
                </span>
              )}
            </div>

            {transactionList.slice(0, 3).map((item, index) => (
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
                
                {index < Math.min(transactionList.length - 1, 2) && (
                  <hr className="border-t-2 border-[#d1c4e9] my-2 -mx-3" />
                )}
              </div>
            ))}

            {transactionList.length === 0 && (
              <div className="text-center py-4 text-[#a1a1a1] text-sm">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
