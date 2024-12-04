import React, { useEffect, useState } from 'react';

function Notice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    setShowNotice(currentDomain === 'menumitra.com');
  }, []);

  return (
    <div className={`${showNotice ? '' : 'd-none'}`}>
      <div className="badge bg-info d-block text-center text-bold bd-announcement p-1">
        TESTING
      </div>
    </div>
  );
}

export default Notice;