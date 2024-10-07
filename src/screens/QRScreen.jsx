import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Toast } from "primereact/toast"; // Import Toast from PrimeReact
import HotelList from "./HotelList";

const QRScanner = () => {
  const [scannedResult, setScannedResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const toast = useRef(null); // Create a ref for the toast

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
            // Show toast message
            toast.current.show({ severity: 'success', summary: 'QR Code Scanned', detail: 'Redirecting...', life: 2000 });
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
          console.error(
            "Error occurred while trying to read from video device:",
            err
          );
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
    }
  };

  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
  }, [showCamera]);

  return (
    <div className="container-fluid bg-light vh-100 d-flex flex-column align-items-center">
      <Toast ref={toast} position="bottom-center" /> {/* Add Toast component */}
      <h2 className="text-dark mt-3">MenuMitra</h2>
      {!showCamera && ( // Conditionally render the button
        <button className="btn btn-primary my-3 rounded-pill" onClick={handleScanButtonClick}>
          Scan QR
        </button>
      )}
      {showCamera && (
        <div
          className="position-relative w-75 mb-4 rounded-5"
          style={{ maxWidth: "300px", aspectRatio: "1 / 1" }}
        >
          <video
            ref={videoRef}
            className="w-100 h-100 rounded-5 mt-2"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="container">
        <HotelList />
      </div>
    </div>
  );
};

export default QRScanner;