// PanDetails.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, Phone, MessageCircle, Mail } from 'lucide-react';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import panDetailsNew from "../../assets/images/pandetailsnew.png";
import axios from 'axios';

interface PanDetailsState {
  panNumber: string;
  panNumberDisabled: boolean;
  consent: boolean;
  mobno: string;
  whatsappMobno: string;
  sameAsContact: boolean;
  emailAddress: string;
  date: string | null;
  menu1: boolean;
  alert: boolean;
  alertMessage: string;
  taskDefinationKey: string;
  companyName: string;
  borrowerDetailsUpFrontRequired: boolean;
  storeID: string;
  customerId: string;
  profileId: string;
  workFlowId: string;
  legalEntityType: string;
  taskId: string;
  taskName: string;
  supplierId: string;
  applicationId: string;
  leadID: string;
}

export const PanDetails: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const app = useSelector((state: RootState) => state.app);

  const [state, setState] = useState<PanDetailsState>({
    panNumber: '',
    panNumberDisabled: false,
    consent: true,
    mobno: app.loginId?.replace('+91', '') || '',
    whatsappMobno: app.loginId?.replace('+91', '') || '',
    sameAsContact: true,
    emailAddress: '',
    date: new Date(Date.now() - 568024668000).toISOString().substr(0, 10),
    menu1: false,
    alert: false,
    alertMessage: '',
    taskDefinationKey: '',
    companyName: '',
    borrowerDetailsUpFrontRequired: false,
    storeID: '',
    customerId: app.customerID || '',
    profileId: app.profileID || '',
    workFlowId: app.workFlowID || '',
    legalEntityType: app.legalEntityType || '',
    taskId: '',
    taskName: '',
    supplierId: '',
    applicationId: app.applicationId || '',
    leadID: app.leadID || '',
  });
    const [isPanFocused, setIsPanFocused] = useState(false);
    const [isPanTouched, setIsPanTouched] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isEmailTouched, setIsEmailTouched] = useState(false);



  const rules = {
    required: (value: string) => !!value || 'Required',
    mobile: (value: string) => {
      const pattern = /^\(?([5-9]{1})\)?([0-9]{9})$/;
      return pattern.test(value) || 'Invalid Mobile number.';
    },
    repeatedNumbers: (value: string) => {
      const temp = value
        .split('')
        .filter((item, pos, self) => self.indexOf(item) === pos)
        .join('');
      return temp.length > 1 || 'Invalid Mobile number.';
    },
    pan: (value: string) => {
      const pattern = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
      return pattern.test(value) || 'Invalid PAN number.';
    },
    email: (value: string) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || 'Kindly enter correct Email address.';
    },
  };

  // Computed property equivalent
  const computedDateFormatted = state.date 
    ? new Date(state.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  const maxDate = new Date(Date.now() - 568024668000).toISOString().substr(0, 10);

  useEffect(() => {
    dispatch(routeChange('end'));
    workFlowStatus();
    createInactiveTimeEntry();
    fetchApplicationIdNew();
  }, []);

  const switchChanged = () => {
    if (state.sameAsContact) {
      setState(prev => ({ ...prev, whatsappMobno: state.mobno }));
    } else {
      setState(prev => ({ ...prev, whatsappMobno: '' }));
    }
  };

  const workFlowStatus = () => {
    dispatch(routeChange('start'));
    
    const data = {
      workflowApiType: 'status',
      request: {
        customerId: state.customerId,
        profileId: state.profileId,
        workFlowId: state.workFlowId,
        company: app.companyName,
        workFlowType: 'Onboarding',
      },
    };

    const msgHeader = {
      authToken: localStorage.getItem('authtoken') || '',
      loginId: app.loginId,
      channelType: 'M',
      consumerId: '414',
      deviceId: 'MerchantWebApp',
      source: 'WEB',
    };

    const deviceFPmsgHeader = {
      clientIPAddress: '192.168.0.122',
      connectionMode: 'WIFI',
      country: 'United States',
      deviceManufacturer: 'Xiaomi',
      deviceModelNo: 'Mi A2',
      dualSim: false,
      imeiNo: '09d9212a07553637',
      latitude: '',
      longitude: '',
      nwProvider: 'xxxxxxxx',
      osName: 'Android',
      osVersion: 28,
      timezone: 'Asia/Kolkata',
      versionCode: '58',
      versionName: '5.5.1',
    };

    const createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        console.log(res);
        dispatch(setAuthToken(res.header.authToken));
        
        if (res.data.successFlag) {
          const taskId = res.data.details.tasks[0].taskId;
          const taskName = res.data.details.tasks[0].taskName;
          const taskDefinationKey = res.data.details.tasks[0].taskDefinitionKey;
          
          setState(prev => ({
            ...prev,
            taskId,
            taskName,
            taskDefinationKey
          }));

          // Handle routing based on task definition key
          switch (taskDefinationKey) {
            case 'DIGILOCKER':
              navigate('/EKyc');
              break;
            case 'DOB':
              navigate('/DOBDetails');
              break;
            case 'GETPHYSICALAADHAAR':
              navigate('/AadhaarSign');
              break;
            case 'UDYOGAADHAAR':
              navigate('/UdyoogAadhaar');
              break;
            case 'ADDRESS_DETAILS':
              navigate('/AddressDetails');
              break;
            case 'SUPPLIER_DETAILS':
              navigate('/OnboardingSupplierList');
              break;
            case 'BUSINESSPROOFS':
            case 'BUSINESSPROOFS_OPTIONAL':
              navigate('/ProofOfBusinessSelector');
              break;
            case 'SELFIEPHOTOGRAPH':
              navigate('/Selfie');
              break;
            case 'REFERENCE_DETAILS':
              navigate('/ReferenceDetails');
              break;
            case 'APPLICATION_APPROVAL':
              navigate('/BreWaitingScreen');
              break;
            case 'LOANAGREEMENT':
              navigate('/LoanAgreement');
              break;
            case 'BANKDETAILS':
              navigate('/BankDetailsOnboarding');
              break;
            default:
              break;
          }
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==", error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
  };

  const createInactiveTimeEntry = () => {
    const currentTime = new Date().getTime();
    const storedMillis = parseInt(app.currentMillis || '0');
    let url = "https://.mintwalk.com/kycServices/CustomerOnboardInsertUpdate/";
    
    const data = {
      login_id: app.loginId,
      customer_id: parseInt(state.customerId),
      profile_id: parseInt(state.profileId),
      current_page_id: 2,
      anchor_company: app.companyName,
      created_by: 'Merchant Onboarding',
      ...(currentTime - storedMillis < 21600000 ? {
        start_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      } : {
        inactive_page_id: 2,
        page_stay_time: currentTime - storedMillis,
        start_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      })
    };
    axios
        .post(url, data)
        .then(function (res: any) {
        //   self.$store.commit("setCurrentMillis", {
        //     currentMillis: new Date().getTime(),
        //   });
        dispatch(setCurrentMillis(String(new Date().getTime())));
        })
        .catch(function (error) {
          // handle error
          console.log("display  ==", error);
        })
        .finally(function () {});
  };

  const fetchApplicationIdNew = () => {
    dispatch(routeChange('start'));
    
    const request = {
      customerId: app.customerID,
      applicationId: app.applicationId,
    };

    const options = {
      successCallBack: (res: any) => {
        dispatch(routeChange('end'));
        const companyName = res.getCustomerApplicationResponseList[0].programDetails.programName;
        const borrowerDetailsUpFrontRequired = 
          res.getCustomerApplicationResponseList[0].programDetails.upfrontBorrowerRequired;
        
        setState(prev => ({
          ...prev,
          companyName,
          borrowerDetailsUpFrontRequired
        }));

        if (app.leadID != null &&
            app.leadID.length > 0) {
          getLeadDetails();
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
      }
    };

    makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, request, options);
  };

    const getLeadDetails = () => {
        let url = "https://.mintwalk.com/crmbackend/GetBorrowerLead/?lead_id=" + app.leadID;

        axios
            .get(url)
            .then(function (res: any) {

                if (res.successFlag) {
                    const panNumber = res.data[0].pan_number;
                    const storeID = res.data[0].retailer_code;

                    setState(prev => ({
                        ...prev,
                        panNumber,
                        storeID
                    }));

                    if (state.companyName === 'JMD' || state.companyName === 'Netmeds') {
                        if (panNumber.length > 0) {
                            setState(prev => ({ ...prev, panNumberDisabled: true }));
                        }
                    }
                } else {
                    setState(prev => ({
                        ...prev,
                        alert: true,
                        alertMessage: 'Please check eligibility before proceeding with onboarding'
                    }));
                    dispatch(routeChange('end'));
                }
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==" + error);
            })
            .finally(function () {
                // always executed
            });
    };

  const panFormatValidation = () => {
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    return regpan.test(state.panNumber);
  };

  const emailValidation = () => {
    if (state.emailAddress.length === 0) return true;
    const regpan = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regpan.test(state.emailAddress);
  };

  const removeDuplicateCharacters = (string: string) => {
    const temp = string
      .split('')
      .filter((item, pos, self) => self.indexOf(item) === pos)
      .join('');
    return temp.length;
  };

  const checkInitialLetter = (string: string) => {
    return parseInt(string.split('')[0]) > 4;
  };

  const profileupdate = () => {
    if (
      panFormatValidation() &&
      emailValidation() &&
      state.date != null &&
      state.whatsappMobno.length === 10 &&
      removeDuplicateCharacters(state.whatsappMobno) > 1 &&
      checkInitialLetter(state.whatsappMobno)
    ) {
      fetchPanDetails();
    } else {
      let alertMessage = '';
      if (!panFormatValidation()) {
        alertMessage = 'Enter Correct PAN Number';
      } else if (
        state.whatsappMobno.length !== 10 ||
        removeDuplicateCharacters(state.whatsappMobno) === 1 ||
        !checkInitialLetter(state.whatsappMobno)
      ) {
        alertMessage = 'Kindly Enter Correct Whatsapp Mobile Number';
      } else if (state.emailAddress.length === 0) {
        alertMessage = 'Kindly Enter Email Address';
      } else if (!emailValidation()) {
        alertMessage = 'Kindly Enter Correct Email Address';
      } else {
        alertMessage = 'Select Date Of Birth';
      }
      
      setState(prev => ({
        ...prev,
        alert: true,
        alertMessage
      }));
    }
  };

  const fetchPanDetails = () => {
    dispatch(routeChange('start'));
    
    const formattedDate = state.date 
      ? new Date(state.date).toISOString().slice(0, 10)
      : '';

    const data = {
      workflowApiType: "trigger",
      request: {
        customerId: state.customerId,
        profileId: state.profileId,
        workFlowId: state.workFlowId,
        customerType: state.legalEntityType,
        legalEntityType: state.legalEntityType,
        workFlowType: "Onboarding",
        taskId: state.taskId,
        skipWorkFlow: false,
        isWorkFlowCompleted: false,
        taskDefinationKey: state.taskDefinationKey,
        taskName: state.taskName,
        payload: {
          soeImageProvided: false,
          whatsappNumber: state.whatsappMobno,
          panNo: state.panNumber.toUpperCase(),
          legalEntity: state.legalEntityType,
          dob: formattedDate,
          loginID: app.loginId,
          onboardingPartner: app.onboardingName,
          companyName: app.companyName,
          email: state.emailAddress,
          businessType: new URLSearchParams(window.location.search).get('businessType'),
          applicationId: app.applicationId,
          referenceId: state.storeID === '0' || !state.storeID ? '' : new URLSearchParams(window.location.search).get('storeID'),
          upFrontBorrowerRequired: state.borrowerDetailsUpFrontRequired,
          updateProfile: true,
        },
      },
    };

    const msgHeader = {
      authToken: localStorage.getItem('authtoken') || '',
      loginId: app.loginId,
      channelType: 'M',
      consumerId: '414',
      deviceId: 'MerchantWebApp',
      source: 'WEBDirect',
    };

    const deviceFPmsgHeader = {
      clientIPAddress: '192.168.0.122',
      connectionMode: 'WIFI',
      country: 'United States',
      deviceManufacturer: 'Xiaomi',
      deviceModelNo: 'Mi A2',
      dualSim: false,
      imeiNo: '09d9212a07553637',
      latitude: '',
      longitude: '',
      nwProvider: 'xxxxxxxx',
      osName: 'Android',
      osVersion: 28,
      timezone: 'Asia/Kolkata',
      versionCode: '58',
      versionName: '5.5.1',
    };

    const createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        dispatch(setAuthToken(res.header.authToken));
        
        if (res.data.details.payload.successFlag) {
          const taskId = res.data.details.taskId;
          const taskName = res.data.details.taskName;
          const taskDefinationKey = res.data.details.taskDefinationKey;
          
          setState(prev => ({
            ...prev,
            taskId,
            taskName,
            taskDefinationKey
          }));
          
          workFlowStatus();
        } else {
          setState(prev => ({
            ...prev,
            alert: true,
            alertMessage: res.data.details.payload.errorResponse.errorMessage
          }));
          workFlowStatus();
        }
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==", error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
  };

  const handleDateChange = (date: string) => {
    setState(prev => ({ ...prev, date, menu1: false }));
  };

  return (
    <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
      {/* Alert */}
      {state.alert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{state.alertMessage}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setState(prev => ({ ...prev, alert: false }))}
          >
            ×
          </button>
        </div>
      )}

          <div className="h-auto pb-12">
              {/* Header Section */}
              <div className="pb-5 text-center" style={{
                  backgroundImage: 'url("https://www.supermoney.in/pobbg.png")',
                  backgroundColor: '#f3f0fc',
                  paddingBottom: '45px',
              }}>
                  <img
                      src={panDetailsNew}
                      className="ml-10 mt-6"
                      alt="PAN Details"
                  />
                  <div className="text-left ml-10 mt-1">
                      <span className="text-[#4328ae] text-base font-bold">
                          Business PAN Details
                      </span>
                      <br />
                      <span className="text-xs">
                          Kindly provide PAN details of your business
                          <br />
                          Entity
                      </span>
                  </div>
              </div>

              {/* Form Section */}
              <div className="text-left mt-[-20px] rounded-[22px] bg-white mb-7 px-4 pt-5">
                  {/* PAN Number Input */}
                  <div className="relative mb-6">
                      <input
                          type="text"
                          value={state.panNumber}
                          onChange={(e) =>
                              setState((prev) => ({ ...prev, panNumber: e.target.value.toUpperCase() }))
                          }
                          onFocus={() => setIsPanFocused(true)}
                          onBlur={() => {
                              setIsPanFocused(false);
                              setIsPanTouched(true);
                          }}
                          maxLength={10}
                          disabled={state.panNumberDisabled}
                          placeholder={isPanFocused ? "Enter PAN Number" : ""}
                          className={`peer w-full px-3 pt-5 pb-2 border rounded-lg text-sm focus:outline-none
      ${(isPanTouched && !state.panNumber)
                                  ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-2 focus:ring-[#4328ae]"
                              }
      disabled:bg-gray-100 uppercase`}
                      />

                      <label
                          className={`absolute left-3 transition-all bg-white px-1 pointer-events-none
      ${state.panNumber || isPanFocused
                                  ? "-top-2 text-xs"
                                  : "top-3 text-sm text-gray-400"
                              }
      ${isPanTouched && !state.panNumber
                                  ? "text-red-500"
                                  : isPanFocused
                                      ? "text-[#4328ae]"
                                      : "text-gray-500"
                              }
    `}
                      >
                          PAN No.
                      </label>

                      {/* Error message */}
                      {isPanTouched && state.panNumber && !rules.pan(state.panNumber) && (
                          <p className="text-red-500 text-xs mt-1">Invalid PAN number.</p>
                      )}
                      {/* Error Message */}
                      {isPanTouched && !state.panNumber && (
                          <p className="text-red-500 text-xs mt-1">Required.</p>
                      )}
                  </div>

                  {/* Date Picker */}
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          {state.taskDefinationKey === 'INPANDOBPARTNER'
                              ? 'Date of Incorporation'
                              : 'Date of Birth'}
                      </label>
                      <div className="relative">
                          <input
                              type="text"
                              value={computedDateFormatted}
                              readOnly
                              placeholder={
                                  state.taskDefinationKey === 'INPANDOBPARTNER'
                                      ? 'Choose date of Incorporation'
                                      : 'Choose date of birth'
                              }
                              onClick={() => setState(prev => ({ ...prev, menu1: true }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4328ae] focus:border-transparent pl-10"
                          />
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          {state.date && (
                              <button
                                  onClick={() => setState(prev => ({ ...prev, date: null }))}
                                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                              >
                                  ×
                              </button>
                          )}
                      </div>

                      {state.menu1 && (
                          <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                              <input
                                  type="date"
                                  value={state.date || ''}
                                  onChange={(e) => handleDateChange(e.target.value)}
                                  max={maxDate}
                                  className="w-full p-2"
                              />
                          </div>
                      )}
                  </div>

                  {/* Contact Number */}
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact No.
                      </label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                              <span className="text-gray-500">+91 |</span>
                          </div>
                          <input
                              type="tel"
                              value={state.mobno}
                              disabled
                              maxLength={10}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4328ae] focus:border-transparent disabled:bg-gray-100 pl-20"
                          />
                      </div>
                  </div>

                  {/* WhatsApp Switch */}
                  <div className="flex items-center h-8 mb-5 mt-[-15px]">
                      <div className="text-xs font-semibold mr-2" onChange={switchChanged}>
                          Whatsapp no. same as contact no.
                      </div>
                      <button
                          onClick={() => setState(prev => ({ ...prev, sameAsContact: !prev.sameAsContact }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${state.sameAsContact ? 'bg-[#4328ae]' : 'bg-gray-200'
                              }`}
                      >
                          <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${state.sameAsContact ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                          />
                      </button>
                  </div>

                  {/* WhatsApp Number */}
                  <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp No.
                      </label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MessageCircle className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                              <span className="text-gray-500">+91 |</span>
                          </div>
                          <input
                              type="tel"
                              value={state.whatsappMobno}
                              onChange={(e) => setState(prev => ({ ...prev, whatsappMobno: e.target.value }))}
                              disabled={state.sameAsContact}
                              placeholder="Enter whatsapp no"
                              maxLength={10}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4328ae] focus:border-transparent disabled:bg-gray-100 pl-20"
                          />
                      </div>
                      {state.whatsappMobno && !rules.mobile(state.whatsappMobno) && (
                          <p className="text-red-500 text-xs mt-1">Invalid Mobile number.</p>
                      )}
                  </div>

                  {/* Email Address */}
<div className="relative mb-6">
    <input
        type="email"
        value={state.emailAddress}
        onChange={(e) =>
            setState((prev) => ({ ...prev, emailAddress: e.target.value }))
        }
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        placeholder={isEmailFocused ? "Enter Email Address" : ""}
        className={`peer w-full px-3 pt-5 pb-2 border rounded-lg text-sm focus:outline-none
        ${state.emailAddress && !rules.email(state.emailAddress)
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-[#4328ae]"
        }
        disabled:bg-gray-100`}
    />

    <label
        className={`absolute left-3 transition-all bg-white px-1 pointer-events-none
        ${state.emailAddress || isEmailFocused
            ? "-top-2 text-xs"
            : "top-3 text-sm text-gray-400"
        }
        ${state.emailAddress && !rules.email(state.emailAddress)
            ? "text-red-500"
            : isEmailFocused
                ? "text-[#4328ae]"
                : "text-gray-500"
        }
    `}
    >
        Email Id
    </label>

    {/* Validation Error */}
    {state.emailAddress && !rules.email(state.emailAddress) && (
        <p className="text-red-500 text-xs mt-1">Kindly enter correct Email address.</p>
    )}
</div>


                  {/* Consent Checkbox */}
                  <div className="flex items-start mb-6">
                      <input
                          type="checkbox"
                          checked={state.consent}
                          onChange={(e) => setState(prev => ({ ...prev, consent: e.target.checked }))}
                          className="mt-1 mr-2"
                      />
                      <label className="text-xs text-left text-gray-700">
                          I agree to fetch my KYC from CKYC Register and fetch bureau score
                          for credit underwriting
                      </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 max-w-[450px] mx-auto">
                      <button
                          onClick={profileupdate}
                          disabled={!state.consent}
                          className={`w-full py-3 rounded-lg font-semibold text-white cursor-pointer normal-case ${state.consent ? 'bg-[#7E67DA] hover:bg-[#6b5bbd]' : 'bg-gray-400 cursor-not-allowed'
                              }`}
                      >
                          Submit
                      </button>
                  </div>
              </div>
          </div>
    </div>
  );
};

function setCurrentMillis(arg0: string): any {
    throw new Error('Function not implemented.');
}
