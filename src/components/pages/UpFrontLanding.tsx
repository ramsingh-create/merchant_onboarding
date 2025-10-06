import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/router';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, ChevronDown, Download, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setLegalEntityType, setWorkFlowID } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import upFrontBanner from "../../assets/images/upfrontbanner.png";
import documentUpFront from "../../assets/images/documentupfront.png";
import applicationFail from "../../assets/images/applicationfail.png";
import uploadDocumentThankyou from "../../assets/images/uploaddocumentthankyou.png";
import statusIcon from "../../assets/images/statusicon.png";
import {
  setAuthToken,
  setLoginId,
  setCustomerID,
  setApplicationId,
  setCompanyName,
  setOnboardingName
} from '../../store/appSlice';

declare const JSBridge: {
  call: (number: string) => void;
  redirectToBrowser: (url: string) => void;
}

// Types
interface OnboardingStep {
  taskId: string;
  taskName: string;
  type: number; // 0: completed, 1: current, 2: pending
}

interface ApplicationData {
  programName: string;
  invoiceUploadAvailable: boolean;
  workflowID: string;
  mandateType: string;
}

interface CustomerProfile {
  companyType: string;
  name: string;
  panNumber: string;
  borrowerId: "";
}

interface CreditLimit {
  totalCreditLimit: number;
  utilizedCreditLimit: number;
  unutilizedCreditLimit: number;
}

