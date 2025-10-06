// BusinessDetails.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
    routeChange,
    setLegalEntityType,
    setWorkFlowID,
    setCompanyName,
    setAuthToken
} from '../../store/appSlice';
import { makeAPIPOSTRequest, makeAPIGETRequest } from '../../utils/apiActions';
import { ChevronDown, Building2, MapPin } from 'lucide-react';
import businessHeader from "../../assets/images/businessheader.png";
import { Dropdown } from '../items/Dropdown';

import axios from 'axios';

interface BusinessType {
    text: string;
    value: string;
    enabled: boolean;
}

interface City {
    city: string;
}

interface CompanyItem {
    companyName: string;
}

export const BusinessDetails: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);

    // State variables
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [cityList, setCityList] = useState<City[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [companyNameItems, setCompanyNameItems] = useState<CompanyItem[]>([]);
    const [storeID, setStoreID] = useState('');
    const [companyDisabled, setCompanyDisabled] = useState(false);
    const [typeOfBusinessSelected, setTypeOfBusinessSelected] = useState('');
    const [radioGroup, setRadioGroup] = useState('');
    const [kycVerificationId, setKycVerificationId] = useState<string | null>(null);
    const [createWorkflowResponse, setCreateWorkflowResponse] = useState<any>('');
    const [workflowID, setWorkflowID] = useState('');
    const [breFlag, setBreFlag] = useState(true);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);

    // Static data
    const items = [
        'Kirana',
        'Garments',
        'Mobile',
        'Electronics',
        'Pharmacy',
        'Toys & Gifts',
        'Footwear',
        'Hardware',
        'Children\'s Clothing',
        'Beauty & Fashion',
        'Books & Stationery',
        'Others',
    ];

    const buissnessType: BusinessType[] = [
        { text: 'Proprietorship', value: 'Proprietorship', enabled: false },
        { text: 'Partnership', value: 'Partnership', enabled: false },
        { text: 'Company', value: 'Company', enabled: true },
    ];

    useEffect(() => {
        dispatch(routeChange('end'));

        if (app.leadID != null && app.leadID.length > 0) {
            getLeadDetails();
        } else {
            getLeadDetailsByMobileNumber();
        }

        fetchApplicationId();
        getVerificationID();
        fetchLocation();
    }, []);

    const getVerificationID = () => {
        dispatch(routeChange('start'));
        let url = "https://.mintwalk.com/kycServices/getKycVeriId/?customer_id=" + app.customerID;

        axios
            .get(url)
            .then(function (response) {
                dispatch(routeChange('end'));

                const JSONData = response.data;

                if (JSONData.successFlag) {
                    setKycVerificationId(JSONData.data.profiles[0].kycIds[0].kyc_verification_id);

                    console.log(kycVerificationId);
                }
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==", error);
            })
            .finally(function () {
                dispatch(routeChange('end'));
            });
    };

    const fetchApplicationId = () => {
        dispatch(routeChange('start'));

        const request = {
            customerId: app.customerID,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (res: any) => {
                dispatch(routeChange('end'));
                console.log(res);
                setBreFlag(res.getCustomerApplicationResponseList[0].programDetails.breRequired);
                setCompanyName(res.getCustomerApplicationResponseList[0].programDetails.company);

                if (res.getCustomerApplicationResponseList[0].programDetails.company != "Netmeds") {    // why i 
                    // Enable partnership if not Netmeds
                    const updatedBusinessType = [...buissnessType];     //here I have make shallow copy of businessType array it will not affect original array
                    updatedBusinessType[1].enabled = true;
                }

                if (res.getCustomerApplicationResponseList[0].programDetails.company != undefined &&
                    res.getCustomerApplicationResponseList[0].programDetails.company.length > 0) {
                    setCompanyDisabled(true);
                }

                if (res.getCustomerApplicationResponseList[0].programDetails.company == "NETMEDS") {
                    // Disable partnership for NETMEDS
                    const updatedBusinessType = [...buissnessType];
                    updatedBusinessType[1].enabled = false;
                } else {
                    const updatedBusinessType = [...buissnessType];
                    updatedBusinessType[1].enabled = true;
                }

                getProgeamDetails(res.getCustomerApplicationResponseList[0].programDetails.requestId);
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("display  ==" + error);
                // dispatch(routeChange('end'));
            }
        };

        makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, request, options);
    };

    const getProgeamDetails = (requestId: string) => {
        const data = { requestId };

        const options = {
            successCallBack: (res: any) => {
                setCityList(res.getProgramRespList[0].cityMasterDetails);
                setWorkflowID(res.getProgramRespList[0].workflowId);
            },
            failureCallBack: (error: any) => {
                // handle error
                console.log("display  ==", error);
            }
        };

        makeAPIPOSTRequest('/supermoney-service/program/get', {}, data, options);
    };

    const getLeadDetails = () => {

        let url = "https://.mintwalk.com/crmbackend/GetBorrowerLead/?lead_id=" + app.leadID;
        axios
            .get(url)
            .then(function (response) {
                const JSONData = response.data;

                if (JSONData.data.length > 0) {
                    setStoreID(JSONData.data[0].retailer_code);
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

    const getLeadDetailsByMobileNumber = () => {
        let loginId = app.loginId?.replace("+91", "");
        let url = "https://.mintwalk.com/crmbackend/GetBorrowerLead/?phone_number=" + loginId;
        axios
            .get(url)
            .then(function (response) {
                const JSONData = response.data;

                if (JSONData.data.length > 0) {
                    setStoreID(JSONData.data[0].retailer_code);
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

    const fetchLocation = () => {
        axios
            .get("http://ip-api.com/json")
            .then(function (res) {
                setLat(res.data.lat);
                setLon(res.data.lon);
                getLiveLocation();
            })
            .catch(function (error) {
                // handle error
                console.log("display  ==", error);
            })
            .finally(function () {
                // always executed
            });
    };

    const showPosition = (position: GeolocationPosition) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
    };

    const getLiveLocation = () => {
        navigator.permissions
            .query({
                name: "geolocation",
            })
            .then(function (result) {
                if (result.state == "granted") {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else if (result.state == "prompt") {
                    console.log("prompt" + result.state);

                    navigator.geolocation.getCurrentPosition(
                        showPosition,
                        () => { },
                        { enableHighAccuracy: true }
                        //   revealPosition,
                        //   positionDenied,
                        //   geoSettings
                    );
                } else if (result.state == "denied") {
                    console.log(result.state);
                }
                result.onchange = function () {
                    console.log(result.state);
                };
            });
    };

    const createWorkFLow = () => {
        if (
            companyName.length > 0 &&
            (companyName !== "CGMARKETING" || storeID.length > 0) &&
            typeOfBusinessSelected.length > 0 &&
            radioGroup.length > 0
        ) {
            dispatch(routeChange('start'));

            dispatch(setLegalEntityType(radioGroup));
            let url = "https://.mintwalk.com/tomcatb/workflow-management-services/workflow/createV2";

            const data = {
                customerId: app.customerID,
                profileId: app.profileID,
                customerType: radioGroup,
                legalEntityType: radioGroup,
                workFlowType: 'Onboarding',
                applicationId: app.applicationId,
                companyName: companyName,
                lattitude: lon,
                longitude: lat,
                workflowTypeId: radioGroup === "Partnership" ? "SMALL_MANDATE_PARTNERSHIP" : workflowID,
                breRequired: breFlag,
            };

            axios
                .post(url, data)
                .then(function (response: any) {
                    dispatch(routeChange('end'));
                    console.log(response);
                    const JSONData = response.data;
                    setCreateWorkflowResponse(JSONData);

                    dispatch(setWorkFlowID(response.workFlowId));
                    dispatch(setCompanyName(companyName) as any);
                    if (kycVerificationId == null) {
                        if (
                            JSONData.taskDefinationKey == "INPANDOB" ||
                            JSONData.taskDefinationKey == "INPANDOBPARTNER"
                        ) {
                            const queryParams = new URLSearchParams({
                                businessType: typeOfBusinessSelected,
                                storeID: storeID,
                            }).toString();
                            navigate(`/PanDetails?${queryParams}`);
                        } else {
                            const queryParams = new URLSearchParams({
                                businessType: typeOfBusinessSelected,
                                entityType: radioGroup,
                            }).toString();
                            navigate(`/CompanyBasicDetails?${queryParams}`);
                        }
                    } else {
                        workFlowStatus();
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log("display  ==", error);
                })
                .finally(function () {
                    //self.$store.commit("routeChange", "end");
                });
        } else {
            if (companyName.length === 0) {
                setAlertMessage("Select company name");
                setAlert(true);
            } else if (companyName === "CGMARKETING" && storeID.length === 0) {
                setAlertMessage("Enter Retailer Store Id");
                setAlert(true);
            } else {
                setAlertMessage(
                    typeOfBusinessSelected.length === 0
                        ? "Select Type Of Business"
                        : "Select Type Of Business Entity"
                );
                setAlert(true);
            }
        }
    };

    const workFlowStatus = () => {
        dispatch(routeChange('start'));
        const data = {
            workflowApiType: 'status',
            request: {
                customerId: app.customerID,
                profileId: app.profileID,
                company: app.companyName,
                workFlowType: 'Onboarding',
            },
        };
      let msgHeader = {
        authToken: localStorage.getItem("authtoken"), //dynamic
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
                console.log(res);
                dispatch(setAuthToken(res.header.authToken));
                if (res.data.successFlag) {
                    dispatch(setWorkFlowID(res.data.details.businessKey));
                    // Handle routing based on task definition key
                    const taskKey = res.data.details.tasks[0].taskDefinitionKey;
                    handleTaskRouting(taskKey);
                };    
            },
            failureCallBack: (error: any) => {
                console.log('display ==', error);
                dispatch(routeChange('end'));
            }
        };

        makeAPIPOSTRequest('/mintLoan/mintloan/workflow', {}, createWorkflowRequest, options);
    };

    const handleTaskRouting = (taskKey: string) => {
        const routingMap: { [key: string]: string } = {
            'INPANDOB': '/FetchInfoPage',
            'INPANDOBPARTNER': '/FetchInfoPage',
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

        const route = routingMap[taskKey];
        if (route) {
            if (taskKey === 'INPANDOB' || taskKey === 'INPANDOBPARTNER') {
                // navigate(route, {
                //     state: {
                //         kycVerificationId: kycVerificationId,
                //         businessType: typeOfBusinessSelected,
                //         storeID: storeID,
                //     },
                // });
                const queryParams = new URLSearchParams({
                    kycVerificationId: kycVerificationId || '',
                    businessType: typeOfBusinessSelected,
                }).toString();
                navigate(`${route}${queryParams}`);
            } else {
                navigate(route);
            }
        }
    };

    return (
        <div className="max-w-[450px] mx-auto min-h-screen bg-white font-['Montserrat'] text-left">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{alertMessage}</span>
                    <button
                        className="absolute top-0 right-0 px-4 py-3"
                        onClick={() => setAlert(false)}
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className=" pb-12">
                {/* Header Section */}
                <div className="pb-5 text-center" style={{
                    backgroundImage: 'url("https://www.supermoney.in/pobbg.png")',
                    backgroundColor: '#f3f0fc',
                    paddingBottom: '45px',
                }}>
                    <img
                        src={businessHeader}
                        className="ml-10 mt-6"
                        alt="Business Header"
                    />
                    <div className="text-left ml-10 mt-1">
                        <span className="text-[#4328ae] text-base font-bold">
                            Business Details
                        </span>
                        <br />
                        <span className="text-xs">
                            Your business type and entity let us<br />
                            understand your loan eligibility better.
                        </span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="text-left mt-[-20px] rounded-[22px] bg-white mb-7 pl-4 pt-5 pr-4">
                    {/* Company Name Select (Hidden) */}
                    <div className={`mb-4 ${companyName === 'CGMARKETING' ? 'block' : 'hidden'}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Retailer Store Id
                        </label>
                        <input
                            type="text"
                            value={storeID}
                            onChange={(e) => setStoreID(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent"
                            placeholder="Enter Retailer Store Id"
                        />
                    </div>

                    {/* Type of Business Select */}
                    <Dropdown
                        items={items}
                        selected={typeOfBusinessSelected}
                        setSelected={setTypeOfBusinessSelected}
                        label="Type of Business"
                     />

                    {/* <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type of Business
                        </label>
                        <div className="relative">
                            <select
                                value={typeOfBusinessSelected}
                                onChange={(e) => setTypeOfBusinessSelected(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E67DA] focus:border-transparent appearance-none"
                            >
                                <option value="">Select your business type</option>
                                {items.map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>  
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        </div>
                    </div> */}

                    {/* Business Entity Type */}
                    <div className="mb-6">
                        <div className="text-[#4328ae] text-sm text-left font-medium mb-3">
                            Type of Business Entity
                        </div>
                        <div className="space-y-3">
                            {buissnessType.map((item, index) => (
                                <label key={index} className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="businessEntity"
                                        value={item.text}
                                        checked={radioGroup === item.text}
                                        onChange={(e) => setRadioGroup(e.target.value)}
                                        disabled={item.enabled}
                                        className="h-4 w-4 text-[#7E67DA] focus:ring-[#7E67DA] border-gray-300"
                                    />
                                    <span className={`text-sm ${item.enabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                        {item.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cities Applicable */}
                    <div className="mt-4">
                        <div className="text-[#4328ae] text-sm text-left font-medium mb-3">
                            Cities Applicable
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {cityList.map((item, index) => (
                                <span
                                    key={index}
                                    className="text-white bg-[#7E67DA] text-xs px-3 py-1 rounded-full"
                                >
                                    {item.city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 w-full max-w-[450px] text-center pt-3 mt-5 bg-white">
                <div className="mx-5 max-w-[450px]">
                    <button
                        onClick={createWorkFLow}
                        className="w-full bg-[#7E67DA] hover:bg-[#6b5bb5] text-white py-3 px-4 rounded-md cursor-pointer transition-colors duration-200"
                    >
                        <span className="text-white font-semibold">Submit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
