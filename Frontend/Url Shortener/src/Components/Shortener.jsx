import React, { useState, useRef, useEffect } from 'react';
import { handleRedirectToOriginalUrl, handleShortenUrl, handleQr } from '../api';
import './Popup.css';
import Navbar from './Navbar';


function Shortener() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');
    const [domain, setDomain] = useState(process.env.VITE_DOMAIN);
    const [alias, setAlias] = useState('');
    const [errorMsgURL, setErrorMsgURL] = useState('');
    const [errorMsgAlias, setErrorMsgAlias] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isQrGenerated, setIsQrGenerated] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const URlRef = useRef();
    const modalRef = useRef();

    const handleSubmit = () => {
        if (URlRef.current.value === '') {
            setErrorMsgURL('This field is required');
            return;
        }
        const Data = {
            originalUrl,
            alias
        };
        handleShortenUrl(Data).then((response) => {
            if (response.success) {
                setShortenedUrl(`${domain}/${response.data.data.shortID}`);
                setIsSuccessful(true);
            } else {
                if (response.error.status === 429) {
                    Popup("Too many requests. Please try after sometime.");
                }
                if (response.error.from === 'URL') {
                    setErrorMsgURL(response.error.message);
                } else if (response.error.from === 'Alias') {
                    setErrorMsgAlias(response.error.message);
                }
            }
        });
    };

    const handleRedirect = () => {
        handleRedirectToOriginalUrl(shortenedUrl).then((response) => {
            if (!response.success) {
                if (response.error.status === 429) {
                    Popup("Too many requests. Please try after sometime.");
                }
            }
        });
    };

    const handleQRGeneration = () => {
        handleQr(originalUrl).then((response) => {
            if (response.success) {
                setQrCode(response.data);
                setIsQrGenerated(true);
            } else {
                if (response.error.status === 429) {
                    Popup("Too many requests. Please try after sometime.");
                }
            }
        });

        setErrorMsgAlias('');
        setErrorMsgURL('');
    };

    const NewUrl = () => {
        setOriginalUrl('');
        setShortenedUrl('');
        setAlias('');
        setIsSuccessful(false);
        setErrorMsgAlias('');
        setErrorMsgURL('');
    };

    const closeModal = () => {
        setIsQrGenerated(false);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };

    useEffect(() => {
        if (isQrGenerated) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isQrGenerated]);

    const PopupMessage = ({ message, show }) => {
        return (
            <div className={`popup ${show ? 'show' : ''}`}>
                <p>{message}</p>
            </div>
        );
    };

    const Popup = (value) => {
        setPopupMessage(value);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000); // Hide after 2 seconds
    };

    let isDisabled = isSuccessful;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-lg w-full m-auto p-8 bg-white shadow-lg rounded-lg border border-gray-300">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">URL Shortener</h1>
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            value={originalUrl}
                            ref={URlRef}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            placeholder="Enter URL (https:// or http://)"
                            onFocus={() => setErrorMsgURL('')}
                            disabled={isDisabled}
                            className={`w-full bg-white border border-gray-300 rounded-lg px-4 py-2 ${isSuccessful ? 'text-blue-400' : 'text-gray-700'} focus:outline-none`}
                        />
                        <p className='text-red-600 mt-1'>{errorMsgURL}</p>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <input
                            type="text"
                            value={domain}
                            disabled
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed"
                        />

                        <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="Alias (optional)"
                            onFocus={() => setErrorMsgAlias('')}
                            disabled={isDisabled}
                            className={`w-full bg-white border border-gray-300 rounded-lg px-4 py-2 ${isSuccessful ? 'text-blue-400' : 'text-gray-700'} focus:outline-none`}
                        />
                        <p className='text-red-600 mt-1'>{errorMsgAlias}</p>
                    </div>

                    <div className="flex justify-center space-x-4">
                        {!isSuccessful ? (
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            >
                                Shorten
                            </button>
                        ) : (
                            <div className="flex space-x-4">
                                <button
                                    onClick={NewUrl}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    Shorten Another
                                </button>
                                <button
                                    onClick={handleQRGeneration}
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                >
                                    Generate QR
                                </button>
                            </div>
                        )}
                    </div>

                    {isQrGenerated && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div
                                ref={modalRef}
                                className="bg-white p-6 rounded-lg shadow-lg relative"
                                style={{ width: 'auto' }}
                            >
                        
                                <img src={qrCode} alt="QR Code" className="max-w-xs" />
                            </div>
                        </div>
                    )}
                </div>

                {shortenedUrl && (
                    <div className="mt-6 text-center">
                        <p className="mb-2 text-gray-700">Shortened URL:</p>
                        <a
                            
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={handleRedirect}
                        >
                            {shortenedUrl}
                        </a>
                    </div>
                )}
            </div>
            {showPopup && <PopupMessage message={popupMessage} show={showPopup} />}
        </div>
    );
}

export default Shortener;

