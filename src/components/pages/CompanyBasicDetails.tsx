import { useState, useEffect } from 'react';
import shop from "../../assets/images/shop.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import axios from 'axios';

interface StateItem {
  cityName: string;
  value: string;
}

export const CompanyBasicDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [nameOfBusiness, setNameOfBusiness] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [nameOfContactPerson, setNameOfContactPerson] = useState('');
  const [mobno, setMobno] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [state, setState] = useState('');
  const [code, setCode] = useState('');

  const [taskDefinationKey, setTaskDefinationKey] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [kycVerificationId, setKycVerificationId] = useState('');

  const max = 10;

  const stateItems: StateItem[] = [
    { cityName: 'Maharashtra', value: 'maharashtra' },
    { cityName: 'Delhi', value: 'delhi' },
    // Add more states
  ];

  const rules = {
    required: (value: string) => !!value || 'Required.',
    pan: (value: string) => {
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panPattern.test(value) || 'Invalid PAN format';
    },
    mobile: (value: string) => {
      const mobilePattern = /^[6-9]\d{9}$/;
      return mobilePattern.test(value) || 'Invalid mobile number';
    },
    repeatedNumbers: (value: string) => {
      const repeatedPattern = /^(\d)\1{9}$/;
      return !repeatedPattern.test(value) || 'Invalid mobile number';
    },
    email: (value: string) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value) || 'Invalid email format';
    },
  };

  useEffect(() => {
    dispatch(routeChange('end'));
    workFlowStatus();
  }, []);

  // const dial = () => {
  //   const mobile = "9920111400";
  //   const mobile1 = "02269516677";
  //   const Number = app.companyName === "NETMEDS" || app.companyName === "JIOMART" ? mobile1 : mobile;
  //   window.open(`tel:${Number}`, '_self');
  // };

  const workFlowStatus = () => {
    dispatch(routeChange('start'));

    const data = {
      workflowApiType: "status",
      request: {
        customerId: app.customerID,
        profileId: app.profileID,
        workFlowId: app.workFlowID,
        workFlowType: "Onboarding",
      },
    };

    const msgHeader = {
      authToken: app.authToken || '',
      loginId: app.loginId || '',
      channelType: "M",
      consumerId: "414",
      deviceId: "MerchantWebApp",
      source: "WEB",
    };

    const deviceFPmsgHeader = {
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

    const createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        dispatch(routeChange('end'));
        dispatch(setAuthToken(res.header.authToken));
        
        if (res.data.successFlag) {
          setTaskId(res.data.details.tasks[0].taskId);
          setTaskName(res.data.details.tasks[0].taskName);
          setTaskDefinationKey(res.data.details.tasks[0].taskDefinationKey);
          setKycVerificationId(res.data.details.tasks[0].kycVerificationId);

          switch (taskDefinationKey) {      // res.data.details.tasks[0].taskDefinitionKey
            case 'BUSINESS_BASIC_DETAILS':
              break;
            case 'BUSINESS_ADDITIONAL_DETAILS':
              navigate('/CompanyBusinessDetails');
              break;
            case 'OWNERSHIP_PARTNER_BASIC_DETAILS':
              navigate('/CompanyPartnerShipDetails');
              break;
            case 'OWNERSHIP_ADDITIONAL_DETAILS':
              navigate('/BusinessOfficeDetails');
              break;
          }
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==", error);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
  };

  const removeDuplicateCharacters = (string: string) => {
    const temp = string
      .split('')
      .filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join('');
    return temp.length;
  };

  const checkInitialLetter = (string: string) => {
    return parseInt(string.split('')[0]) > 4;
  };

  const validateFields = () => {
    if (!nameOfBusiness.trim()) {
      showAlert('Please enter name of business');
      return;
    }
    if (!panNumber.trim() || !rules.pan(panNumber)) {
      showAlert('Please enter correct PAN');
      return;
    }
    if (!nameOfContactPerson.trim() || !/^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(nameOfContactPerson)) {
      showAlert('Please enter correct name of contact person');
      return;
    }
    if (mobno.length !== 10 || removeDuplicateCharacters(mobno) <= 1 || !checkInitialLetter(mobno)) {
      showAlert('Please enter contact number');
      return;
    }
    if (!rules.email(email)) {
      showAlert('Please enter correct email');
      return;
    }
    if (!address.trim()) {
      showAlert('Please enter correct address');
      return;
    }
    if (!apartment.trim()) {
      showAlert('Please enter correct apartment');
      return;
    }
    if (!state.trim()) {
      showAlert('Please choose state');
      return;
    }
    if (code.length !== 6) {
      showAlert('Please enter correct postal code');
      return;
    }

    fetchPanDetails();
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlert(true);
    setTimeout(() => setAlert(false), 3000);
  };

  const fetchPanDetails = () => {
    dispatch(routeChange('start'));
    let url = "https://.mintwalk.com/tomcat/kycservice/kyc/fetchPANV2";
    const data = {
      client_id: 'InvoiceFinancing',
      payload: {
        panNo: panNumber,
        fetchLiveData: true,
      },
      request_id: app.customerID,
      requester_id: app.profileID,
      service_provider_name: "NIL",
    };

    axios
        .post(url, data)
        .then(function (res: any) {
          console.log(res);
          if (res.payload.panStatus == "VALID") {
            let dataSend = {
              customer_id: app.customerID,    // see customerId < created() in Vue file,
              profile_id: app.profileID,
              kyc_verification_id: kycVerificationId,   //I have create useState
              data: [
                {
                  source: "CUSTOMER_BASIC_DETAILS",
                  data: {
                    business_name: nameOfBusiness,
                    business_address: address,
                    pincode: code,
                    state: state,
                    contact_person_name: nameOfContactPerson,
                    contact_number: mobno,
                    email_id: email,
                    login_id: app.loginId,
                  },
                },
                {
                  source: "PAN",
                  data: {
                    pan_name: res.payload.name,
                    pan_number: res.payload.pan,
                    typeOfHolder: res.payload.typeOfHolder,
                    title: res.payload.title,
                    firstName: res.payload.firstName,
                    middleName: res.payload.middleName,
                    lastName: res.payload.lastName,
                    panStatus: res.payload.panStatus,
                    aashaarSeedingStatus: res.payload.aadhaarSeedingStatus,
                    login_id: app.loginId,
                  },
                },
              ],
            };
            uploadDataToKYC(dataSend);
          } else {
            showAlert('Entered PAN number is invalid');
            dispatch(routeChange('end'));
          }
        })
        .catch(function (error: any) {
          // handle error
          showAlert('Entered PAN number is invalid');
          dispatch(routeChange('end'));
        })
        .finally(function () {
          // always executed
        });
  };

  const uploadDataToKYC = (dataSend: any) => {
    dispatch(routeChange('start'));

    const data = {
      kycServicesType: "CustomerKycDetails",
      request: dataSend,
    };

    const msgHeader = {
      authToken: app.authToken || '',
      loginId: app.loginId || '',
      channelType: "M",
      consumerId: "414",
      deviceId: "MerchantWebApp",
      source: "WEB",
    };

    const deviceFPmsgHeader = {
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

    const createWorkflowRequest = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        dispatch(setAuthToken(res.header.authToken));
        if (res.data.successFlag && res.data.details.successFlag) {
          profileupdateV2();
        } else {
          console.log("Hitting==" + res.data.details.errorDetails.errorMessage)
          const errorMessage = res.data.details.errorDetails?.errorMessage || 'Unknown error occurred';
          showAlert(errorMessage);
          dispatch(routeChange('end'));
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==", error);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/kycCustomerServices', {}, createWorkflowRequest, options);
  };

  const profileupdateV2 = () => {
    dispatch(routeChange('start'));

    const customerData = {
      finalUpdate: true,
      companyName: app.companyName,
      onboardingPartner: app.onboardingName,
      companyType: new URLSearchParams(window.location.search).get('entityType') || '', 
      businessType: new URLSearchParams(window.location.search).get('businessType') || '',
    };

    const data = { customerData };

    const msgHeader = {
      authToken: app.authToken || '',
      loginId: app.loginId || '',
      channelType: 'M',
      consumerId: '414',
      deviceId: 'SwiggyLoans',
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

    const employeeDetails = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        if (res.data.successFlag === true) {
          completeDigiLocker();
        } else {
          const errorMessage = res.header.error?.errorDesc || res.data.errorDetails?.[0]?.errorDesc || 'Unknown error occurred';
          showAlert(errorMessage);
          dispatch(routeChange('end'));
        }
      },
      failureCallBack: (error: any) => {
        showAlert('Server Connection Failed');
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/updateBasicProfilev2', {}, employeeDetails, options);
  };

  const completeDigiLocker = () => {
    dispatch(routeChange('start'));

    const data = {
      workflowApiType: "trigger",
      request: {
        customerId: app.customerID,
        profileId: app.profileID,
        workFlowId: app.workFlowID,
        customerType: app.legalEntityType,
        legalEntityType: app.legalEntityType,
        workFlowType: "Onboarding",
        taskId: taskId, 
        skipWorkFlow: false,
        isWorkFlowCompleted: true,
        taskDefinationKey: taskDefinationKey, 
        taskName: taskName,
        payload: {},
      },
    };

    const msgHeader = {
      authToken: app.authToken || '',
      loginId: app.loginId || '',
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

    const requestData = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        dispatch(setAuthToken(res.header.authToken))
        const taskDefinationKey = res.data.details.taskDefinationKey;
        if (taskDefinationKey === "BUSINESS_ADDITIONAL_DETAILS") {
          navigate('/CompanyBusinessDetails');
        }
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        console.log('Error:', error);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, requestData, options);
  };

  return (
    <div
      className="max-w-[450px] mx-auto text-left font-['Montserrat'] min-h-screen bg-white"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Alert */}
      {alert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{alertMessage}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setAlert(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="h-auto pb-12 mx-5">
        <div className="flex items-start gap-4 px-2.5 py-0">
          <div className="w-1/4 text-center">
            {/* <Store className="w-12 h-12 mx-auto text-gray-600" /> */}
            <img src={shop} alt="" />
          </div>
          <div className="w-3/4">
            <h2 className="font-bold text-base mb-1">Basic Details</h2>
            <p className="text-sm text-gray-600">
              Please provide the details for your Business
            </p>
          </div>
        </div>

        <div className="mt-6 mx-5">
          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of your business
            </label>
            <input
              type="text"
              value={nameOfBusiness}
              onChange={(e) => setNameOfBusiness(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* PAN Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business PAN
            </label>
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {panNumber && !rules.pan(panNumber) && (
              <p className="text-red-500 text-xs mt-1">Invalid PAN format</p>
            )}
          </div>

          {/* Contact Person */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of the Contact Person
            </label>
            <input
              type="text"
              value={nameOfContactPerson}
              onChange={(e) => setNameOfContactPerson(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Mobile Number
            </label>
            <input
              type="number"
              value={mobno}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= max) {
                  setMobno(value);
                }
              }}
              maxLength={max}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {mobno && !rules.mobile(mobno) && (
              <p className="text-red-500 text-xs mt-1">Invalid mobile number</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
            {email && !rules.email(email) && (
              <p className="text-red-500 text-xs mt-1">Invalid email format</p>
            )}
          </div>

          {/* Business Address Section */}
          <div className="mb-4">
            <h3 className="font-bold text-sm mb-3">Business Address</h3>
            
            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Apartment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, Suite, etc.
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select State</option>
                {stateItems.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.cityName}
                  </option>
                ))}
              </select>
            </div>

            {/* Postal Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal code
              </label>
              <input
                type="number"
                value={code}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 6) {
                    setCode(value);
                  }
                }}
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={validateFields}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-5 mb-6"
            style={{ textTransform: 'none', fontWeight: 700 }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
