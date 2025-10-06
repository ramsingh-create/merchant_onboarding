import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';

// Import your image
import supplierDetailIcon from '../../assets/images/supplierdetailicon.png';

const AddSupplier: React.FC = () => {
    const [supplierName, setSupplierName] = useState<string>('');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [gstNum, setGstNum] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alert, setAlert] = useState<boolean>(false);
    const [availableLimit, setAvailableLimit] = useState<string>('');
    const [borrowerId, setBorrowerId] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);

    // Validation rules
    const rules = {
        required: (value: string) => !!value || "Required.",
        mobile: (value: string) => {
            const pattern = /^(\+\d{1,3}[- ]?)?\d{10}$/gm;
            return pattern.test(value) || "Invalid Mobile number.";
        },
        repeatedNumbers: (value: string) => {
            const temp = value
                .split("")
                .filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                })
                .join("");
            return temp.length > 1 || "Invalid Mobile number.";
        },
        name: (value: string) => {
            const pattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
            return pattern.test(value) || "Invalid Name.";
        },
        email: (value: string) => {
            const pattern =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || "Invalid e-mail.";
        },
        gstin: (value: string) => {
            const pattern =
                /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
            return pattern.test(value) || "Invalid GSTIN.";
        },
    };

    useEffect(() => {
        dispatch(routeChange("end"));
        const queryParams = new URLSearchParams(window.location.search);
        setBorrowerId(queryParams.get('borrowerId') || '');
        setAvailableLimit(queryParams.get('availableLimit') || '');
    }, [dispatch]);

    // Validation functions
    const gstFormatValidation = (gst: string) => {
        const regpan = /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
        return regpan.test(gst);
    };

    const emailValidation = (email: string) => {
        const regpan = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regpan.test(email);
    };

    const nameValidation = (name: string) => {
        const regpan = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
        return regpan.test(name);
    };

    const removeDuplicateCharacters = (string: string) => {
        const temp = string
            .split("")
            .filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            })
            .join("");
        return temp.length;
    };

    const checkInitialLetter = (string: string) => {
        return parseInt(string.split("")[0]) > 4;
    };

    const handleSubmit = () => {
        if (supplierName.length > 1 && nameValidation(supplierName)) {
            if (gstNum && gstFormatValidation(gstNum)) {
                if (
                    phoneNo.length === 10 &&
                    removeDuplicateCharacters(phoneNo) > 1 &&
                    checkInitialLetter(phoneNo)
                ) {
                    if (email && emailValidation(email)) {
                        navigate({
                            pathname: "/BankDetails",
                            search: new URLSearchParams({
                                name: supplierName,
                                gst: gstNum,
                                phoneNo: phoneNo,
                                email: email,
                                borrowerId: borrowerId,
                                availableLimit: availableLimit,
                                applicationId: new URLSearchParams(window.location.search).get('applicationId') || '',
                            }).toString()
                        });
                    } else {
                        setAlertMessage("Please Enter Valid Email ID");
                        setAlert(true);
                    }
                } else {
                    setAlertMessage("Please Enter Valid Mobile Number");
                    setAlert(true);
                }
            } else {
                setAlertMessage("Please Enter Valid GST Number");
                setAlert(true);
            }
        } else {
            setAlertMessage("Please Enter Valid Supplier Name");
            setAlert(true);
        }
    };

    const handlePhoneChange = (value: string) => {
        if (value.length <= 10) {
            setPhoneNo(value);
        }
    };

    const handleGstChange = (value: string) => {
        setGstNum(value.toUpperCase());
    };

    return (
        <div className="max-w-[450px] text-left font-montserrat min-h-screen bg-white mx-auto">
            {/* Alert */}
            {alert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4 mt-4">
                    {alertMessage}
                </div>
            )}

            <div className="h-auto pb-12 mx-4 mt-5">
                {/* Header Section */}
                <div className="flex items-start mb-8">
                    <div className="w-1/4 flex justify-center">
                        <img
                            src={supplierDetailIcon}
                            alt="Supplier Details"
                            className="w-12 h-12"
                        />
                    </div>
                    <div className="w-3/4 pl-4">
                        <h1 className="text-base font-bold text-gray-900">
                            Add a supplier
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Please provide the details of the supplier
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="space-y-4">
                    {/* Supplier Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier Name
                        </label>
                        <input
                            type="text"
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                            placeholder="Enter supplier name"
                        />
                        {supplierName && !nameValidation(supplierName) && (
                            <p className="text-red-500 text-xs mt-1">Invalid Name</p>
                        )}
                    </div>

                    {/* GSTIN Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier GSTIN Number
                        </label>
                        <input
                            id="gstNumber"
                            type="text"
                            value={gstNum}
                            onChange={(e) => handleGstChange(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent uppercase"
                            placeholder="Enter GSTIN number"
                        />
                        {gstNum && !gstFormatValidation(gstNum) && (
                            <p className="text-red-500 text-xs mt-1">Invalid GSTIN</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier's Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNo}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            maxLength={10}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                            placeholder="Enter phone number"
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {phoneNo && (
                            <div className="space-y-1 mt-1">
                                {phoneNo.length !== 10 && (
                                    <p className="text-red-500 text-xs">Must be 10 digits</p>
                                )}
                                {removeDuplicateCharacters(phoneNo) <= 1 && (
                                    <p className="text-red-500 text-xs">Invalid mobile number</p>
                                )}
                                {!checkInitialLetter(phoneNo) && (
                                    <p className="text-red-500 text-xs">Invalid mobile number</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Supplier's Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4328AE] focus:border-transparent"
                            placeholder="Enter email address"
                        />
                        {email && !emailValidation(email) && (
                            <p className="text-red-500 text-xs mt-1">Invalid email address</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-1/2 bg-[#4328AE] text-white py-4 rounded-lg font-semibold hover:bg-purple-800 transition-colors mt-6"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSupplier;