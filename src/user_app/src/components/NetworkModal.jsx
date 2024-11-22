import React from 'react';
import { useNetwork } from '../context/NetworkContext';

const NetworkModal = () => {
  const { showNetworkModal, setShowNetworkModal, isOnline } = useNetwork();

  if (!showNetworkModal) return null;

  return (
    <>
      <div className="modal fade show d-flex align-items-center justify-content-center"
           style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ width: "350px", margin: "auto" }}>
            <div className="modal-body text-center py-4">
              <i className={`ri-${isOnline ? 'signal-wifi-error-line' : 'wifi-off-line'} text-danger fs-1 mb-3`}></i>
              <h5 className="modal-title mb-3">
                {isOnline ? 'Poor Internet Connection' : 'No Internet Connection'}
              </h5>
              <p className="mb-4">
                {isOnline 
                  ? 'Your internet connection is weak. Please check your network settings.'
                  : 'Please check your internet connection and try again.'}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={() => setShowNetworkModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary rounded-pill px-4"
                        onClick={() => window.location.reload()}>
                  <i className="ri-refresh-line me-2"></i>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default NetworkModal;