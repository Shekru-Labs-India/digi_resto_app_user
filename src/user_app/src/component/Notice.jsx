import React, { useEffect, useState } from 'react';

function Notice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    setShowNotice(currentDomain !== 'menumitra.com' && currentDomain !== 'www.menumitra.com');
  }, []);

  if (!showNotice) return null;

  return (
    <div className="badge bg-info d-block text-center text-bold bd-announcement p-1">
      TESTING
    </div>
  );
}

export default Notice;