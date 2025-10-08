import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { routeChange } from '../../store/appSlice';

// Import your images
import invoiceSuccessBg from '../../assets/images/invicesuccessbg.png';
import invoiceSuccessDocument from '../../assets/images/invoicesuccessdocument.png';
import invoiceSuccessMan from '../../assets/images/invoicesuccessman.png';

const InvoiceSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const app = useSelector((state: RootState) => state.app);

    useEffect(() => {
        dispatch(routeChange("end"));
    }, [dispatch]);

    const routeDashboard = () => {
        navigate("/UpFrontLanding");
    };

    return (
        <div className="max-w-[450px] text-left font-montserrat h-screen bg-[#311b92] mx-auto relative overflow-hidden">
            {/* Background Image */}
            <img
                src={invoiceSuccessBg}
                alt="Background"
                className="w-full h-full object-cover"
            />

            {/* Success Card */}
            <div className="absolute top-20 left-7 right-[100px] bg-[#5e45c1] rounded-xl p-8 pb-15 border border-black">
                <div className="flex items-start mb-6">
                    <div className="w-1/3 flex justify-center">
                        <img
                            src={invoiceSuccessDocument}
                            alt="Success Document"
                            className="w-16 h-16"
                        />
                    </div>
                    <div className="w-2/3 pl-4">
                        <h1 className="text-xl text-white font-bold leading-tight">
                            Invoice<br />
                            Submitted!
                        </h1>
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-white text-sm leading-relaxed mb-8 mx-3.5">
                    Great! Your invoice has been received. Invoice payment will be made in 1
                    working day.
                </div>

                {/* Add More Invoice Section */}
                <div className="text-white font-bold text-base mb-2 mx-3.5">
                    Add More Invoice!
                </div>
                <div className="text-white text-sm leading-relaxed mb-6 mx-3.5">
                    Visit Dashboard to add more invoice or view currently uploaded invoice
                </div>

                {/* Action Button */}
                <button
                    onClick={routeDashboard}
                    className="bg-white text-[#4328ae] font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors mx-3.5 w-[150px]"
                >
                    Okay! Got it.
                </button>
            </div>

            {/* Floating Man Image */}
            <img
                alt="Man"
                src={invoiceSuccessMan}
                className="absolute w-26 h-auto right-2 top-60"
            />
        </div>
    );
};

export default InvoiceSuccess;