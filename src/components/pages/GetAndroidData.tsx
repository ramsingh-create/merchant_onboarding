import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setApplicationId, setAuthToken, setCompanyName, setCustomerID, setLoginId, setOnboardingName, setProfileID, setTabSelected } from '../../store/appSlice';
import axiosInstance from '../../utils/axiosInstance';


const GetAndroidData: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(setLoginId(searchParams.get('loginId') || ''));
        dispatch(setAuthToken(searchParams.get('authToken') || ''));
        dispatch(setCustomerID(searchParams.get('customerId') || ''));
        dispatch(setProfileID(searchParams.get('profileId') || ''));
        dispatch(setApplicationId(searchParams.get('applicationId') || ''));
        dispatch(setOnboardingName(searchParams.get('onboardingPartner') || ''));
        dispatch(setCompanyName(searchParams.get('company') || ''));
        dispatch(setTabSelected("0"))

        axiosInstance.defaults.headers.common["Authorization"] =
            "Bearer " + searchParams.get('authToken');

        navigate('/UpFrontLanding')
    })

    return (
        <div className="max-w-[450px] text-left font-['Montserrat'] min-h-screen bg-white mx-auto">
        </div>
    );
};

export default GetAndroidData;