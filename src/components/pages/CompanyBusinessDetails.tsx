import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange, setAuthToken } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { ArrowLeft, Phone, RotateCw } from 'lucide-react';
import shop from "../../assets/images/shop.png";

interface FormData {
  isGSTRegister: string;
  gstNumber: string;
  businessVinatge: string;
  annualIncome: string;
  margin: string;
  isOwnOffice: string;
  filedITR: string;
}

export const CompanyBusinessDetails: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  const [formData, setFormData] = useState<FormData>({
    isGSTRegister: 'No',
    gstNumber: '',
    businessVinatge: '',
    annualIncome: '',
    margin: '',
    isOwnOffice: '',
    filedITR: '',
  });

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [taskDefinationKey, setTaskDefinationKey] = useState('');
  const [taskId, setTaskId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [kycVerificationId, setKycVerificationId] = useState('');

  const isGSTRegisterList = ['Yes', 'No'];
  const businessVinatgeList = ['0-2 yrs', '2-3 yrs', '5-10 yrs', '10+ yrs'];
  const annualIncomeList = [
    'Less than 5 lakhs',
    '5-10 lakhs',
    '10-25 lakhs',
    '25-50 lakhs',
    '50 lakhs - 1 Cr',
    'More than 1 Cr',
  ];
    const isOwnOfficeList = ['Owned', 'Rented'];

    useEffect(() => {
        dispatch(routeChange('end'));
        workFlowStatus();
    }, []);

    // Validation rules
    const validateGSTIN = (value: string): boolean => {
        const pattern = /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
        return pattern.test(value);
    };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const gstFormatValidation = (): boolean => {
    return validateGSTIN(formData.gstNumber);
  };

  const validateFields = () => {
    const { isGSTRegister, gstNumber, businessVinatge, annualIncome, margin, isOwnOffice, filedITR } = formData;

    if (!isGSTRegister) {
      setAlert(true);
      setAlertMessage('Please select GST registration status');
      return;
    }

    if (isGSTRegister === 'Yes' && !gstFormatValidation()) {
      setAlert(true);
      setAlertMessage('Please enter correct GSTIN');
      return;
    }

    if (!businessVinatge) {
      setAlert(true);
      setAlertMessage('Please select age of business');
      return;
    }

    if (!annualIncome) {
      setAlert(true);
      setAlertMessage('Please select annual income');
      return;
    }

    if (!margin) {
      setAlert(true);
      setAlertMessage('Please enter business margin');
      return;
    }

    const marginNum = parseFloat(margin);
    if (marginNum < 0 || marginNum > 100) {
      setAlert(true);
      setAlertMessage('Please enter margin range 0 - 100');
      return;
    }

    if (!isOwnOffice) {
      setAlert(true);
      setAlertMessage('Please select office rented or owned');
      return;
    }

    if (!filedITR) {
      setAlert(true);
      setAlertMessage('Please select ITR status');
      return;
    }

    if (isGSTRegister === 'No') {
      const dataSend = {
        id: app.customerID?.toString() || '',
        type: 'Onboarding',
        gstinAvailabilityStatus: formData.isGSTRegister,
        gstin: formData.gstNumber,
        annualTurnover: formData.annualIncome,
        profitMargin: formData.margin,
        vintage: formData.businessVinatge,
        filedITR: formData.filedITR,
        additionalInfo: 'not available',
        officeType: formData.isOwnOffice,
      };
      uploadDataToKYC(dataSend);
    } else {
      fetchGSTDetails();
    }
  };

  const fetchGSTDetails = () => {
    dispatch(routeChange('start'));
    setLoading(true);

    const data = {
      fetchKycType: 'gstinSearch',
      request: {
        gstinNo: formData.gstNumber,
      },
    };

    const msgHeader = {
      authToken: localStorage.getItem('authtoken'),
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

    const requestData = { data, deviceFPmsgHeader, msgHeader };

    const options = {
      successCallBack: (res: any) => {
        if (res.data.details.data.gstnDetailed.gstinStatus === 'ACTIVE') {
          const dataSend = {
            id: app.customerID?.toString() || '',
            type: 'Onboarding',
            gstinAvailabilityStatus: formData.isGSTRegister,
            gstin: formData.gstNumber,
            annualTurnover: formData.annualIncome,
            profitMargin: formData.margin,
            vintage: formData.businessVinatge,
            filedITR: formData.filedITR,
            additionalInfo: 'not available',
            officeType: formData.isOwnOffice,
          };
          uploadDataToKYC(dataSend);
        } else {
          setAlert(true);
          setAlertMessage('GST is invalid or inactive');
        }
        setLoading(false);
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        console.log('Error:', error);
        setAlert(true);
        setAlertMessage('GST is invalid or inactive');
        setLoading(false);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/fetchKycDetails', {}, requestData, options);
  };

  const uploadDataToKYC = (dataSend: any) => {
    dispatch(routeChange('start'));
    setLoading(true);

    const options = {
      successCallBack: (res: any) => {
        console.log(res);
        workFlowStatus();
        setLoading(false);
      },
      failureCallBack: (error: any) => {
        console.log('Error:', error);
        setLoading(false);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/credit-analytics-service/creditAnalytics/captureAdditionalBusinessDetails',{}, dataSend, options);
  };

  const workFlowStatus = () => {
    dispatch(routeChange('start'));
    setLoading(true);

    const payload = {};

    const data = {
      workflowApiType: "status",
      request: {
        customerId: app.customerID,
        profileId: app.profileID,
        workFlowId: app.workFlowID,
        // customerType: app.legalEntityType,
        // legalEntityType: app.legalEntityType,
        workFlowType: "Onboarding",
        // taskId: '', // You might need to get this from state
        // skipWorkFlow: false,
        // isWorkFlowCompleted: true,
        // taskDefinationKey: '', // You might need to get this from state
        // taskName: '', // You might need to get this from state
        // payload: payload,
      },
    };

    const msgHeader = {
      authToken: localStorage.getItem('authtoken'),
      loginId: app.loginId,
      channelType: 'M',
      consumerId: '414',
      deviceId: 'MerchantWebApp',
      source: 'WEB',
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
        // const taskDefinationKey = res.data.details.taskDefinationKey;
        // if (taskDefinationKey === 'OWNERSHIP_PARTNER_BASIC_DETAILS') {
        //   navigate('/CompanyPartnerShipDetails');
        // } else {
        //   navigate('/CompanyShareHoldingDetails');
        // }
        setLoading(false);
        dispatch(routeChange('end'));
        console.log(res);
        dispatch(setAuthToken(res.header.authToken));
        if (res.data.successFlag) {
          setTaskId(res.data.details.tasks[0].taskId);
          setTaskName(res.data.details.tasks[0].taskName);
          setTaskDefinationKey(res.data.details.tasks[0].taskDefinationKey);
          setKycVerificationId(res.data.details.tasks[0].kycVerificationId);

          switch (taskDefinationKey) {      // res.data.details.tasks[0].taskDefinitionKey
            case 'BUSINESS_BASIC_DETAILS':
                navigate('/CompanyBasicDetails');
              break;
            case 'BUSINESS_ADDITIONAL_DETAILS':
              break;
            case 'OWNERSHIP_PARTNER_BASIC_DETAILS':
              navigate('/CompanyPartnerShipDetails');
              break;
            case 'OWNERSHIP_COMPANY_BASIC_DETAILS':
              navigate('/CompanyShareHoldingDetails');
              break;
            case 'OWNERSHIP_ADDITIONAL_DETAILS':
              navigate('/BusinessOfficeDetails');
              break;
          }
        }
      },
      failureCallBack: (error: any) => {
        // handle error
        console.log("display  ==" + error);
        setLoading(false);
        dispatch(routeChange('end'));
      },
    };

    makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <div className="max-w-[450px] mx-auto text-left font-montserrat min-h-screen bg-white">
      <div className="h-auto">
        {/* Alert */}
        {alert && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{alertMessage}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setAlert(false)}
            >
              &times;
            </button>
          </div>
        )}
        <div className="h-auto pb-12 mx-4">
          <div className="flex items-center px-2.5 py-0">
            <div className="w-1/4 text-center mx-auto p-3">
              <img src={shop} alt="landing" className="mx-auto" />
            </div>
            <div className="w-3/4 p-3">
              <span className="font-bold text-base">Business Details</span>
              <br />
              <span className="text-sm">Please provide the details for your Business</span>
            </div>
          </div>

          <div className="mt-6 mx-5">
            {/* GST Registration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Business GST Registered
              </label>
              <select
                value={formData.isGSTRegister}
                onChange={(e) => handleInputChange('isGSTRegister', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {isGSTRegisterList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* GST Number */}
            {formData.isGSTRegister === 'Yes' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your GST
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                  maxLength={15}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="Enter GST number"
                />
                {formData.gstNumber && !validateGSTIN(formData.gstNumber) && (
                  <p className="text-red-500 text-xs mt-1">Invalid GSTIN</p>
                )}
              </div>
            )}

            {/* Business Vintage */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age of business
              </label>
              <select
                value={formData.businessVinatge}
                onChange={(e) => handleInputChange('businessVinatge', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {businessVinatgeList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Annual Income */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Gross Sales Revenue
              </label>
              <select
                value={formData.annualIncome}
                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {annualIncomeList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Margin */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Margin %
              </label>
              <input
                type="number"
                value={formData.margin}
                onChange={(e) => handleInputChange('margin', e.target.value)}
                max={100}
                min={0}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter margin percentage"
              />
            </div>

            {/* Office Ownership */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Do you own the office
              </label>
              <select
                value={formData.isOwnOffice}
                onChange={(e) => handleInputChange('isOwnOffice', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {isOwnOfficeList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ITR Filing */}
            <div className="mb-6">
              <span className="text-base font-medium">
                Have you filed your ITR for the last 2 financial years
              </span>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    value="Yes"
                    checked={formData.filedITR === 'Yes'}
                    onChange={(e) => handleInputChange('filedITR', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="No"
                    checked={formData.filedITR === 'No'}
                    onChange={(e) => handleInputChange('filedITR', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={validateFields}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <RotateCw className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
