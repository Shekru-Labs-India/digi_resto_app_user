// import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect, useState } from "react";
// import HotelList from "./HotelList";

// function QRScreen() {
//   const [scanResult, setScanResult] = useState(null);
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [scanner, setScanner] = useState(null);
//   const [permissionText, setPermissionText] = useState("");
//   const [isScanning, setIsScanning] = useState(false);
//   const [cameraId, setCameraId] = useState(null);
//   const [cameras, setCameras] = useState([]);

//   useEffect(() => {
//     if (isScanning && !scanner) {
//       const newScanner = new Html5QrcodeScanner("reader", {
//         qrbox: {
//           width: 250,
//           height: 250,
//         },
//         fps: 10,
//       });
//       setScanner(newScanner);
//     }
//   }, [isScanning, scanner]);

//   const startScanning = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then(() => {
//         setCameraPermission(true);
//         setPermissionText("Permission OK");
//         setIsScanning(true); // Show the reader div
//         if (scanner) {
//           scanner.render(success, error);
//         }

//         function success(result) {
//           scanner.clear();
//           setScanResult(result);
//           window.location.href = result; // Redirect to the scanned link
//         }

//         function error(err) {
//           console.warn(err);
//         }
//       })
//       .catch((err) => {
//         console.warn(
//           "Camera permission denied or error starting video source:",
//           err
//         );
//         setCameraPermission(false);
//         setPermissionText("Permission NOT OK or error starting video source");
//       });
//   };

//   useEffect(() => {
//     if (scanner && isScanning) {
//       scanner.render(success, error);

//       function success(result) {
//         scanner.clear();
//         setScanResult(result);
//         window.location.href = result; // Redirect to the scanned link
//       }

//       function error(err) {
//         console.warn(err);
//       }
//     }
//   }, [scanner, isScanning]);

//   const handleCameraChange = (event) => {
//     setCameraId(event.target.value);
//   };

//   const requestAccess = () => {
//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         if (devices && devices.length) {
//           setCameras(devices);
//           // Try to find the back camera
//           const backCamera = devices.find((device) =>
//             device.label.toLowerCase().includes("back")
//           );
//           setCameraId(backCamera ? backCamera.id : devices[0].id);
//         }
//       })
//       .catch((err) => {
//         console.error("Error getting cameras:", err);
//       });
//   };

//   return (
//     <div className="container">
//       <h1 className="text-center my-4">Menu Mitra</h1>
//       {permissionText && (
//         <div className="alert alert-info">{permissionText}</div>
//       )}
//       {scanResult ? (
//         <div className="alert alert-success">
//           Success: <a href={scanResult}>{scanResult}</a>
//         </div>
//       ) : (
//         isScanning && <div id="reader" className="reader"></div>
//       )}
//       <div className="my-3 text-center">
//         <button className="btn btn-primary" onClick={startScanning}>
//           <i className="ri-qr-scan-line pe-2 fs-3"></i>
//           Scan QR
//         </button>
//       </div>
//       {cameraPermission === false && (
//         <div className="my-3">
//           <button className="btn btn-warning" onClick={requestAccess}>
//             Request Camera Access
//           </button>
//         </div>
//       )}
//       <div className="my-3">
//         {/* <select
//           className="form-select"
//           onChange={handleCameraChange}
//           value={cameraId}
//         >
//           {cameras.map((camera) => (
//             <option key={camera.id} value={camera.id}>
//               {camera.label}
//             </option>
//           ))}
//         </select> */}
//       </div>
//       <HotelList />
//     </div>
//   );
// }

// export default QRScreen;







// import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect, useState } from "react";
// import HotelList from "./HotelList";

// function QRScreen() {
//   const [scanResult, setScanResult] = useState(null);
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [scanner, setScanner] = useState(null);
//   const [permissionText, setPermissionText] = useState("");
//   const [isScanning, setIsScanning] = useState(false);
//   const [cameraId, setCameraId] = useState(null);
//   const [cameras, setCameras] = useState([]);

//   useEffect(() => {
//     if (isScanning && !scanner) {
//       const newScanner = new Html5QrcodeScanner("reader", {
//         qrbox: { width: 250, height: 250 },
//         fps: 10,
//       });
//       setScanner(newScanner);
//     }
//   }, [isScanning, scanner]);

//   const checkMediaDevices = () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setPermissionText("Camera access is not supported on this device.");
//       return false;
//     }
//     return true;
//   };

//   const startScanning = async () => {
//     if (!checkMediaDevices()) return;

//     try {
//       await navigator.mediaDevices.getUserMedia({ video: true });
//       setCameraPermission(true);
//       setPermissionText("Permission granted.");
//       setIsScanning(true);

//       if (scanner) {
//         scanner.render(handleScanSuccess, handleScanError);
//       }
//     } catch (err) {
//       console.warn(
//         "Camera permission denied or error starting video source:",
//         err
//       );
//       setCameraPermission(false);
//       setPermissionText("Permission denied or error accessing camera.");
//     }
//   };

//   const handleScanSuccess = (result) => {
//     if (scanner) {
//       scanner.clear();
//     }
//     setScanResult(result);
//     window.location.href = result; // Redirect to the scanned link
//   };

//   const handleScanError = (err) => {
//     console.warn("Scan error:", err);
//   };

//   const requestAccess = async () => {
//     try {
//       const devices = await Html5Qrcode.getCameras();
//       if (devices && devices.length) {
//         setCameras(devices);
//         const backCamera = devices.find((device) =>
//           device.label.toLowerCase().includes("back")
//         );
//         setCameraId(backCamera ? backCamera.id : devices[0].id);
//       } else {
//         setPermissionText("No camera found.");
//       }
//     } catch (err) {
//       console.error("Error getting cameras:", err);
//       setPermissionText("Error getting camera devices.");
//     }
//   };

//   return (
//     <div className="container">
//       <h1 className="text-center my-4">Menu Mitra</h1>
//       {permissionText && (
//         <div className="alert alert-info">{permissionText}</div>
//       )}
//       {scanResult ? (
//         <div className="alert alert-success">
//           Success: <a href={scanResult}>{scanResult}</a>
//         </div>
//       ) : (
//         isScanning && <div id="reader" className="reader"></div>
//       )}
//       <div className="my-3 text-center">
//         <button className="btn btn-primary" onClick={startScanning}>
//           <i className="ri-qr-scan-line pe-2 fs-3"></i>
//           Start Scanning
//         </button>
//       </div>
//       {cameraPermission === false && (
//         <div className="my-3">
//           <button className="btn btn-warning" onClick={requestAccess}>
//             Request Camera Access
//           </button>
//         </div>
//       )}
//       <div className="my-3">
//         {/* Uncomment if you want to select a camera */}
//         {/* <select className="form-select" onChange={handleCameraChange} value={cameraId}>
//           {cameras.map((camera) => (
//             <option key={camera.id} value={camera.id}>
//               {camera.label}
//             </option>
//           ))}
//         </select> */}
//       </div>
//       <HotelList />
//     </div>
//   );
// }

// export default QRScreen;




// v3





import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import HotelList from "./HotelList";
import "../assets/css/QRScreen.css"; // Import custom styles

function QRScreen() {
  const [scanResult, setScanResult] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [scanner, setScanner] = useState(null);
  const [permissionText, setPermissionText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isScanning && !scanner) {
      const newScanner = new Html5Qrcode("reader");
      setScanner(newScanner);
    }
  }, [isScanning, scanner]);

  const checkMediaDevices = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionText("Camera access is not supported on this device.");
      return false;
    }
    return true;
  };

  const startScanning = async () => {
    if (!checkMediaDevices()) return;

    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      setIsScanning(true);

      if (scanner) {
        scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          handleScanSuccess,
          handleScanError
        );
      }
    } catch (err) {
      console.warn(
        "Camera permission denied or error starting video source:",
        err
      );
      setCameraPermission(false);
      setPermissionText(
        "Unable to access the camera. Please check your browser settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (result) => {
    if (scanner) {
      scanner.stop();
    }
    setScanResult(result);
    window.location.href = result; // Redirect to the scanned link
  };

  const handleScanError = (err) => {
    console.warn("Scan error:", err);
  };

  const requestAccess = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setCameras(devices);
        const backCamera = devices.find((device) =>
          device.label.toLowerCase().includes("back")
        );
        setCameraId(backCamera ? backCamera.id : devices[0].id);
      } else {
        setPermissionText("No camera found.");
      }
    } catch (err) {
      console.error("Error getting cameras:", err);
      setPermissionText("Error getting camera devices.");
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Menu Mitra</h1>
      {permissionText && (
        <div className="alert alert-info">{permissionText}</div>
      )}
      {scanResult ? (
        <div className="alert alert-success">
          Success: <a href={scanResult}>{scanResult}</a>
        </div>
      ) : (
        isScanning && <div id="reader" className="reader"></div>
      )}
      <div className="my-3 text-center">
        <button
          className="btn btn-primary"
          onClick={startScanning}
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <i className="ri-qr-scan-line pe-2 fs-3"></i>
          )}
          {loading ? "Accessing Camera..." : "Start Scanning"}
        </button>
      </div>
      <div className="my-3">
        {/* Uncomment if you want to select a camera */}
        {/* <select className="form-select" onChange={handleCameraChange} value={cameraId}>
          {cameras.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.label}
            </option>
          ))}
        </select> */}
      </div>
      <HotelList />
    </div>
  );
}

export default QRScreen;