// Main Component
export const UpFrontLanding: React.FC = () => {
  // const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  // State variables
  const [currentStep, setCurrentStep] = useState<string>('');
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [workflowID, setWorkflowID] = useState<string>('');
  const [financePlan, setFinancePlan] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<string>('');
  const [creditStatus, setCreditStatus] = useState<string>('Not Started');
  const [totalLimit, setTotalLimit] = useState<number>(0);
  const [availableLimit, setAvailableLimit] = useState<number>(0);
  const [utilizedLimit, setUtilizedLimit] = useState<number>(0);
  const [availablePercentage, setAvailablePercentage] = useState<number>(0);
  const [activeBankFlag, setActiveBankFlag] = useState<boolean>(false);
  const [activeMandateFlag, setActiveMandateFlag] = useState<boolean>(false);

  // UI state flags
  const [payNowCard, setPayNowCard] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('');
  const [utilizationCardUtilized, setUtilizationCardUtilized] = useState<boolean>(false);
  const [landingCard, setLandingCard] = useState<boolean>(false);
  const [completeKYCCard, setCompleteKYCCard] = useState<boolean>(false);
  const [applicationRejected, setApplicationRejected] = useState<boolean>(false);
  const [onboardingJourneyCompleteCard, setOnboardingJourneyCompleteCard] = useState<boolean>(false);
  const [utilizationCard, setUtilizationCard] = useState<boolean>(false);
  const [invoiceCard, setInvoiceCard] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alert, setAlert] = useState<boolean>(false);
  const [sheet, setSheet] = useState<boolean>(false);
  const [statusSheet, setStatusSheet] = useState<boolean>(false);
  const [programName, setProgramName] = useState<string>('');
  const [invoiceUploadAvailable, setInvoiceUploadAvailable] = useState<boolean>(true);
  const [mandateType, setMandateType] = useState<string>('');
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [onboardingStage, setOnboardingStage] = useState("");
  const [currentApplication, setCurrentApplication] = useState(null);

  // Calculate available percentage
  useEffect(() => {
    if (totalLimit > 0) {
      setAvailablePercentage(parseInt(((availableLimit / totalLimit) * 100).toString()));
    }
  }, [totalLimit, availableLimit]);

  // Initial data fetch
  useEffect(() => {
    stagesFetch();
  }, []);

  useEffect(() => {
    DashboardApi()
  }, [borrowerId])

  // // this useEffect to fetch bank details when component mounts
  // useEffect(() => {
  //   if (app.customerID && app.applicationId) {
  //     getbankDetails();
  //   }
  // }, [app.customerID, app.applicationId]);

  // API Methods
  const stagesFetch = () => {
    dispatch(routeChange('start'));

    let request = {
      customerId: app.customerID,
      profileId: app.profileID,
      applicationId: app.applicationId,
      stageName: "Onboarding",
    };
    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log("Nitin" + JSON.stringify(res));
        if (res.data.length > 0) {
          setLandingCard(false);
          let stage = res.data[0];
          // self.onboardingStage = stage.stageStatus;
          if (
            stage.stageStatus == "CREATED" ||
            stage.stageStatus == "IN_PROGRESS"
          ) {
            dispatch(setWorkFlowID(res.workFlowId))
            setCompleteKYCCard(true);
          } else {
            setCompleteKYCCard(false);
            stagesFetchKYC();
          }
        } else {
          // self.landingCard = true;
          setLandingCard(true);
        }
        fetchApplicationId();
        fetchApplicationFinancePlan();
        customerProfile();
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/supermoney-service/stage/fetch', {}, request, options);
  };

  const stagesFetchKYC = () => {
    dispatch(routeChange('start'));

    let request = {
      customerId: app.customerID,
      profileId: app.profileID,
      stageName: "KYC",
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        if (res.data.length > 0) {
          let stage = res.data[0];
          if (stage.stageStatus == "COMPLETED") setKycStatus("Approved");
          else if (stage.stageStatus == "REJECTED")
            setKycStatus("Rejected");
          else setKycStatus("In Process");
          if (
            stage.stageStatus == "COMPLETED" &&
            !["PALODD", "SMARTDUKAAN", "WABI2B"].includes(app.companyName!)
          ) {
            setOnboardingJourneyCompleteCard(false);
            stagesFetchCredit();
          } else {
            stagesFetchCredit();
            setOnboardingJourneyCompleteCard(true);
          }
        } else {
          setCompleteKYCCard(true);
        }
      },
      failureCallBack: (error: any) => {
        console.log(error);
        dispatch(routeChange('end'));
      }
    }
    makeAPIPOSTRequest('/supermoney-service/stage/fetch', {}, request, options);
  }

  const stagesFetchCredit = () => {
    dispatch(routeChange('start'));
    let request = {
      applicationId: app.applicationId,
      customerId: app.customerID,
      profileId: app.profileID,
      stageName: "CREDIT",
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        if (res.data.length > 0) {
          setLandingCard(false);
          let stage = res.data[0];
          if (stage.stageStatus == "APPROVED_BY_LENDER")
            setCreditStatus("Approved");
          else if (stage.stageStatus == "REJECTED_BY_LENDER")
            setCreditStatus("Rejected");
          else setCreditStatus("In Process");
          if (stage.stageStatus == "APPROVED_BY_LENDER") {
            setOnboardingJourneyCompleteCard(false);
            setUtilizationCard(true);
            creditLimit();
          } else {
            setOnboardingJourneyCompleteCard(true);
          }
        } else {
          setOnboardingJourneyCompleteCard(true);
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/supermoney-service/stage/fetch', {}, request, options);
  }

  const creditLimit = () => {
    dispatch(routeChange('start'));
    let custId = Number(app.customerID);

    let data = {
      applicationId: Number(app.applicationId),
      customerId: custId,
    };

    const options = {
      successCallBack: (res: any) => {
        setTotalLimit(res.totalCreditLimit);
        setUtilizedLimit(res.utilizedCreditLimit);
        setAvailableLimit(res.unutilizedCreditLimit);
        // setAvailablePercentage(parseInt(
        //   (self.availableLimit / self.totalLimit) * 100
        // ));
        DashboardApi();

        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
        DashboardApi();
        dispatch(routeChange('end'));
      }
    }
    makeAPIPOSTRequest('credit-analytics-service/application/creditlimit/get', {}, data, options);
    // API implementation
  };

  const fetchApplicationId = () => {
    dispatch(routeChange('start'));

    let request = {
      customerId: app.customerID,
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        setProgramName(res.getCustomerApplicationResponseList[0].programDetails.programName);
        setInvoiceUploadAvailable(res.getCustomerApplicationResponseList[0].programDetails.invoiceUploadAvailable);
        setWorkflowID(res.getCustomerApplicationResponseList[0].programDetails.workflowId);
        setMandateType(res.getCustomerApplicationResponseList[0].programDetails.mandateTypeAllowed);
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, request, options);
  };

  const fetchApplicationFinancePlan = () => {
    // API implementation
    dispatch(routeChange('start'));

    let request = {
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        setFinancePlan(res.getApplicationFinancePlanMappingResp[0])

      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/supermoney-service/application/finance/get', {}, request, options);
  };

  const customerProfile = () => {
    // API implementation
    dispatch(routeChange('start'));

    let request = {
      loginId: app.loginId,
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        if (res.errorMessage === "" || res.errorMessage === null) {
          setCustomerType(res.companyType);
          let name = res.name;

          if (name.length > 0) {
            setName(name.split(" ")[0]);
          }

          setBorrowerId(res.borrowerId)
          setBorrowerName(res.name);
          if (
            res.borrowerId === "" && (onboardingStage == "INFORMATION_PROVIDED" || onboardingStage == "BE_MANUALSTEP")
          ) {
            createBorrower(res.panNumber);
          }
        } else {
          setAlert(true);
          setAlertMessage(res.errorMessage);
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/supermoney-service/customer/profile', {}, request, options);
    // setName('John Doe');
  };

  const createBorrower = (panNumber: string) => {
    dispatch(routeChange('start'));

    let data = {
      invoiceType: "createBorrower",
      request: {
        companyName: app.companyName,
        supplierId:
          app.companyName == "YARAELECTRONICS"
            ? "200076"
            : "",
        planCode: "0@JIO_INAUGRAL",
        supplierBankDetailId:
          app.companyName == "YARAELECTRONICS" ? "1" : "",
        name: borrowerName,
        phoneNumber: app.loginId,
        email: "",
        pan: panNumber,
        gstinNumber: "",
        company: app.companyName,
        onboardingPartner: app.onboardingName,
        ifsc: "",
        bankAccountNo: "",
        applicationId: app.applicationId,
        externalId: JSON.stringify(parseInt(app.customerID as string)),
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
      successCallBack: (res: any) => {
        let hostStatus = res.data.successFlag;

        if (hostStatus === true) {
          dispatch(routeChange('end'));
          dispatch(setAuthToken(res.token));
          setBorrowerId(res.data.details.borrowerId);
        } else {
          if (res.header.hostStatus === "E") {
            setAlertMessage(res.header.error.errorDesc);
            setAlert(true);
          } else {
            setAlertMessage(res.data.details.errors[0]);
            setAlert(true);
          }
          dispatch(routeChange('end'));
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    }
    makeAPIPOSTRequest('/mintLoan/mintloan/invoiceFinancing', {}, employeeDetails, options);
  }

  const DashboardApi = () => {
    let data = {
      countFrom: 0,
      countTo: 20,
      companyName: app.companyName,
      borrowerId: borrowerId
    };

    const options = {
      successCallBack: (res: any) => {
        if (res.invoiceDetails != undefined) {
          setUtilizationCard(false);
          setUtilizationCardUtilized(true);
          setInvoiceCard(true);

          if (res.invoiceDetails.APPROVED.length > 0) {
            setPayNowCard(true);
          } else {
            setPayNowCard(false);
          }
        } else {
          setUtilizationCardUtilized(false);
          setUtilizationCard(true);
          if (invoiceUploadAvailable) {
            setSheet(true);
          }
          setInvoiceCard(false);
          setPayNowCard(false);
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        setAlert(true);
        setAlertMessage(error.message)
        setLegalEntityType("Server Connection Failed");
        dispatch(routeChange('end'));
      }
    }
    makeAPIPOSTRequest('/invoice-finance-services/invoice-services/finance/invoices/get/borrower', {}, data, options);
  }

  // Navigation methods
  const redirectToBusinessDetails = () => {
    if (financePlan != null) {
      navigate("/BusinessDetails");
    } else {
      navigate("/ChooseFinancePlan");
    }
  };

  const redirectToDashBoard = () => {
    setSheet(false);
    if (availableLimit === 0) {
      setAlert(true);
      setAlertMessage("Credit Limit Is currently Not Available For This Account. Please Try After Sometime");
    } else {
      if (activeBankFlag === true && activeMandateFlag === true) {
        const queryParams = new URLSearchParams({
          borrowerId: borrowerId,
          borrowerName: borrowerName,
          availableLimit: availableLimit.toString(),
          applicationId: app?.applicationId || '',
          companyName: app.companyName as string
        }).toString();

        navigate(`/SelectSupplier?${queryParams}`);

      } else {
        if (
          activeMandateFlag === false &&
          activeBankFlag === true
        ) {
          if (mandateType == "others") {
            const queryParams = new URLSearchParams({
              borrowerId: borrowerId,
              borrowerName: borrowerName,
              availableLimit: availableLimit.toString(),
              applicationId: app?.applicationId || '',
              companyName: app.companyName as string
            }).toString();

            navigate(`/BankMandateInfoInvoice?${queryParams}`);

          } else {
            const queryParams = new URLSearchParams({
              borrowerId: borrowerId,
              borrowerName: borrowerName,
              availableLimit: availableLimit.toString(),
              applicationId: app?.applicationId || '',
              companyName: app.companyName as string
            }).toString();

            navigate(`/UPIMandateInfoInvoice?${queryParams}`);
          }
        } else {
          const queryParams = new URLSearchParams({
            borrowerId: borrowerId,
            borrowerName: borrowerName,
            availableLimit: availableLimit.toString(),
            applicationId: app?.applicationId || '',
          companyName: app.companyName as string
          }).toString();

          navigate(`/BorrowerBankDetails?${queryParams}`);
        }
      }
    }
  };

  const redirectToRecentInvoices = () => {
     const queryParams = new URLSearchParams({
            borrowerId: borrowerId,
            applicationId: app?.applicationId || '',
          }).toString();
    navigate(`/RecentInvoice?${queryParams}`);
  };

  const redirectToPayment = () => {
    dispatch(routeChange('start'));

    let data = {
      customerId: app.customerID,
    };

    const options = {
      successCallBack: (res: any) => {
        try {
          // @ts-ignore
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
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
        dispatch(routeChange('end'));
      }
    }
    makeAPIPOSTRequest('supermoney-service/generatePaymentIdV2', {}, data, options);
  };

  const openStatusSheet = () => setStatusSheet(true);
  const closeStatusSheet = () => setStatusSheet(false);
  const closeBottomSheet = () => setSheet(false);

  const dial = () => {
    const number = app.companyName === "NETMEDS" || app.companyName === "JIOMART"
      ? "02269516677"
      : "9920111300";
    window.open(`tel:${number}`, '_self');
  };

  const workFlowStatus = () => {
    console.log("This function is not call")
    dispatch(routeChange('start'));

    let data = {
      workflowApiType: "status",
      request: {
        customerId: app.customerID,
        profileId: app.profileID,
        company: app.companyName,
        workFlowType: "Onboarding",
      },
    };

    let msgHeader = {
      authToken: localStorage.getItem("authtoken"),
      loginId: app.loginId,
      channelType: "M",
      consumerId: "414",
      deviceId: "MerchantWebApp",
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

    let createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        dispatch(setAuthToken(res.header.authToken));
        if (res.data.successFlag) {
          dispatch(setWorkFlowID(res.data.details.businessKey));
          if (res.data.details.tasks.length > 0) {
            const taskKey = res.data.details.tasks[0].taskDefinitionKey;
            setCurrentStep(taskKey);
            setWorkflowID(res.data.details.workflowName);

            // Route based on task definition key
            const routeMap: { [key: string]: string } = {
              'INPANDOB': '/BusinessDetails',
              'INPANDOBPARTNER': '/BusinessDetails',
              'DOB': '/DOBDetails',
              'DIGILOCKER': '/EKyc',
              'GETPHYSICALAADHAAR': '/AadhaarSign',
              'UDYOGAADHAAR': '/UdyoogAadhaar',
              'ADDRESS_DETAILS': '/AddressDetails',
              'SUPPLIER_DETAILS': '/OnboardingSupplierList',
              'BUSINESSPROOFS': '/ProofOfBusinessSelector',
              'BUSINESSPROOFS_OPTIONAL': '/ProofOfBusinessSelector',
              'SELFIEPHOTOGRAPH': '/Selfie',
              'REFERENCE_DETAILS': '/ReferenceDetails',
              'APPLICATION_APPROVAL': '/BreWaitingScreen',
              'LOANAGREEMENT': '/LoanAgreement',
              'BANKDETAILS': '/BankDetailsOnboarding',
              'MANDATE': '/BankMandateInfo',
              'MANDATE_OPTIONAL': '/BankMandateInfo',
              'UPIMANDATE': '/UPIMandateInfoOnboarding',
              'UPIMANDATE_OPTIONAL': '/UPIMandateInfoOnboarding',
              'GST_RETURN': '/GSTDetails',
              'BANK_STATEMENT_ONBOARDING': '/BankStatementPage',
              'BUSINESS_BASIC_DETAILS': '/BusinessDetails',
              'BUSINESS_ADDITIONAL_DETAILS': '/CompanyBusinessDetails',
              'OWNERSHIP_PARTNER_BASIC_DETAILS': '/CompanyPartnerShipDetails',
              'OWNERSHIP_COMPANY_BASIC_DETAILS': '/CompanyShareHoldingDetails',
              'OWNERSHIP_ADDITIONAL_DETAILS': '/BusinessOfficeDetails',
              'PARTNER_BUSINESS_BANK_DETAILS': '/PartnerPreThankYou',
              'COMPANY_BUSINESS_BANK_DETAILS': '/CompanyPreThankYou',
              'PARTNERSHIP_DEED': '/UploadPartnershipDeed',
              'CERTIFICATE_OF_INCORPORATION': '/UploadCertificateOfCorporation',
              'ITR': '/UploadITR',
              'GST_DETAILS': '/UploadGSTDetails',
              'AUDITED_FINANCIAL_STATEMENT': '/UploadAuditedFinancialStatement',
              'BUSINESS_KYC': '/UploadBusinessKYC',
              'DIRECTOR_KYC': '/UploadDirectorKYC',
            };

            const route = routeMap[taskKey];
            if (route) {
              navigate(route);
            }
          }
        }
      },
      failureCallBack: (error: any) => {
        console.log("display  ==" + error);
        dispatch(routeChange('end'));
      }
    }
    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
  };

  // const getbankDetails = () => {
  //   dispatch(routeChange('start'));

  //   let data = {
  //     applicationId: app.applicationId,
  //   };

  //   let msgHeader = {
  //     authToken: localStorage.getItem("authtoken"),
  //     loginId: app.loginId,
  //     channelType: "M",
  //     consumerId: "414",
  //     deviceId: "BankMandate",
  //     source: "WEB",
  //   };

  //   let deviceFPmsgHeader = {
  //     clientIPAddress: "192.168.0.122",
  //     connectionMode: "WIFI",
  //     country: "United States",
  //     deviceManufacturer: "Xiaomi",
  //     deviceModelNo: "Mi A2",
  //     dualSim: false,
  //     imeiNo: "09d9212a07553637",
  //     latitude: "",
  //     longitude: "",
  //     nwProvider: "xxxxxxxx",
  //     osName: "Android",
  //     osVersion: 28,
  //     timezone: "Asia/Kolkata",
  //     versionCode: "58",
  //     versionName: "5.5.1",
  //   };

  //   let employeeDetails = { data, deviceFPmsgHeader, msgHeader };

  //   const options = {
  //     successCallBack: (res: any) => {
  //       let hostStatus = res.header.hostStatus;
  //       if (hostStatus === "S" || hostStatus === "s") {
  //         dispatch(setAuthToken(res.header.authToken));
  //         const userBankList = res.data.userBankList;
  //         if (userBankList.length != 0) {
  //           let activeBank = false;
  //           userBankList.forEach((item: any) => {
  //             if (item.defaultFlag === true) {
  //               activeBank = true;
  //             }
  //           });
  //           setActiveBankFlag(activeBank);
  //           getMandateDetails();
  //         } else {
  //           setActiveBankFlag(false);
  //           setActiveMandateFlag(false);
  //         }
  //         dispatch(routeChange('end'));
  //       } else {
  //         if (res.header.hostStatus === "E") {
  //           setAlertMessage(res.header.error.errorDesc);
  //           setAlert(true);
  //         } else {
  //           setAlertMessage(res.data.errorDetails[0].errorDesc);
  //           setAlert(true);
  //         }
  //         dispatch(routeChange('end'));
  //       }
  //     },
  //     failureCallBack: (error: any) => {
  //       console.log("display  ==" + error);
  //       dispatch(routeChange('end'));
  //     }
  //   }
  //   makeAPIPOSTRequest('/mintLoan/mintloan/getActiveBankAccountDetailsV2', {}, employeeDetails, options);
  // };

  // const getMandateDetails = () => {
  //   dispatch(routeChange('start'));

  //   let data = {
  //     customerId: app.customerID,
  //     applicationId: app.applicationId,
  //   };

  //   const options = {
  //     successCallBack: (res: any) => {
  //       if (res.getMandateDetailsRespList.length > 0) {
  //         let activeMandate = false;
  //         res.getMandateDetailsRespList.forEach((item: any) => {
  //           if (item.supermoneyStatus == "ACTIVE" || item.supermoneyStatus == "IN PROCESS") {
  //             activeMandate = true;
  //           }
  //         });
  //         setActiveMandateFlag(activeMandate);
  //       } else {
  //         setActiveMandateFlag(false);
  //       }
  //       dispatch(routeChange('end'));
  //     },
  //     failureCallBack: (error: any) => {
  //       console.log("display  ==" + error);
  //       dispatch(routeChange('end'));
  //     }
  //   }
  //   makeAPIPOSTRequest('/mandate-services/mandate/digio/details/get', {}, data, options);
  // };

  // Progress circle component
  const ProgressCircle: React.FC<{ percentage: number; available: number; total: number }> = ({
    percentage,
    available,
    total
  }) => (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#BAADEC"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#97C93E"
          strokeWidth="10"
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset="25"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-lg text-green-600">
          {parseInt((available / 1000).toString())}K
        </span>
        <span className="text-xs text-purple-600">Available Limit</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-[450px] mx-auto min-h-screen bg-[#311b92] text-left font-montserrat">
      <div className="h-auto pb-12">
        {/* Alert */}
        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{alertMessage}</span>
            <button onClick={() => setAlert(false)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              ×
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mx-4 my-5">
          <span className="text-lg text-white">
            Welcome! <b>{name}</b>
          </span>
          <br />
          <span className="text-xs text-[#d1c4e9]">
            Program : <b>{programName}</b>
          </span>
        </div>

        {/* Landing Card */}
        {landingCard && (
          <div className="bg-[#f7f5ff] rounded-2xl mx-4 mt-6 mb-5 shadow-lg">
            <img
              src={upFrontBanner}
              alt="banner"
              className="w-full -mt-7"
            />
            <div className="p-4">
              <span className="font-bold">
                Worried about stock shortage <br />due to low cash?
              </span>
              <div className="text-[#666666] text-xs font-bold mt-2">
                Get instant <span className="text-green-500">pre-approved </span>
                credit at competitive <br />interest rate for all your invoices.
              </div>
              <button
                onClick={redirectToBusinessDetails}
                className="bg-[#7E67DA] mt-5 mb-4 font-bold text-white w-40 py-2 rounded-lg"
              >
                Apply Now
              </button>
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">No Processing Fee</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">Paperless Journey</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-xs">Quick Disbursal</span>
              </div>
            </div>
          </div>
        )}

        {/* Complete KYC Card */}
        {completeKYCCard && (
          <div className="bg-white rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-3/4">
                  <span className="text-black font-bold">Complete your KYC</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Few steps away from getting pre-approved credit
                  </div>
                </div>
                <div className="w-1/4 text-right">
                  <img src={documentUpFront} alt="Document" className="ml-auto" />
                </div>
              </div>

              <div className="mt-3">
                {onboardingSteps.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-2 h-fit flex items-center my-2 ${item.type === 0
                        ? 'border border-[#d1c4e9]'
                        : item.type === 1
                          ? 'border border-[#7e67da] cursor-pointer'
                          : 'border border-[#d1c4e9]'
                      }`}
                    onClick={item.type === 1 ? () => workFlowStatus() : undefined}
                  >
                    <span className={`mr-2 ${item.type === 0 ? 'text-green-500' :
                        item.type === 1 ? 'text-[#7E67DA]' : 'text-[#BDBDBD]'
                      }`}>
                      ●
                    </span>
                    <div className="w-3/4 text-left text-xs text-gray-600">
                      {item.taskName}
                    </div>
                    {item.type === 0 && (
                      <div className="text-green-500 mx-auto text-xs font-bold">
                        Completed
                      </div>
                    )}
                    {item.type === 1 && (
                      <div className="text-[#7e67da] ml-auto text-xs font-bold flex items-center">
                        Start <span className="ml-1">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Application Rejected Card */}
        {applicationRejected && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Application Rejected Due to low credit score</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Your application does not satisfy our acceptance criteria
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={applicationFail} alt="Document" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Journey Complete Card */}
        {onboardingJourneyCompleteCard && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Onboarding Journey Completed</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Check your verification and credit approval status
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={documentUpFront} alt="Document" />
                </div>
              </div>
              <button
                onClick={openStatusSheet}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Check Status
              </button>
            </div>
          </div>
        )}

        {/* Credit Approved Card (Non-invoice upload available) */}
        {!invoiceUploadAvailable && !onboardingJourneyCompleteCard && creditStatus === 'Approved' && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">धंधा बढ़ायें ज़्यादा कमायें</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    You have been pre-approved a limit of <b>₹{totalLimit.toLocaleString()}</b>
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle
                    percentage={availablePercentage}
                    available={availableLimit}
                    total={totalLimit}
                  />
                </div>
              </div>
              <hr className="border-t border-[#d1c4e9] my-3" />
              <div className="flex items-start mt-2">
                <span className="text-[#7E67DA] mr-2 mt-1">ℹ</span>
                <span className="text-xs leading-relaxed">
                  Please provide invoices to <b>{app.onboardingName}</b> to utilize this limit.
                </span>
              </div>
              <button
                onClick={() => navigate("/AddInvoice")}
                className="bg-[#7E67DA] mt-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Add Invoice
              </button>
            </div>
          </div>
        )}

        {/* Invoice Card */}
        {invoiceCard && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">View Recent Invoices</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Check status of recently submitted invoices
                  </div>
                </div>
                <div className="w-1/3">
                  <img src={documentUpFront} alt="Document" />
                </div>
              </div>
              <button
                onClick={redirectToRecentInvoices}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                View Status
              </button>
            </div>
          </div>
        )}

        {/* Utilization Card */}
        {utilizationCard && invoiceUploadAvailable && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">धंधा बढ़ायें ज़्यादा कमायें</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Upload invoices and set-up autopay to avail benefits.
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle percentage={100} available={totalLimit} total={totalLimit} />
                </div>
              </div>
              <button
                onClick={redirectToDashBoard}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Utilization Card Utilized */}
        {utilizationCardUtilized && invoiceUploadAvailable && (
          <div className="bg-[#f7f5ff] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-black font-bold">Upload Invoice</span>
                  <br />
                  <div className="text-xs leading-relaxed">
                    Upload invoices and set-up autopay to avail benefits.
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle
                    percentage={availablePercentage}
                    available={availableLimit}
                    total={totalLimit}
                  />
                </div>
              </div>
              <button
                onClick={redirectToDashBoard}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Upload Invoice
              </button>
            </div>
          </div>
        )}

        {/* Pay Now Card */}
        {payNowCard && (
          <div className="bg-[#5e49b6] rounded-xl mx-4 my-5 shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="w-2/3">
                  <span className="text-white font-bold">Free Up Limit</span>
                  <br />
                  <div className="text-[#f7f5ff] text-xs leading-relaxed">
                    Pay your approved invoices now and free up your credit limit
                  </div>
                </div>
                <div className="w-1/3">
                  <ProgressCircle
                    percentage={availablePercentage}
                    available={availableLimit}
                    total={totalLimit}
                  />
                </div>
              </div>
              <button
                onClick={redirectToPayment}
                className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-40 py-2 rounded-lg"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Bottom Sheets */}
        {/* Congratulations Sheet */}
        {sheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-[#f7f5ff] w-full max-w-[450px] mx-auto rounded-t-2xl h-90">
              <div className="text-right p-3">
                <button onClick={closeBottomSheet} className="text-[#7E67DA] text-xl">
                  ×
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="w-3/5">
                    <span className="text-2xl text-[#4328ae] font-bold">Congratulations!</span>
                    <br />
                    <div className="text-xs leading-relaxed">Your pre approved limit is</div>
                    <div className="text-green-500 font-bold text-2xl leading-relaxed">
                      ₹{totalLimit.toLocaleString('en-US')}
                    </div>
                  </div>
                  <div className="w-2/5">
                    <img src={uploadDocumentThankyou} alt="Document" className="w-32" />
                  </div>
                </div>
                <div className="font-bold text-xs leading-relaxed mt-2">
                  Upload invoices and setup autopay to avail your limit and also earn rewards!
                </div>
                <button
                  onClick={redirectToDashBoard}
                  className="bg-[#7E67DA] mt-4 mb-2 font-bold text-white w-full py-2 rounded-lg"
                >
                  Upload Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Sheet */}
        {statusSheet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-[#f7f5ff] w-full max-w-[450px] mx-auto rounded-t-2xl h-90">
              <div className="text-right p-3">
                <button onClick={closeStatusSheet} className="text-[#7E67DA] text-xl">
                  ×
                </button>
              </div>
              <span className="text-[#4328ae] px-4 text-xl font-bold">Your Current status</span>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="w-3/5">
                    <div>
                      <span className="text-sm font-bold">KYC Verification</span>
                      <br />
                      <span className={`inline-block px-2 py-1 rounded text-xs ${kycStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          kycStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                        }`}>
                        {kycStatus}
                      </span>
                    </div>
                    <div className="mt-6">
                      <span className="text-sm font-bold">Credit Approval</span>
                      <br />
                      <span className={`inline-block px-2 py-1 rounded text-xs ${creditStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          creditStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                        }`}>
                        {creditStatus}
                      </span>
                    </div>
                  </div>
                  <div className="w-2/5">
                    <img src={statusIcon} alt="Document" className="w-32" />
                  </div>
                </div>
                <div className="mt-12 text-xs">
                  Want more details about your current Status ?
                </div>
                <button
                  onClick={dial}
                  className="border border-[#7E67DA] mt-4 mb-2 font-bold text-[#7E67DA] w-full py-2 rounded-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tailwind CSS for custom font */}
      {/* <style jsx>{`
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style> */}
    </div>
  );
};