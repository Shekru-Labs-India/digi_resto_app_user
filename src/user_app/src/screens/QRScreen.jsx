import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import HotelList from "./HotelList";
// import OverlayIcon from "../assets/google lens.svg";
import logo from "../assets/logos/menumitra_logo_128.png";

import { Link } from "react-router-dom";
import Notice from "../component/Notice";
import { isNonProductionDomain } from "../component/config";
const QRScanner = () => {
  const [scannedResult, setScannedResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const startCamera = () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    if (videoRef.current) {
      codeReader
        .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            setScannedResult(result.text);
            if (videoRef.current.srcObject) {
              const tracks = videoRef.current.srcObject.getTracks();
              tracks.forEach((track) => track.stop());
            }
            // Show toast message using window.showToast
            window.showToast("success", "QR Code scanned successfully. Redirecting...");
            
            // Redirect after 2 seconds
            setTimeout(() => {
              window.location.href = result.text;
            }, 2000);
          }

          if (error) {
            console.clear();
          }
        })
        .catch((err) => {
          console.clear();
                    window.showToast("error", "Failed to access camera. Please try again.");
        });
    }
  };

  const handleScanButtonClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setShowCamera(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.clear();
      window.showToast("error", "Camera access denied. Please allow camera access to scan QR codes.");
    }
  };

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
  }, [showCamera]);

  const isDarkMode = localStorage.getItem("isDarkMode");

  return (
    <div>
      {/* {isNonProductionDomain() && <Notice />} */}
      <div className="container-fluid  d-flex flex-column align-items-center vh-100 ">
        <Link to="/OrderTypeScreen">
          {" "}
          <div className="d-flex align-items-center mt-4 mb-3">
            <img src={logo} alt="logo" width="40" height="40" />
            <div className="text-dark mb-0 mt-1 fw-semibold font_size_18 ms-2">
              MenuMitra
            </div>
          </div>
        </Link>        <div className="container px-0 ">
          <HotelList />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;