import React, { useState, useEffect } from 'react';
import SupermoneyLogoW from "../../assets/images/SupermoneyLogoW.png";
import getcash from "../../assets/images/getcash.png";
import tandclogo from "../../assets/images/tandclogo.png";
import { CircleX, TriangleAlert } from 'lucide-react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  routeChange, 
  setAuthToken, 
  setLoginId, 
  setCustomerID, 
  setApplicationId,
  setCompanyName,
  setOnboardingName
} from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';

export const LoginWithPin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state: RootState) => state.app);

  // State variables
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [tandcSheet, setTandcSheet] = useState(false);
  const [tandc, setTandc] = useState(true);
  const [mobileNumberDisabled, setMobileNumberDisabled] = useState(false);
  const [mobno, setMobno] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // const [isFocused, setIsFocused] = useState(false);
  const [isFocused, setIsFocused] = useState<{
  mobno: boolean;
  pinno: boolean;
}>({
  mobno: false,
  pinno: false,
});
  const [isTouched, setIsTouched] = useState(false);

  
  const max = 4;
  const maxs = 10;
  
  const disclaimer = `<html><head></head><body><p><strong>SUPERMONEY TERMS OF USE</strong></p><p><strong>Last updated: </strong>June 12, 2023</p><p>We at GetClarity Fintech Services Private Limited (<strong>our</strong> , <strong>us</strong> , <strong>we</strong> , <strong>Company</strong> , <strong>SuperMoney</strong> ) have developed the SuperMoney mobile application and website <a href="http://www.supermoney.in" target="_blank" rel="noopener">www.supermoney.in</a> (individually and collectively referred to as <strong>App</strong> ) and are happy to have you with us. Please read these terms of use ( <strong>Terms</strong> ) carefully before you use the App since they constitute the agreement between you, us and the RBI regulated lending entities, (our <strong>Lending Partner</strong> ). If you have any queries or concerns regarding these Terms, please contact our Grievance Officer.</p><p>These Terms incorporate the following documents (including all their variants and updates) by reference: (i) SuperMoney Privacy Policy; and (ii) User Loan Agreement (if you avail a loan using the App). By accessing or using our Services (as defined below), you agree to be bound by these Terms and to the collection and use of your information as set forth in the SuperMoney Privacy Policy.</p><p>We may revise these Terms as well as update the App and Services from time to time, so please keep visiting this page regularly. If you do not agree with any part of these Terms, please stop using the App immediately. We also encourage you to contact our Grievance Officer to discuss your disagreements.</p><p> </p><p><strong>1. SCOPE OF SERVICES</strong></p><ol><li>Eligibility: You may use our Services only if you are legally permitted to do so under applicable laws. If we discover that any person using our Services is not capable of entering into a legally binding contract, then we may immediately terminate their account. Do note that if you avail a loan through the App, the terms of the loan will be governed by the User Loan Agreement.</li><li>What you get from us: SuperMoney allows you to acquire a loan from our Lending Partners in a seamless and paperless manner. SuperMoney may provide a combination of the following facilities to our users ( <strong>Services</strong> ): (i) enabling you to avail loans (limited to INR 3,00,00,000 (Rupees Three Crores)); (ii) personal credit management; and (iii) Mutual Fund investments. We may add or subtract from the Services we are providing from time to time.</li><li>Signing up to use our Services: In order to use the App, you must create a profile ( <strong>SuperMoney Account</strong> ) with us through the App. To create a SuperMoney Account, you must provide us your phone number, which we will authenticate with a one-time password. You must also permit us to gain access to your profile details and location data, as we may require to provide our Services to you. You have to provide us with the following details:<ol><li>your name as provided in your PAN Card;</li><li>email ID;</li><li>date of birth;</li><li>marital status;</li><li>residential details;</li><li>employment type and place of work;</li><li>PAN.</li></ol></li></ol><p> </p><p>You should add the information and documents requested in the manner prompted on the App. If you revoke any of our permissions in the App, then you will not be able to use the App. You authorize us and our Lending Partners to access your credit information from various credit information companies (such as Experian, EQUIFAX, CIBIL etc.). </p><p>The SuperMoney Privacy Policy details the nature and type of information we collect and process (either for ourselves or on instructions and on behalf of our Lending Partners) to enable the setting up of a SuperMoney Account, completing the KYC processes or to provide such information to our Lending Partners as they may need to process your loan. If the information provided by you does not, in our sole discretion, amount to reliable information or appears to be fraudulent, then we will not allow you to open a SuperMoney Account and you shall not be eligible to apply for a loan using the App. If we discover any deficiency in the information provided by you on a later date, then we may terminate your SuperMoney Account. Please note that we may add further verification procedures in the future, whereby you may be required to provide us with more information.</p><p><strong> </strong></p><p><strong>2. LOAN PROCESS - HOW IT WORKS</strong></p><p>Your loan is going to be sanctioned by our Lending Partners and be governed by the User Loan Agreement. The details of such loan, however, shall be shown on the App.</p><ol><li>Once your SuperMoney Account has been set up, then basis the information you provide us and the information we collect from your device (both, as detailed in the SuperMoney Privacy Policy), we will inform you of the maximum amount you are eligible to borrow from our Lending Partners. Basis this, you may decide the loan amount you wish to apply for and the monthly instalments you are willing to pay. Once you input these parameters, we will suggest the likely term of the loan and interest rates you are likely to be charged by our Lending Partners. Our Lending Partners take the decision on whether to loan you any amounts or not, and the terms of such loan.</li><li>Once these parameters have been provided and you decide to move forward with availing a loan from our Lending Partners, you will be required to undertake a Know-your-Customer (KYC) process with us. The KYC process must satisfy our Lending Partners. Our Lending Partners may further ask for any documents and information it would require to comply with its internal processes, in order to sanction your loan.</li><li>Once you accept the proposed loan terms and clear the KYC process to the satisfaction of our Lending Partners, we will direct you to a User Loan Agreement to be executed between you and our Lending Partners.</li><li>You will be required to issue appropriate auto-debit instructions for your bank account to repay the loan amount, prior to disbursal. These cannot be changed or cancelled during the term of the loan. The App will display the details of the EMI, including the due date and amount payable, as well as whether your payment was received or not, from time to time. Our Lending Partners shall directly transfer the loan amounts to the bank account of your choice. Prior to making this transfer, however, our Lending Partners may need to verify the bank account.</li><li>Please note that you are not permitted to remove the App from your mobile device until the loan has been repaid. In case you are compelled to remove the App from your mobile device, please write to us at <a href="mailto:support@Supermoney.in" target="_blank" rel="noopener">support@Supermoney.in</a> immediately. Any violation of this clause 2(vi) shall tantamount to fraud and we may initiate legal proceedings against you.</li></ol><p> </p><p><strong>3. PRIVACY OF DATA</strong></p><p>The <a href="https://www.supermoney.in/PrivacyPolicies.html" target="_blank" rel="noopener">SuperMoney Privacy Policy </a>provides the manner in which we and our Lending Partner store, process, collect, use and share the data that is collected from you. Please read it so you know your rights in this regard.</p><p> </p><p><strong>4. YOUR OBLIGATIONS</strong></p><ol><li>Duty to provide true information: The information you provide is used by us and our Lending Partners to determine your eligibility for any loan and approve and dispense the loan to you. It is critical that all information you provide to us is true, complete, not misleading and is regularly updated by you. If all or any part of this information is incorrect, incomplete or misleading, it would be a breach of these Terms and a violation of the law. We may approach the police and other appropriate authorities to initiate action against you. You must further ensure that you do not do anything that can make the information provided by you incorrect, incomplete or misleading at a later date. If you discover any information provided is incorrect, incomplete or misleading, then please write to our Grievance Officer immediately.</li><li>Duty to be responsible: Considering the nature of the App and Services provided, please ensure that you keep your mobile device safe. You are solely responsible for all activities that occur under your credentials on the App and any amounts debited or credited to your bank account. You should keep your password/PIN safe and not disclose your SuperMoney Account details to any third party or share the account with any third party. If you think someone has gained access to your SuperMoney Account, please contact our Grievance Officer immediately and undertake such other activities as may be provided in your User Loan Agreement.</li><li>Obligation to indemnify: To the extent permitted under applicable law, you agree, to indemnify us (i.e., the Company), our affiliates, directors, agents, and employees from and against all complaints, demands, claims, damages, losses, costs, liabilities and expenses, including attorney s fees, due to, arising out of or relating in any way to (i) your access to or use of the App and/or Services; (ii) your breach of these Terms, (iii) your breach of any applicable laws or third-party rights.</li><li>Ensure compatibility and keep updated: You must ensure that you keep updating the App as and when we release new versions of it. Failure to do so may make you incapable of using the App. You should also ensure that you are able to use the App with your preferred bank account.</li></ol><p> </p><p><strong>5. RESTRICTIONS ON YOU</strong></p><ol><li>No scaling or jeopardizing our platform: You agree to not interfere with or use non-public areas of our App and our technical delivery system. You will not introduce any trojans, viruses, any other malicious software, any bots or scrape our App for any user information. Additionally, you will not probe, scan, or test the vulnerability of any system, security or authentication measures implemented by us. If you tamper or attempt to tamper with our technological design and architecture, we may terminate your SuperMoney Account. We may further report such actions to the appropriate law enforcement authorities and initiate legal actions.</li><li>No commercial usage: You shall use the Services only for your lawful and personal use. You will not use our Services to acquire loans for the purposes of forward-lending the amounts loaned to you. You will not use SuperMoney to grant loans or forwarded services to any third party.</li><li>No illegal usage: You shall not use the Platform or the Services for committing fraud, embezzlement, money laundering or for any other unlawful and/or illegal purposes.</li><li>Maintenance of bank accounts: You shall not do any action that may jeopardize the SuperMoney Account or in any way frustrate the repayment of the loan amounts as may be disbursed to you.</li></ol><p> </p><p><strong>6. INTELLECTUAL PROPERTY</strong></p><ol><li>All of the content on the App, including, all images, illustrations, graphics, video clips, text, reports generated, trademarks, as well as the underlying code of the App ( <strong>App Content</strong> ), constitutes our intellectual property.</li><li>We give you a limited, non-transferrable, non-sublicensable and revocable license to access the App, avail of the features of the App for your personal, lawful requirements only. You are not entitled to duplicate, distribute, create derivative works of, display, or commercially exploit the App Content, features or facilities, directly or indirectly, without our prior written permission.</li></ol><p> </p><p><strong>7. REGULATORY CHANGES</strong></p><p>Regulation around technology companies such as ours is ever changing. You understand that the Company may have to modify the Services as well as the App on account of the regulatory landscape we are subject to. In such case, if you become incapable of using all or any part the App or the Services, the same shall not be our fault.</p><p> </p><p><strong>8. THIRD PARTY LIABILITY</strong></p><p>In providing the Services to you, we will need to use third-party services. This is done to facilitate checking your KYC and credit score, facilitating payment to and from you and other practical and functional purposes in order to enhance the Services we provide you. While we have appropriate agreements in place with these third parties, we do not accept any liabilities that may arise from our use of or reliance on such third-party services. Further, it may so happen that you are unable to link your bank account with the App whether to credit or debit the loan amounts - in which case, we will not be liable for any damages or losses suffered by you.</p><p> </p><p><strong>9. THIRD PARTY CONTENT AND ADVERTISEMENTS</strong></p><p>We may, from time to time, display offers and advertisements from third parties on our App for your benefit. However, this does not mean we endorse these third parties. If you accept any of the services of such third parties, such arrangement shall be solely between you and the third party, you should avail of such services only after you have read their terms of use and privacy policies.</p><p> </p><p><strong>10. ANCILLARY SERVICES:</strong></p><p>You may get access to chat rooms, blogs, feedbacks, reviews and other features ( Ancillary Services ) that are/may be offered from time to time on the App and may be operated by us or by a third party on our behalf. You shall not (nor cause any third party to) use these Ancillary Services to perform any illegal activities (including without limitation defaming, abusing, harassing, stalking, threatening, promoting racism, or otherwise violating the legal rights, such as rights of privacy, of others) or immoral activities, falsely stating or otherwise misrepresenting your affiliation with a person or entity.</p><p>Additionally, the App may contain advice/opinions and statements of various professionals/ experts/ analysts, etc. the Company does not endorse the accuracy, reliability of any such advices/opinions/ and statements. You may rely on these, at your sole risk and cost. You shall be responsible for independently verifying and evaluating the accuracy, completeness, reliability and usefulness of any opinions, services, statements or other information provided on the App. All information or details provided on the App shall not be interpreted or relied upon as legal, accounting, tax, financial, investment or other professional advice, or as advice on specific facts or matters. The Company may, at its discretion, update, edit, alter and/or remove any information in whole or in part that may be available on the App and shall not be responsible or liable for any subsequent action or claim, resulting in any loss, damage and or liability. Nothing contained herein is to be construed as a recommendation to use any product or process, and the Company makes no representation or warranty, express or implied that, the use thereof will not infringe any patent, or otherwise.</p><p> </p><p><strong>11. USER COMMUNICATIONS:</strong></p><p>Accepting these Terms, implies your express consent to be contacted by us, our agents, representatives, affiliates, or anyone calling on our behalf at any contact number, or electronic address provided by You while applying for the Service. You further agree that English and such other vernacular language in which we communicate with you is understood by you. You further agree to us contacting You in any manner, including without limitation, SMS messages (including text messages), Whatsapp messages, calls using pre-recorded messages or artificial voice, calls and messages delivered using auto telephone dialling system or an automatic texting system, and notifications sent via the App. Automated messages may be played when the telephone is answered, whether by You or someone else. In the event that an agent or representative calls, he or she may also leave a message on your answering machine, voice mail, or send one via SMS.</p><p>You certify, warrant and represent that the telephone numbers and/or email addresses and any other information that You have provided to us are your own and not someone else\'s and are true, accurate, current and complete. You represent that You are permitted to receive calls at each of the telephone numbers You have provided to us and emails at each of the email addresses You have provided us. You agree to notify us whenever You stop using a particular telephone number(s) and/or email address(es)</p><p> </p><p><strong>12. DISCLAIMERS AND LIMITATIONS</strong></p><p>SuperMoney only helps you gain access to loans, i.e., we are only a facilitator. You are contracting a service directly with our Lending Partners. We accept no responsibility for the provision of loans or its consequences. Our responsibility is limited to connecting you to the Lending Partners, displaying your loan eligibility and the terms of your loans. We accept no responsibility for the terms that we communicate to you in good faith. We are not liable for any losses that may occur as a result of the acts or omissions of the Lending Partners. We do not accept responsibility for any amounts transferred to your bank account or any remittance to your account that has failed. However, we shall undertake all reasonable steps to ensure such actions do not take place.</p><p>The App and Services are provided on an as is basis without any representation or warranties, express or implied except otherwise specified in writing. We do not warrant the quality of the Services or the App, including its uninterrupted, timely, secure or error-free provision, continued compatibility on any device, or correction of any errors. In no event shall we or any of our affiliates, successors, and assigns, and each of their respective investors, directors, officers, employees or agents be liable for any special, incidental, punitive, direct, indirect or consequential damages or losses suffered as a consequence of a breach of the Terms by another user or arising out of the use of or the reliance on any of the Services or the App.</p><p>Availing loans carries a risk and you should speak with your trusted advisors and/or financial consultant before availing any debt of any kind, whether from SuperMoney or not.</p><p>In the event any exclusion contained herein is held to be invalid for any reason and we or any of our affiliate entities, officers, directors or employees become liable for loss or damage, then, any such liability shall be limited to the loan amount availed by you.</p><p> </p><p><strong>13. TERMINATION</strong></p><p>If we decide to terminate your SuperMoney Account for any reason, we will inform you of such decision on the App or by email. However, this will not extinguish your obligations under the User Loan Agreement (if any), and you will continue to repay the loaned amounts as provided in the agreement. We will not be liable for any losses or damages that you may suffer from such termination of your SuperMoney Account.</p><p> </p><p><strong>14. OPT-OUT REQUEST</strong></p><p>Users who have availed a loan facilitated by SuperMoney may not, prior to the loan being repaid in full, either uninstall the App or deactivate their SuperMoney Account. Such users may further note, that in the event you either delete the App and/or deactivate your account, at any point prior to the full repayment of your loan, such an act will not extinguish your responsibilities under the User Loan Agreement and all loan amount due must be paid as per the terms of the User Loan Agreement.</p><p>In case any other user (i.e. any user who either hasn t availed a loan using SuperMoney or has repaid in full any and all loans availed through SuperMoney), does not want to continue using our App and the Services and/or wants to deactivate their SuperMoney Account, and/or unsubscribe from the mailing lists, they may do so by contacting us at support@Supermoney.in.</p><p> </p><p><strong>15. GRIEVANCE OFFICER</strong></p><p>In order to address any questions or grievances that you may have regarding the use of App or Services, please contact our grievance officer ( <strong>Grievance Officer</strong> ) in the following manner:</p><p>Name: Ritesh Mishra<br>Email: <a href="mailto:support@supermoney.in" target="_blank" rel="noopener">support@supermoney.in</a><br><br></p><p> </p><p><strong>16. FORCE MAJEURE</strong></p><p>Without limiting the foregoing, under no circumstances shall the Company be held liable for any damage, loss, loss of services of App, due to deficiency in provision of the Services resulting directly or indirectly from acts of nature, forces, or causes beyond its reasonable control, including, without limitation, internet failures, computer equipment failures, telecommunication equipment failures, or any other government regulations, floods, storms, electrical failure, civil disturbances, riots.</p><p> </p><p><strong>17. GENERAL PROVISIONS</strong></p><ol><li>Notification: We shall notify you of any relevant information pertaining to your use of the Services by push notification on the App, SMS, instant messaging services or email. You may reach out to us via email at support@supermoney.in.</li><li>Disputes: These Terms and any action related thereto will be governed by the laws of India. Any disputes arising out of or related to the Terms, the App, or the Services (collectively, <strong>Dispute(s)</strong> ) shall be subject to the jurisdiction of the courts located in Mumbai, Maharashtra.</li><li>Assignment: You shall not assign or transfer any right or obligation that has accrued to you under these Terms, and any attempt by you to assign or transfer such rights and obligations, shall be null and void. We may assign or transfer any right or obligations that accrued in our favour, at our sole discretion, without any restriction.</li><li>Waiver: Unless otherwise stated expressly, any delay or failure in our exercising any rights/remedies arising out of these Terms and/or other policies available on the App, shall not constitute a waiver of rights or remedies and no single/partial exercise of any rights or remedies, hereunder, shall prevent any further exercise of the rights/remedies by us.</li><li>Survival: You acknowledge that your representations, undertakings, and warranties and the clauses relating to indemnities, limitation of liability, repayment of loan, governing law & arbitration and these general provisions shall survive the efflux of time and the termination of these Terms.</li><li>Severability: If any provision of these Terms is held illegal or unenforceable, the validity, legality and enforceability of the remaining provisions contained herein shall not in any way be affected or impaired thereby. Any such provision held invalid, illegal or unenforceable shall be substituted by a provision of similar import reflecting the original intent of the parties to the extent permissible under applicable laws.</li></ol><p> </p></body></html>`;
  const cleanedContent = disclaimer
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/<ol>/g, '<ol style="padding-left: 20px; list-style-type: decimal;">')
      .replace(/<li>/g, '<li style="margin-bottom: 8px;">');

  // Validation rules
  const rules = {
    required: (value: string) => !!value || "Required.",
    mobile: (value: string) => {
      const pattern = /^\(?([5-9]{1})\)?([0-9]{9})$/;
      return pattern.test(value) || "Invalid Mobile number.";
    },
    repeatedNumbers: (value: string) => {
      let temp = value
        .split("")
        .filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        })
        .join("");
      return temp.length > 1 || "Invalid Mobile number.";
    },
  };

  // Mobile number input handler
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobno(value);
  };

  // PIN input handler
  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setLoginPin(value);
  };

  // Terms & Conditions handlers
  const acceptTandC = () => {
    setTandcSheet(false);
  };

  const ontandcChange = () => {
    if (tandc) {
      setTandcSheet(true);
    }
  };

  // Validation helpers
  const removeDuplicateCharacters = (string: string) => {
    let temp = string
      .split("")
      .filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      })
      .join("");
    return temp.length;
  };

  const checkInitialLetter = (string: string) => {
    return parseInt(string.split("")[0]) > 4 ? true : false;
  };

  // Login function
  const loginByPin = () => {
    if (
      mobno !== "" &&
      loginPin !== "" &&
      removeDuplicateCharacters(mobno) > 1 &&
      checkInitialLetter(mobno)
    ) {
      dispatch(routeChange('start'));

      const data = {
        userName: "+91" + mobno,
        password: loginPin,
      };

      const options = {
        successCallBack: (res: any) => {
          console.log(res);
          
          // Set authorization header and store data
          dispatch(setAuthToken(res.token));
          dispatch(setLoginId(res.user.userName));
          dispatch(setCustomerID(res.user.customerId));
          
          // Check if there's a request ID in URL and proceed accordingly
          const urlParams = new URLSearchParams(window.location.search);
          const requestID = urlParams.get('requestID');
          
          if (requestID) {
            getProgramDetails(requestID);
          } else {
            fetchApplicationId();
          }
        },
        failureCallBack: (error: any) => {
          console.log("display  ==" + error);
          // setAlert(true);
          // setAlertMessage(error?.errorDesc || "Login failed. Please try again.");
          // dispatch(routeChange('end'));
        }
      };

      makeAPIPOSTRequest('/identityservices/auth/v1/customer/login', {}, data, options);
    } else {
      setAlert(true);
      setAlertMessage("Please Enter Valid Details");
    }
  };

  const getProgramDetails = (requestId: string) => {
    const data = { requestId };
    
    const options = {
      successCallBack: (res: any) => {
        const programData = res.getProgramRespList[0];
        fetchApplicationId(programData.programId);
        
          const details = res.getCustomerApplicationResponseList[0].programDetails;
          dispatch(setOnboardingName(details.onboardingPartner));
          dispatch(setCompanyName(details.company));
      },
      failureCallBack: (error: any) => {
        console.log("display  ==" + error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/supermoney-service/program/get', {}, data, options);
  };

  const fetchApplicationId = (programID?: string) => {
    // if (!app.customerID) {
    //   dispatch(routeChange('end'));
    //   return;
    // }
    dispatch(routeChange('start'))
    const data = {
      customerId: app.customerID,
      programId: programID,
    };

    const options = {
      successCallBack: (res: any) => {
        if (res.getCustomerApplicationResponseList?.[0]) {
          const appData = res.getCustomerApplicationResponseList[0];
          dispatch(setApplicationId(appData.applicationId));
          
          if (appData.programDetails) {
            dispatch(setOnboardingName(appData.programDetails.onboardingPartner));
            dispatch(setCompanyName(appData.programDetails.company));
          }
          
          navigate('/UpFrontLanding');
        }
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
         const data = error.response.data;
          if (data.error == 201) {
            createApplicationId(programID);
          }
      }
    };

    makeAPIPOSTRequest('/supermoney-service/customer/application/get', {}, data, options);
  };

  const createApplicationId = (programID?: string) => {
      dispatch(routeChange('start'));

    const data = {
      customerId: app.customerID,
      profileId: app.profileID,
      programId: programID,
      createdBy: "Self",
      source: "IFWEB",
    };

    const options = {
      successCallBack: (res: any) => {
        if (res.status) {
          dispatch(setApplicationId(res.applicationId));
        }
        navigate('/UpFrontLanding');
        dispatch(routeChange('end'));
      },
      failureCallBack: (error: any) => {
        console.log("display  ==" + error);
        dispatch(routeChange('end'));
      }
    };

    makeAPIPOSTRequest('/supermoney-service/customer/application/create', {}, data, options);
  };


  const getLeadDetails = () => {
    let url =
      "https://.mintwalk.com/crmbackend/GetBorrowerLead/?lead_id=" +
      app.leadID;
    axios
      .get(url)
      .then(function (response) {
        const JSONData = response.data;

        if (JSONData.successFlag) {
          setMobno(JSONData.data[0].phone_number);
          const search = new URLSearchParams(window.location.search).get("requestID")
          if (
            search &&
            (search == "Klsafpfalqx02uljlderkD82" ||
              search == "Pi6FMCBmgXxxue7Oe6Gur12")
          ) {
            // mobileNuberDisabled = true;
          }
        }
        //console.log(JSON.stringify(JSONData.data[0].bureau_score));
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
        .then(function (response) {
          let lat = response.data.lat;
          let lon = response.data.lon;
          console.log(lat + "===" + lon);
          getLiveLocation(lat, lon);
        })
        .catch(function (error) {
          // handle error
          console.log("display  ==" + error);
        })
        .finally(function () {
          // always executed
        });
  };

  const getLiveLocation = (lat: any, lon: any) => {
    navigator.permissions
      .query({
        name: "geolocation",
      })
      .then(function (result) {
        if (result.state == "granted") {
          // navigator.geolocation.getCurrentPosition(showPosition);
        } else if (result.state == "prompt") {
          console.log("prompt" + result.state);

          // navigator.geolocation.getCurrentPosition(
          //   revealPosition,
          //   positionDenied,
          //   geoSettings
          // );
        } else if (result.state == "denied") {
          console.log(result.state);
        }
        result.onchange = function () {
          console.log(result.state);
        };
      });
  };

  // const showPosition = (position) => {
  //   lat = position.coords.latitude;
  //   lon = position.coords.longitude;
  //   console.log(lat + "===" + lon);
  // };

   useEffect(() => {
    dispatch(routeChange('end'));
    
    fetchLocation();
    if (app.leadID && app.leadID.length > 0 ) {
      getLeadDetails();
    }
  }, []);

  return (
    <div className="max-w-[450px] mx-auto text-left font-['Montserrat'] bg-white min-h-screen">
      {/* Alert */}
      {alert && (
        <div
          className="bg-[#ff5252] border border-red-400 text-white px-4 py-3 rounded relative mb-4 flex justify-between "
          role="alert"
        >
          {/* <strong className="font-bold">Error! </strong> */}
          <TriangleAlert color={'#ff5252'} fill='white' size={30}/>
          <span className="content-center">{alertMessage}</span>
          <div>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setAlert(false)}
          >
            <CircleX color={'#ff5252'} fill='white' size={30}/>
          </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-[#311b92] text-center pt-2.5 pb-2 pl-4">
        <img
          src={SupermoneyLogoW}
          alt="SuperMoney Logo"
          className=" mx-auto"
        />
        <div className="mt-10 ml-7 max-w-[248px] text-white text-left">
          <b>Get Instant Pre-approved Credit for all your Invoices</b>
        </div>
        <div className="text-right mt-[-50px]">
          <img
            src={getcash}
            alt="Get Cash"
            className="max-w-[146px] ml-auto"
          />
        </div>
      </div>

      {/* Login Form */}
      <div className="mx-5 mt-6">
        <span className="font-bold text-lg">Login to your account</span>

        {/* Mobile Number Input */}

        <div className="relative mt-5">
  <div className="text-gray-500 absolute p-3 flex items-center pointer-events-none">
    +91 |
  </div>
  <input
    type="text"
    placeholder={isFocused.mobno ? 'Enter mobile no' : ''}
    inputMode="numeric"
    value={mobno}
    onChange={(e) =>
      /^\d*$/.test(e.target.value) &&
      e.target.value.length <= 10 &&
      setMobno(e.target.value)
    }
    onFocus={() => setIsFocused((prev) => ({...prev, mobno: true}))}
    onBlur={() => {
      setIsFocused((prev) => ({...prev, mobno: false}))
      setIsTouched(true);
    }}
    className={`peer w-full rounded border pl-12 pt-3 pb-3 text-base/6 text-sm focus:outline-none
      ${isTouched && !mobno ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-600"}`}
  />
  <label
    className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
      ${isFocused.mobno || mobno ? "-top-1 text-xs bg-white px-1" : "top-4 pl-10 text-sm"}
    `}
  >
    Mobile Number
  </label>
  {isTouched && !mobno && (
    <p className="mt-1 text-xs text-red-600">Required.</p>
  )}
</div>
        {/* <div className="relative mt-5">
          <div className="text-gray-500 absolute p-3 flex items-center pointer-events-none">
              +91 |
            </div>
                        <input
                            type="text"
                            placeholder= {isFocused.mobno ? 'Enter mobile no' : ''}
                            inputMode="numeric"
                            value={mobno}
                            onChange={(e) =>
                                /^\d*$/.test(e.target.value) &&
                                e.target.value.length <= 10 &&
                                setMobno(e.target.value)
                            }
                            onFocus={() => setIsFocused((prev) => ({...prev, mobno: true}))}
                            onBlur={() => {
                                setIsFocused((prev) => ({...prev, mobno: false}))
                                setIsTouched(true);
                            }}
                            className={`peer w-full rounded border pl-12 pt-3 pb-3 text-base/6 text-sm focus:outline-none
      ${mobno && isTouched ? "border-red-500 focus:border-red-500 pl-10 " : "border-gray-300 focus:border-blue-600"}`}
                        />
                        <label
                            className={`absolute left-3  text-gray-500 transition-all duration-200 pointer-events-none
    ${isFocused.mobno || mobno ? "-top-1 text-xs bg-white" : "top-4 pl-10 text-sm"}
    
  `}
                        >
                            Mobile Number
                        </label>
                        {mobno && isTouched && (
                            <p className="mt-1 text-xs text-red-600">{}</p>
                        )}
                    </div> */}

        {/* <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">+91 |</span>
            </div>
            <input
              type="tel"
              value={mobno}
              onChange={handleMobileInput}
              maxLength={10}
              placeholder="Enter mobile no."
              disabled={mobileNumberDisabled}
              className="w-full pl-16 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#311b92] focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          {mobno && !rules.mobile(mobno) && (
            <p className="text-red-500 text-xs mt-1">{rules.mobile(mobno)}</p>
          )}
          {mobno && !rules.repeatedNumbers(mobno) && (
            <p className="text-red-500 text-xs mt-1">{rules.repeatedNumbers(mobno)}</p>
          )}
        </div> */}

        {/* PIN Input */}
        <div className="relative mt-5">
          <input
            type="password"
            placeholder={isFocused.pinno ? 'Enter 4 digit login PIN' : ''}
            inputMode="numeric"
            value={loginPin}
            onChange={handlePinInput}
            onFocus={() => setIsFocused((prev) => ({...prev, pinno: true}))}
            onBlur={() => {
              setIsFocused((prev) => ({...prev, pinno: false}))
              setIsTouched(true);
            }}
            className={`peer w-full rounded border pl-4 pt-3 pb-3 text-base/6 text-sm focus:outline-none
              ${loginPin && isTouched
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-600"}
            `}
          />
          <label
            className={`absolute left-3 text-gray-500 transition-all duration-200 pointer-events-none
              ${isFocused.pinno || loginPin ? "-top-1 text-xs bg-white px-1" : "top-3 text-sm"}
            `}
          >
            PIN
          </label>
          {loginPin && isTouched && (
            <p className="mt-1 text-xs text-red-600">{}</p>
          )}
        </div>
        {/* <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN
          </label>
          <input
            type="password"
            value={loginPin}
            onChange={handlePinInput}
            maxLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Enter 4 digit login PIN"
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#311b92] focus:border-transparent"
          />
        </div> */}

        {/* Login Button */}
        <button
          onClick={loginByPin}
          className="w-full bg-[#311b92] text-white font-bold py-3 px-4 rounded-md mt-6 mb-7 hover:bg-[#4328AE] transition-colors"
        >
          Login
        </button>
      </div>

      {/* Terms & Conditions Footer */}
      <div className="fixed bottom-0 bg-[#fafafa] p-4 max-w-[450px] w-full flex items-start border-t border-gray-200">
        <input
          type="checkbox"
          id="tandc"
          checked={true}
          // onChange={(e) => setTandc(e.target.checked)}
          className="mt-1 mr-2"
        />
        <label htmlFor="tandc" className="text-xs text-gray-600">
          By continuing you are agreeing to SuperMoney's{" "}
          <button onClick={ontandcChange} className="text-blue-600 underline">
            Terms & Conditions
          </button>{" "}
          and{" "}
          <a
            href="https://www.supermoney.in/PrivacyPolicies.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Privacy Policy
          </a>{" "}
          and receive communication from SuperMoney via SMS, WhatsApp and
          Robocall.
        </label>
      </div>

      {/* Terms & Conditions Modal */}
      {tandcSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-[450px] max-h-[80vh] flex flex-col">
            <div className="pt-6 text-center">
              <img
                src={tandclogo}
                // src="../assets/img/tandclogo.png"
                alt="Terms & Conditions"
                className="mt-2.5 mx-auto"
              />
            </div>

            <div className="mt-6 px-6 overflow-auto flex-1 mb-24">
              <div
                className="mt-6 text-left pb-12 font-sans"
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
              />
            </div>

            <div className="p-6 fixed bottom-0 max-w-[450px] w-full bg-white border-t border-gray-200">
              <button
                onClick={acceptTandC}
                className="bg-[#4328AE] text-white font-bold py-3 px-6 rounded-md ml-auto block hover:bg-[#311b92] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};