import React, { useState, useMemo, useEffect } from "react";
import Slider from "rc-slider";
import LogoBlue from '../../assets/images/landinglogoblue.png';
import { ArrowLeft, Phone } from 'lucide-react';
import "rc-slider/assets/index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();
    const app = useSelector((state: RootState) => state.app);



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
        <div className="max-w-[450px] font-montserrat bg-white min-h-screen mx-auto p-4">

            <div className="flex justify-between items-center m-4 bg-white">
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

            <div className="p-6 text-justify max-w-4xl mx-auto">
                <div className="text-[16px]" style={{ color: "#4328ae" }}>
                    <b>PRIVACY POLICY</b>
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b>Last updated: </b>September 30, 2022
                </div>

                <div className="text-[12px] text-[#666666] mt-2">PLEASE READ THIS POLICY CAREFULLY BEFORE USING THE APP</div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We at GetClarity Fintech Services Private Limited (“our”, “us”, “we”,
                    “Company”, “Supermoney”), have developed the Supermoney mobile
                    application and website www.supermoney.in (individually and
                    collectively referred to as “App”). In order to provide you with the
                    Services, process your loan requests, and to ultimately provide a loan
                    to you, we (i.e., the Company) and our Lending Partners need to
                    collect various data and information from you. The manner in which
                    this data and information is collected, retained, shared, stored, and
                    processed us (i.e., the Company) and our Lending Partner is addressed
                    in this Supermoney Privacy Policy (“Policy”) offered by both. We may
                    revise this Policy as well as update the Services and the App from
                    time to time, so please keep visiting this page regularly to take
                    notice of any changes we make. If you do not agree with any part of
                    this Policy, please stop using our Services immediately.
                    <br />
                    <br />
                    This Policy, incorporates, and include our Terms and the User Loan
                    Agreement (as applicable). Words and phrases not defined in this
                    Policy shall mean the same as provided in the Terms.
                </div>

                <div className="text-[14px] mt-2" style={{ color: "#7e67da" }}>
                    <b>1. CONTACT INFORMATION</b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We and our Lending Partners have appointed a data grievance officer.
                    Our data grievance officer is: Mr. Akbar Shaikh, accessible via email
                    at: support@supermoney.in. You can contact the officer confidentially
                    by email to enquire about the treatment of your data by us or our
                    Lending Partners.
                </div>

                <div className="text-[14px] mt-2" style={{ color: "#7e67da" }}>
                    <b>2. WHAT DATA IS COLLECTED?</b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    By using the App, you consent to providing us and our Lending
                    Partners, data in the ways listed below. We collect the data you
                    provide to ensure that we can provide you Services in the best manner
                    possible. Our Lending Partners uses this data to underwrite (i.e.
                    assess the risk it will be taking) any loan it might offer you and to
                    determine the rates for such loans. The data being asked from you
                    helps us and our Lending Partners to provide services to you in a
                    robust and user-friendly manner. We have detailed the manner in which
                    we and our Lending Partners collect data below:
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>1.</div>
                        <div style={{ marginLeft: 5 }}>Data you input in the course of signing up and using our Services</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    Supermoney Account Data: We and our Lending Partners collect the data
                    you provide to us when you create or update your Supermoney Account.
                    This includes your name, phone number, email ID, PAN, date of birth,
                    pin code, nature of employment and name of employer, monthly income,
                    and marital status. We or our Lending Partners may require you to
                    share further information on a later date to confirm the veracity of
                    your information or pursuant to any additional features added to the
                    App.
                    <br />
                    <br />
                    How we use this data: See, For Enabling the App and its Services; For
                    Loan Processing and KYC Authentication; For Enabling Customer Support;
                    For Research and Development; For Enabling Communications Between You
                    and Us; For enabling Marketing and Outreach; For Automated Decisions;
                    For Legal Compliance and Requirements.
                    <br />
                    <br />
                    Financial and KYC Information: We and our Lending Partners collect the
                    data you provide to us when you accept the tentative terms of the
                    loans. This includes your photograph, Aadhaar Number, PAN, parent's
                    names, bank account number, IFSC, proof of address (which can be your
                    electricity bill, rental/lease agreement, gas bill, passport or
                    driver's license, or any other document our App may be able to
                    record).
                    <br />
                    <br />
                    Other Data Solicited: You may be required to provide further
                    information to the Lending Partners for the purposes of processing
                    your loan application. This data shall be supplied to the Lending
                    Partners through us.
                    <br />
                    <br />
                    How we use this data: See, For Enabling the App and its Services; For
                    Loan Processing and KYC Authentication; For Legal Compliance and
                    Requirements.
                    <br />
                    <br />
                    Feedback Data and Other Data: This includes the following:
                    <br />
                    <br />
                    <b>·</b> If you call our call centers, we may record information
                    provided by you to service you or record the calls for quality and
                    training purposes.
                    <br />
                    <br />
                    <b>·</b> Data you input when you participate in our referral programs
                    or use any discount codes offered by us.
                    <br />
                    <br />
                    <b>·</b> If you provide any feedback or comments to us on the App.
                    <br />
                    <br />
                    <b>·</b> How we use this data: See, For Enabling the App and its
                    Services; For Loan Processing and KYC Authentication; For Legal
                    Compliance and Requirements.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>2.</div>
                        <div style={{ marginLeft: 5 }}>Data we collect from your usage of our Services</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    <b>Geolocation data:</b> We and our Lending Partners collect the
                    location data from you in two ways: (i) when you add the pin code as
                    part of your Supermoney Account data; and (ii) from your mobile device
                    when enabled by you to do so.
                    <br />
                    <br />

                    <b>How we use this data:</b> See, For Enabling the App and its
                    Services; For Loan Processing KYC Authentication; For Enabling
                    Customer Support; For Enabling Marketing and Outreach; For Automated
                    Decisions; For Legal Compliance and Requirements.
                    <br />
                    <br />

                    <b>User Personal Information:</b> Our app collects user account data
                    which includes email address, name to log in to the app. This
                    information is required as part of the registration process to access
                    our service and it is also used to auto populate relevant fields in
                    the course of the interface of our app. Our app also collect mobile
                    numbers for verification to check the active SIM status on the device,
                    uniquely identify you and prevent fraud and unauthorized access.
                    <br />
                    <br />

                    <b>Transaction information:</b> We collect transaction information
                    related to the use of our Services, including the type of Services
                    requested, date and time the Service was provided, loan availed,
                    interest payable, EMI selected, and payment method. Additionally, if
                    someone uses your promotion code, we may associate your name with that
                    person and their usage of the App.
                    <br />
                    <br />

                    <b>How we use this data:</b> See, For Enabling the App and its
                    Services; For Loan Processing and KYC Authentication; For Enabling
                    Customer Support; For Research and Development; For Enabling
                    Communications Between You and Us; For Enabling Marketing and
                    Outreach; For Automated Decisions; For Legal Compliance and
                    Requirements.
                    <br />
                    <br />

                    <b>Storage: </b>This permission is required so that users' documents
                    can be securely downloaded and saved on users' phones and upload the
                    right documents for a faster approval and disbursal of the loan. This
                    helps provide a very smooth and seamless experience while using the
                    app.
                    <br />
                    <br />
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>3.</div>
                        <div style={{ marginLeft: 5 }}>Data we collect from your usage of our Services</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may also be working closely with third parties (including, for
                    example, sourcing partners, employers, technology platforms, credit
                    information bureaus, business partners, technical sub-contractors,
                    analytics providers, search information providers) and may lawfully
                    receive information about you from such sources. Such data may be
                    shared internally and combined with data collected on the App.
                    <br />
                    <br />

                    How we use this data: See, For Enabling the App and its Services; For
                    Loan Processing and KYC Authentication; For Enabling Customer Support;
                    For Research and Development; For Enabling Communications Between You
                    and Us; For enabling Marketing and Outreach; For Automated Decisions;
                    For Legal Compliance and Requirements.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>3.</div>
                        <div style={{ marginLeft: 5 }}>HOW AND WHY IS THE COLLECTED DATA USED?</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">The data that is collected in accordance with Section 2 above will be
                    used in the manner detailed below:</div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>1.</div>
                        <div style={{ marginLeft: 5 }}>For Enabling the App and its Services</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We use the data collected to personalize, maintain and improve our
                    Services. This includes using the data to:
                    <br />
                    <br />

                    <b>·</b> Create and update the Supermoney Account.
                    <br />
                    <br />

                    <b>·</b> Analyze your loan eligibility and estimate your loan
                    terms.
                    <br />
                    <br />

                    <b>·</b> Track the disbursement and repayment of the loan.
                    <br />
                    <br />

                    <b>·</b> Enable features that allow you to add and remove bank
                    accounts for your loan repayment and disbursements from time to
                    time.
                    <br />
                    <br />

                    <b>·</b> Enable features that help you check your loan history, credit
                    scores (as provide on government databases), and other such App
                    features as may be added from time to time.
                    <br />
                    <br />

                    <b>·</b> Perform internal operations necessary to provide our
                    Services, including to troubleshoot software bugs and operational
                    problems; to conduct data analysis, testing, and research; and to
                    monitor and analyze usage and activity trends.
                    <br />
                    <br />
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>2.</div>
                        <div style={{ marginLeft: 5 }}>For Loan Processing and KYC Authentication</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    Our Lending Partners use the data to analyze your creditworthiness,
                    loan eligibility, KYC documents, and the terms of your loans. While we
                    collect the Financial and KYC Information, the Lending Partners are
                    required to individually process the loan requests and verify the KYC
                    documentation received. Failing to process such data means that you
                    cannot be provided any loans.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>3.</div>
                        <div style={{ marginLeft: 5 }}>For Enabling Customer Support</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    Our Lending Partners use the data to analyze your creditworthiness,
                    loan eligibility, KYC documents, and the terms of your loans. While we
                    collect the Financial and KYC Information, the Lending Partners are
                    required to individually process the loan requests and verify the KYC
                    documentation received. Failing to process such data means that you
                    cannot be provided any loans.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>4.</div>
                        <div style={{ marginLeft: 5 }}>For Research and Development</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may use the data so collected for research, analysis, and product
                    development to improve the UI/UX experience, all of which will
                    ultimately improve how you experience the App. This also helps us
                    develop automated actions to be triggered in certain events, such as
                    when we need to identify if photographs uploaded are not clear, fraud
                    takes place, IFSC is incorrect etc.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>5.</div>
                        <div style={{ marginLeft: 5 }}>For Enabling Communications Between You and Us</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may add features that allow you to call us (through the App or
                    otherwise), similarly, we may also need to contact you (through the
                    App or any other channels that you give us access to, such as WhatsApp
                    or Facebook).
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>6.</div>
                        <div style={{ marginLeft: 5 }}>For Marketing and Outreach</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may use the data we collect to market the App and our Services.
                    This includes sharing your feedback, ratings and screen names for
                    purely promotion and marketing purposes. Such promotion and marketing
                    may be done via hoardings, banners, pamphlets etc.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>7.</div>
                        <div style={{ marginLeft: 5 }}>For Automated Decisions</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    The App may provide automated features for customer responses,
                    reimbursement tracking, etc. As our App grows, we will keep adding
                    more automated features to the App.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>8.</div>
                        <div style={{ marginLeft: 5 }}>For Enabling Customer Support</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may use the data we collect to investigate or address claims or
                    disputes relating to use of our Services, or as otherwise allowed by
                    applicable law, or as requested by regulators, government entities,
                    and official inquiries.
                </div>

                <div className="text-[14px] mt-6" style={{ color: "#7e67da" }}>
                    <b style={{ display: "flex" }}>
                        <div>4.</div>
                        <div style={{ marginLeft: 5 }}>HOW DO WE SHARE THE COLLECTED INFORMATION?</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We are very protective about your data. We may enter into data-sharing
                    agreements or disclose the collected data in order to provide the
                    Services to you. We have detailed the manner in which we and the
                    Lending Partners share the collected data below:
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>1.</div>
                        <div style={{ marginLeft: 5 }}>Sharing with third parties</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    <b>Service Providers:</b> We work with third party service providers
                    to execute various functionalities of the App and we may share your
                    information with such service providers to help us provide the App.
                    Some of these functionalities may include:
                    <br />
                    <br />

                    <b>·</b> Validating and authenticating the official verification
                    documents provided by you.
                    <br />
                    <br />

                    <b>·</b> Validating your preferred bank account, as well as
                    transferring the loan amounts to you.
                    <br />
                    <br />

                    <b>·</b> E-signing of the User Loan Agreement, populating the User
                    Loan Agreement. The information shared with these service providers is
                    retained for auditing of the agreements.
                    <br />
                    <br />

                    <b>·</b> eNACH set-up to enable autopay.
                    <br />
                    <br />

                    <b>·</b> Analyzing customer behaviour and to automate our marketing
                    and outreach efforts.
                    <br />
                    <br />

                    <b>·</b> Detection and flagging of fraud.
                    <br />
                    <br />

                    <b>·</b> Cloud services.
                    <br />
                    <br />

                    <b>·</b> Gathering of additional information regarding your bank
                    account and statement details, in case adequate information has not
                    been provided by you or through the other service providers we work
                    with.
                    <br />
                    <br />

                    <b>·</b> For manually collecting any sums owed by you to our Lending
                    Partners.
                    <br />
                    <br />

                    <b>Third Party Services:</b> The App may allow you to connect with
                    other websites, products, or services that we don't have control over
                    (for example, if we allow you to pay through an external wallet
                    facility then we will have to share your usage information with the
                    facility provider). However, usage of such third-party services is
                    subject to their privacy policies and not within our control. We
                    recommend that you have a look at their privacy policies before
                    agreeing to use their services.
                    <br />
                    <br />

                    Our application has a link to a registered third party We ensure that
                    our third party service providers take security measures in order to
                    protect your personal information against loss, misuse or alteration
                    of the data.
                    <br />
                    <br />

                    Our third-party service providers employ separation of environments
                    and segregation of duties and has strict role-based access control on
                    a documented, authorized, need-to-use basis. The stored data is
                    protected and stored by application-level encryption. They enforce key
                    management services to limit access to data.
                    <br />
                    <br />

                    Furthermore, our registered third party service providers provide
                    hosting security. They use industry-leading anti-virus, anti-malware,
                    intrusion prevention systems, intrusion detection systems, file
                    integrity monitoring, and application control solutions.
                    <br />
                    <br />

                    <b>Change in Control: </b>While negotiating or in relation to a change
                    of corporate control such as a restructuring, merger or sale of our
                    assets, we may have to disclose our databases and information we have
                    stored in the course of our operations.
                    <br />
                    <br />
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>2.</div>
                        <div style={{ marginLeft: 5 }}>Sharing with law enforcement when needed</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    If any governmental authority or law enforcement officers request or
                    require any information and we think disclosure is required or
                    appropriate in order to comply with laws, regulations, or a legal
                    process.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>5.</div>
                        <div style={{ marginLeft: 5 }}>WHAT ARE YOUR RIGHTS REGARDING THE DATA?</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    It is important for us that you remain in control of your data. Please
                    write to us at support@supermoney.in if you wish to exercise any of
                    your rights under the Policy. You shall have the following rights:
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>1.</div>
                        <div style={{ marginLeft: 5 }}>Right to rectification</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    In the event that any personal data provided by you is inaccurate,
                    incomplete or outdated then you shall have the right to provide us
                    with the accurate, complete and up to date data and have us rectify
                    such data at our end immediately. We urge you to ensure that you
                    always provide us with accurate and correct information/data to ensure
                    your use of our Services is uninterrupted.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>2.</div>
                        <div style={{ marginLeft: 5 }}>Right to withdraw consent</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    You have the right to withdraw your consent to this policy by
                    uninstalling the App. However, if you have availed any loans from our
                    Lending Partners, we shall have the right continue processing your
                    information till such loan has been repaid in full, along with any
                    interest and dues payable.
                    <br />
                    <br />

                    However, we shall not retain your data and information if it is no
                    longer required by us and there is no legal requirement to retain the
                    same. Do note that multiple legal bases may exist in parallel and we
                    may still have to retain certain data and information at any time.
                </div>

                <div className="text-[14px] text-[#666666] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>1.</div>
                        <div style={{ marginLeft: 5 }}>Right to opt-out</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    <b>Marketing opt-outs:</b> We may email and notify you from time to
                    time about our latest offerings and updates. You may opt out of
                    receiving such promotional emails from us by writing to us. You may
                    also opt out of receiving emails and other messages from us by
                    following the unsubscribe instructions in those messages. However,
                    even if you have opted out of receiving information from us, we will
                    still send non-promotional communications, such as receipts for amount
                    remittance etc.
                    <br />
                    <br />

                    <b>Push Notifications:</b> You can opt out of receiving push
                    notifications through your device settings. Please note that opting
                    out of receiving push notifications may impact your use of the App.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>6.</div>
                        <div style={{ marginLeft: 5 }}>WHAT IS OUR DATA SECURITY PRACTICE?</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    By setting up a Supermoney Account, you agree to our and the Lending
                    Partners processing, storage, usage, and sharing of the data provided
                    by you pursuant to this Policy. If you do not agree with any of the
                    terms of this Policy or the Terms or wish to revoke any consent you
                    have provided to us and/or the Lending Partners, please write to us at 
                    <u style={{ color: "#7e67da" }}> support@supermoney.in</u>. However, please
                    note that if you revoke any mandatory permissions or revoke the
                    consent to process and store information such as your Supermoney
                    Account data, Financial and KYC Information and/or any other
                    information needed to facilitate your loan amounts, then we may have
                    to cease the provision of Services to you. You cannot withdraw your
                    consent once you have availed a loan using the App till you have
                    repaid the loan amount and all related charges in its entirety.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>7.</div>
                        <div style={{ marginLeft: 5 }}>CONSENT MECHANISM</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    By setting up a Supermoney Account, you agree to our and the Lending
                    Partners processing, storage, usage, and sharing of the data provided
                    by you pursuant to this Policy. If you do not agree with any of the
                    terms of this Policy or the Terms or wish to revoke any consent you
                    have provided to us and/or the Lending Partners, please write to us at 
                    <u style={{ color: "#7e67da" }}> support@supermoney.in</u>. However, please
                    note that if you revoke any mandatory permissions or revoke the
                    consent to process and store information such as your Supermoney
                    Account data, Financial and KYC Information and/or any other
                    information needed to facilitate your loan amounts, then we may have
                    to cease the provision of Services to you. You cannot withdraw your
                    consent once you have availed a loan using the App till you have
                    repaid the loan amount and all related charges in its entirety.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>8.</div>
                        <div style={{ marginLeft: 5 }}>DATA RETENTION</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We shall retain the information you provide to facilitate your smooth
                    and uninterrupted use of the App, and (i) to provide, improve and
                    personalize our Services; (ii) to contact you about your account and
                    give customer service; (iii) to personalize our advertising and
                    marketing communications; and (iv) to prevent, detect, mitigate, and
                    investigate fraudulent or illegal activities. We do not retain your
                    personal data for longer than required for the purpose for which the
                    information may be lawfully used. For any other information, we may
                    entertain your request for deletion, however, you may not be able to
                    use our Services at all after such deletion.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>9.</div>
                        <div style={{ marginLeft: 5 }}>DATA RETENTION</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    Our Services are not directed to children, and we do not knowingly
                    solicit or collect personal information from persons under the age of
                    18 (eighteen). If we find out that a child has given us personal
                    information, we will take steps to delete that information and
                    terminate the relevant Supermoney Account.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>10.</div>
                        <div style={{ marginLeft: 5 }}>COMMUNICATIONS FROM US</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may from time to time send you Service-related announcements when
                    we consider it necessary to do so (such as when we temporarily suspend
                    the App for maintenance, or security, privacy, or
                    administrative-related communications). We send these to you via
                    SMS/push notifications/email/instant messaging, as we deem fit.
                </div>

                <div className="text-[14px] text-[#7e67da] mt-2">
                    <b style={{ display: "flex" }}>
                        <div>11.</div>
                        <div style={{ marginLeft: 5 }}>UPDATES TO THIS NOTICE</div>
                    </b>
                </div>

                <div className="text-[12px] text-[#666666] mt-2">
                    We may occasionally update this Policy. Use of our Services after an
                    update constitutes consent to the updated notice to the extent
                    permitted by law. Please take the time to periodically review this
                    Policy for the latest information on our privacy practices.
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
