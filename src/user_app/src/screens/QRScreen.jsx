import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import HotelList from "./HotelList";
// import OverlayIcon from "../assets/google lens.svg";
import logo from "../assets/logos/menumitra_logo_128.png";
import CompanyVersion from "../constants/CompanyVersion";
import { Link } from "react-router-dom";
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
            console.warn(error);
          }
        })
        .catch((err) => {
          console.error("Error occurred while trying to read from video device:", err);
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
      console.error("Camera permission denied:", error);
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
      <div className="container-fluid  d-flex flex-column align-items-center vh-100 ">
        <Link to="/">
          {" "}
          <div className="d-flex align-items-center mt-4 mb-3">
            <img src={logo} alt="logo" width="40" height="40" />
            <div className="text-dark mb-0 mt-1 fw-semibold font_size_18">
              MenuMitra
            </div>
          </div>
        </Link>
        {/* {!showCamera && (
        <button
          className="btn btn-primary my-3 rounded-pill"
          onClick={handleScanButtonClick}
        >
          <i className="ri-qr-scan-2-line pe-2 fs-4"></i> Scan QR
        </button>
      )} */}

        {/* {showCamera && (
        <div
          className="position-relative w-75 mb-4 rounded-5"
          style={{ maxWidth: "300px", aspectRatio: "1 / 1" }}
        >
          <video
            ref={videoRef}
            className="w-100 h-100 rounded-5 mt-2"
            style={{ objectFit: "cover" }}
          />
          <img
            src={OverlayIcon}
            alt="Overlay"
            className="position-absolute start-0 w-75 h-75"
            style={{
              pointerEvents: "none",
              top: "50%",
              left: "50%",
              transform: "translate(16%, -46%)",
              filter: "invert(35%) sepia(100%) saturate(1000%) hue-rotate(90deg) brightness(90%) contrast(90%)",
            }}
          />
        </div>
      )} */}

        <div className="container px-0 ">
          <HotelList />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;