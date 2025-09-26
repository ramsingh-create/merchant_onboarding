import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoBlue from '../../assets/images/landinglogoblue.png';
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useDispatch } from 'react-redux';
import { routeChange } from '../../store/appSlice';
import { makeAPIPOSTRequest } from '../../utils/apiActions';

const SOA: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [alertMessage, setAlertMessage] = useState('');
    const [alert, setAlert] = useState(false);
    const [height, setHeight] = useState(window.innerHeight);
    const [lenderName, setLenderName] = useState('');
    const [soaDocumentBinary, setSoaDocumentBinary] = useState<string | null>(null);
    const [applicationSelected, setApplicationSelected] = useState<any>(undefined);
    const [applicationList, setApplicationList] = useState<any[]>([]);

    const app = useSelector((state: RootState) => state.app);

    useEffect(() => {
        setHeight(document.documentElement.clientHeight);
        fetchApplicationId();
    }, []);

    const goBack = () => {
        console.log('Go back clicked');
        navigate(-1);
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

    const downloadSOA = () => {
        if (!soaDocumentBinary) return;
        const link = document.createElement('a');
        link.href = soaDocumentBinary;
        link.download = 'SOA_Document.pdf';
        link.click();
        console.log('SOA download triggered');
    };

    const loadImageFun = async (imageUrl: string) => {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${app.authToken}`,
                },
            });
            const blobUrl = URL.createObjectURL(response.data);
            setSoaDocumentBinary(blobUrl);
            console.log('SOA image loaded:', blobUrl);
        } catch (err) {
            console.log('display Error', err);
            setSoaDocumentBinary(null);
        }

    };

    const fetchApplicationId = () => {
        dispatch(routeChange('start'));

        let url = "/supermoney-service/customer/application/get";
        let request = {
            customerId: app.customerID,
        };

        const options = {
            successCallBack: (response: any) => {
                dispatch(routeChange('end'));
                console.log(response);
                setApplicationList(response.getCustomerApplicationResponseList);
                setApplicationSelected(response.getCustomerApplicationResponseList[0]);
                // setLenderName(
                //     JSONData.getCustomerApplicationResponseList[0].programLenderResp.lenderName
                // );
                fetchSOADocument();
            },
            failureCallBack: (error: any) => {
                dispatch(routeChange('end'));
                console.log("display  ==" + error);
                setAlert(true);
                setAlertMessage("Something went wrong, please try again later.");
            }
        };

        makeAPIPOSTRequest(url, {}, request, options);

    };

    const fetchSOADocument = () => {
        dispatch(routeChange('start'));

        let url = "/googlecloudstorage/storage/document/fetch";
        let request = {
            id: app.customerID,
            applicationId: applicationSelected?.applicationId,
            type: "customer",
        };

        const options = {
            successCallBack: async (response: any) => {
                dispatch(routeChange('end'));

                const soaDocumentObject = response.documents.reverse().findLast((doc: any) => doc.docTypeId == 93);
                loadImageFun(soaDocumentObject.documentUrl);
            },
            failureCallBack: (error: any) => {
                dispatch(routeChange('end'));
                console.log("display  ==" + error);
            },
        };

        makeAPIPOSTRequest(url, {}, request, options)
    };

    return (
        <div
            className="bg-[#f2f0fb] font-montserrat text-left min-h-screen max-w-[450px] mx-auto"
            style={{ height: `${height}px` }}
        >
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

            {alert && (
                <div className="bg-red-100 text-red-800 p-2 rounded m-4">{alertMessage}</div>
            )}

            <div className="px-4 pt-4">
                <select
                    className="text-center text-sm bg-[#ede7f6] rounded px-2 py-1 w-full text-[#4328ae]"
                    value={applicationSelected?.applicationId || ''}
                    onChange={(e) => {
                        const selected = applicationList.find(
                            (app) => app.applicationId === e.target.value
                        );
                        setApplicationSelected(selected);
                        setLenderName(selected.programLenderResp.lenderName);
                        fetchSOADocument();
                        console.log('Application changed:', selected);
                    }}
                >
                    {applicationList.map((item, index) => (
                        <option key={index} value={item.applicationId}>
                            {item.programDetails.programName} - {item.programLenderResp.lenderName}
                        </option>
                    ))}
                </select>

                {lenderName !== 'MINTWALK' ? (
                    <div className="mt-4">
                        {soaDocumentBinary ? (
                            <div className="bg-white rounded-xl shadow p-6 text-center min-h-[180px]">
                                <div className="text-[#4328ae] font-semibold text-lg mb-3">
                                    SOA Available
                                </div>
                                <button
                                    className="bg-[#4328ae] text-white rounded px-4 py-2"
                                    onClick={downloadSOA}
                                >
                                    Download
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow p-6 text-center min-h-[180px]">
                                <div className="text-[#4328ae] font-semibold text-lg mb-7">
                                    SOA Document Not Available
                                </div>
                                <div className="flex justify-center">
                                <button
                                    className="bg-[#4328ae] text-white rounded px-4 py-2 flex items-center justify-center gap-2"
                                    onClick={dial}
                                >
                                    <Phone size={16} fill='white' />
                                    Call
                                </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="bg-white rounded-xl shadow p-6 text-center min-h-[180px]">
                            <div className="text-[#4328ae] font-semibold text-lg mb-3">
                                Download SOA
                            </div>
                            <button
                                className="bg-[#4328ae] text-white rounded px-4 py-2"
                                onClick={downloadSOA}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SOA;
