import React, { useState, useMemo, useEffect } from "react";
import Slider from "rc-slider";
import LogoBlue from '../../assets/images/landinglogoblue.png';
import { ArrowLeft, Phone } from 'lucide-react';
import "rc-slider/assets/index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Calculator: React.FC = () => {
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);

    const minAmount = 100000;
    const maxAmount = 5000000;
    const minInterest = 1;
    const maxInterest = 30;
    const minYear = 1;
    const maxYear = 30;

    const [sliderAmount, setSliderAmount] = useState<number>(100000);
    const [sliderInterest, setSliderInterest] = useState<number>(10);
    const [sliderYear, setSliderYear] = useState<number>(1);

    const [iconAmountError, setIconAmountError] = useState(false);
    const [iconInterestError, setIconInterestError] = useState(false);
    const [iconYearError, setIconYearError] = useState(false);

    const monthlyInterestRate = useMemo(() => sliderInterest / (12 * 100), [sliderInterest]);
    const numberOfPayments = useMemo(() => sliderYear * 12, [sliderYear]);

    const principalAmount = sliderAmount;

    const monthlyEmi = useMemo(() => {
        const r = monthlyInterestRate;
        const n = numberOfPayments;
        return (
            (principalAmount * r * Math.pow(1 + r, n)) /
            (Math.pow(1 + r, n) - 1)
        );
    }, [principalAmount, monthlyInterestRate, numberOfPayments]);

    const totalAmount = monthlyEmi * numberOfPayments;
    const totalInterest = totalAmount - principalAmount;
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
        setSliderAmount(value);

        if (value >= minAmount && value <= maxAmount) {
            setIconAmountError(false);
            setSliderAmount(value);
        } else {
            setIconAmountError(true);
        }
    };

    const handleAmountSliderChange = (value: number | number[]) => {
        const num = typeof value === "number" ? value : value[0];
        setSliderAmount(num);

        if (num >= minAmount && num <= maxAmount) {
            setIconAmountError(false);
        } else {
            setIconAmountError(true);
        }
    };

    const handleInterestSliderChange = (value: number | number[]) => {
        const num = typeof value === "number" ? value : value[0];
        setSliderInterest(num);

        if (num >= minInterest && num <= maxInterest) {
            setIconInterestError(false);
        } else {
            setIconInterestError(true);
        }
    };

    const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9.]/g, "");
        value = value.indexOf(".") >= 0 ? value.slice(0, value.indexOf(".") + 3) : value;
        const num = parseFloat(value);
        setSliderInterest(num)
        if (num >= minInterest && num <= maxInterest) {
            setIconInterestError(false);
            setSliderInterest(num);
        } else {
            setIconInterestError(true);
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
        setSliderYear(value);
        if (value >= minYear && value <= maxYear) {
            setIconYearError(false);
            setSliderYear(value);
        } else {
            setIconYearError(true);
        }
    };

    const handleYearSliderChange = (value: number | number[]) => {
        const num = typeof value === "number" ? value : value[0];
        setSliderYear(num);
        if (num >= minYear && num <= maxYear) {
            setIconYearError(false);
        } else {
            setIconYearError(true);
        }       
    };


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

    return (
        <div className="max-w-[450px] font-montserrat bg-[#f2f0fb] min-h-screen mx-auto p-4">

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

            <div className="bg-white mt-4 p-6 rounded-2xl shadow-sm">
                <h2 className="text-[#4328ae] font-semibold text-lg mb-4">
                    EMI Calculator
                </h2>

                {/* Loan Amount */}
                <div className="mb-6">

                    <div className="flex justify-between items-center mt-2">

                        <label className="text-sm font-semibold text-gray-500">
                            Loan Amount
                        </label>
                        <div>
                            <span>₹</span>
                            <input
                                type="number"
                                value={sliderAmount}
                                onChange={handleAmountChange}
                                className={`text-right w-24 p-1 rounded text-sm font-bold ${iconAmountError ? "bg-red-100 text-red-600" : "bg-[#f2f0fb] text-gray-500"
                                    }`}
                            />
                        </div>

                    </div>
                    {iconAmountError && (
                        <div className="text-red-600 text-xs mt-1">Minimum value allowed is ₹${minAmount} and maximum is ₹{maxAmount}</div>
                    )}
                    <Slider
                        min={minAmount}
                        max={maxAmount}
                        step={5000}
                        value={sliderAmount}
                        onChange={handleAmountSliderChange}
                        trackStyle={{ backgroundColor: "#7E67DA", height: 5 }}
                        handleStyle={{ borderColor: "#7E67DA" }}
                    />
                </div>

                {/* Interest Rate */}
                <div className="mb-6">
                    
                    <div className="flex justify-between items-center mt-2">
                        <label className="text-sm font-semibold text-gray-500">
                            Rate of Interest (p.a)
                        </label>
                        <div>
                        <input
                            type="number"
                            value={sliderInterest}
                            step={0.1}
                            onChange={handleInterestChange}
                            className={`text-right w-16 p-1 rounded text-sm font-bold ${iconInterestError ? "bg-red-100 text-red-600" : "bg-[#f2f0fb] text-gray-500"
                                }`}
                        />
                        
                        <span>%</span>
                        </div>
                    </div>
                    {iconInterestError && (
                        <div className="text-red-600 text-xs mt-1">Interest must be between 1% and 30%</div>
                    )}
                    <Slider
                        min={minInterest}
                        max={20}
                        step={0.1}
                        value={sliderInterest}
                        onChange={handleInterestSliderChange}
                        trackStyle={{ backgroundColor: "#7E67DA", height: 5 }}
                        handleStyle={{ borderColor: "#7E67DA" }}
                    />
                </div>

                {/* Loan Tenure */}
                <div className="mb-6">
                    
                    <div className="flex justify-between items-center mt-2">
                        <label className="text-sm font-semibold text-gray-500">
                            Loan Tenure
                        </label>
                        <div>
                        <input
                            type="number"
                            value={sliderYear}
                            onChange={handleYearChange}
                            className={`text-right w-16 p-1 rounded text-sm font-bold ${iconYearError ? "bg-red-100 text-red-600" : "bg-[#f2f0fb] text-gray-500"
                                }`}
                        />
                       
                        <span>Yr</span>
                        </div>
                    </div>
                    {iconYearError && (
                        <div className="text-red-600 text-xs mt-1">Tenure must be between 1 and 30 years</div>
                    )}
                    <Slider
                        min={minYear}
                        max={30}
                        step={1}
                        value={sliderYear}
                        onChange={handleYearSliderChange}
                        trackStyle={{ backgroundColor: "#7E67DA", height: 5 }}
                        handleStyle={{ borderColor: "#7E67DA" }}
                    />
                </div>

                {/* Results */}
                {(!iconAmountError && !iconInterestError && !iconYearError) && <div className="bg-[#f2f0fb] p-4 rounded-lg">
                    <div className="flex justify-between text-sm font-semibold text-[#4328ae]">
                        <span>Monthly EMI</span>
                        <span className="text-gray-800">
                            ₹{Math.round(monthlyEmi).toLocaleString("hi-IN")}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#4328ae] mt-2">
                        <span>Principal Amount</span>
                        <span className="text-gray-800">
                            ₹{sliderAmount.toLocaleString("hi-IN")}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#4328ae] mt-2">
                        <span>Total Interest</span>
                        <span className="text-gray-800">
                            ₹{Math.round(totalInterest).toLocaleString("hi-IN")}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[#4328ae] mt-2">
                        <span>Total Amount</span>
                        <span className="text-gray-800">
                            ₹{Math.round(totalAmount).toLocaleString("hi-IN")}
                        </span>
                    </div>
                </div>}
            </div>
        </div>
    );
};

export default Calculator;
