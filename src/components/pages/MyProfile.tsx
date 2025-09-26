import React, { useEffect, useState } from 'react';
import LogoBlue from '../../assets/images/landinglogoblue.png';
import MyProfileImg from '../../assets/images/myprofile.png';
import { ArrowLeft, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { makeAPIGETRequest, makeAPIPOSTRequest } from '../../utils/apiActions';
import { useDispatch } from 'react-redux';
import { routeChange } from '../../store/appSlice';

declare const JSBridge: {
    call: (number: string) => void;
};

const MyProfile: React.FC = () => {
    const [alert, setAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('Something went wrong');
    const [height, setHeight] = useState<number>(window.innerHeight);
    const [name, setName] = useState<string>('John Doe');
    const [mobno, setMobno] = useState<string>('9876543210');
    const [customerWhatsappNumber, setCustomerWhatsappNumber] = useState<string>('9876543210');
    const [emailId, setEmailId] = useState<string>('john@example.com');
    const [address, setAddress] = useState<string>('123 Business Street, Mumbai');
    const [editFlag, setEditFlag] = useState<boolean>(false);
    const app = useSelector((state: RootState) => state.app)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const goBack = () => {
        navigate(-1)
    };

    const dial = () => {
        // let Number =  this.$store.getters.companyName == "NETMEDS" ||
        // this.$store.getters.companyName == "JIOMART"
        //     ? this.mobile1
        //     : this.mobile;
        // try {
        //     JSBridge.call(Number);
        // } catch (err) {
        //     window.open("tel:" + Number, "_self");
        // }
        const number = app.companyName == "NETMEDS" || app.companyName == "JIOMART" ? "02269516677" : "9920111300";
        console.log('Dialing:', number);
        // JSBridge.call(number);
        window.open(`tel:${number}`, '_self');
    };

    const getKYCVerificationID = () => {

        const url = "/kycServices/getKycVeriId/?customer_id=" + app.customerID;

        const options = {
            successCallBack: (response: any) => {
                if (response.data.profiles.length > 0) {
                    getCustomerData(response.data.profiles[0].kycIds[0].kyc_verification_id);
                }
            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
            },
        };

        makeAPIGETRequest(url, {}, options);
    }

    const getCustomerData = (kycVerificationId: string) => {

        const url = "https://uatgateway.supermoney.in/kycServices/CustomerKycDetailsV2?kyc_verification_id=" + kycVerificationId;
        const options = {
            successCallBack: (response: any) => {

                if (response.data.length > 0) {
                    setCustomerWhatsappNumber( response.data[0].customer.whatsapp_number || '' );
                    setEmailId( response.data[0].customer.email_id || '' );

                    if (response.data[0].digio_aadhaar) {
                        setAddress(response.data[0].digio_aadhaar.address);
                    } else if (response.data[0].digio_voter_id) {
                        setAddress(response.data[0].digio_voter_id.address);
                    } else if (response.data[0].digio_passport) {
                        setAddress(response.data[0].digio_passport.address);
                    } else if (response.data[0].digio_driving_license) {
                        setAddress(response.data[0].digio_driving_license.address);
                    } else if (response.data[0].physical_aadhar) {
                        setAddress(response.data[0].physical_aadhar.address);
                    }
                }

            },
            failureCallBack: (error: any) => {
                console.log("display  ==" + error);
            },
        };
        makeAPIGETRequest(url, {}, options);

    }

    const customerProfile = () => {
        dispatch(routeChange('start'));

        let url = "/supermoney-service/customer/profile";
        let request = {
            loginId: app.loginId,
            applicationId: app.applicationId,
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'));
                if (response.errorMessage === "" || response.errorMessage === null) {
                    let name = response.name;

                    if (name.length > 0) {
                        setName(name.split(" ")[0]);
                    }
                } else {
                    setAlert(true);
                    setAlertMessage(response.errorMessage);
                }
            },
            failureCallBack: (error: any) => {
                dispatch(routeChange('end'));
                console.log("display  ==" + error);
            },
        };

        makeAPIPOSTRequest(url, {}, request, options);

    }

    useEffect(() => {
        getKYCVerificationID();
        customerProfile();
        setHeight(document.documentElement.clientHeight);
    }, []);

    return (
        <div
            className="bg-[#f3f0fc] font-montserrat text-left min-h-screen max-w-[450px] mx-auto"
            style={{ minHeight: `${height}px` }}
        >
            {alert && (
                <div className="bg-red-100 text-red-800 p-2 rounded mb-2">
                    {alertMessage}
                </div>
            )}

            <div className="flex justify-between items-center p-4 bg-[#f3f0fc]">
                <div className="text-left cursor-pointer" onClick={goBack}>
                    <span className="text-[#4328ae]"><ArrowLeft /></span>
                </div>
                <div className="w-1/2 text-center">
                    <img
                        src={LogoBlue}
                        alt="logo"
                        className="w-[138px] mx-auto"
                    />
                </div>
                <div className="text-right cursor-pointer" onClick={dial}>
                    {/* <span className="text-[#4328ae]">📞</span> */}
                    <Phone className="text-[#4328ae]" fill={'#4328ae'} />
                </div>
            </div>

            <div className="pb-12" >
                <div className="pb-5 text-center" style={{
                    backgroundImage: 'url("https://www.supermoney.in/pobbg.png")',
                    backgroundColor: '#f3f0fc',
                    paddingBottom: '45px',
                }}>
                    <div className="mx-auto mt-4 rounded-3xl w-fit">
                        <img
                            src={MyProfileImg}
                            alt="profile"
                            className="bg-white p-4 rounded-2xl"
                        />
                    </div>
                    <div className="mt-2">
                        <span className="text-sm font-bold">{name}</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 mx-2 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <span className="text-[#4328ae] text-lg font-bold">My Profile</span>
                    </div>

                    {!editFlag && (
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-[#4328ae]">Contact Number</span>
                                <br />
                                <span className="text-[#666666] text-base">+91 | {app.loginId?.slice(2)}</span>
                            </div>
                            <hr />
                            <div>
                                <span className="text-[#4328ae]">WhatsApp Number</span>
                                <br />
                                <span className="text-[#666666] text-base">
                                    +91 | {customerWhatsappNumber}
                                </span>
                            </div>
                            <hr />
                            <div>
                                <span className="text-[#4328ae]">Email Id</span>
                                <br />
                                <span className="text-[#666666] text-base">{emailId}</span>
                            </div>
                            <hr />
                            <div>
                                <span className="text-[#4328ae]">Address</span>
                                <br />
                                <span className="text-[#666666] text-base">{address}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
