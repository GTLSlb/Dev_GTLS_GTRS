import React, { useState } from 'react';
import Cookies from 'js-cookie';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(!Cookies.get('cookiePermission'));

  const handleAccept = () => {
    Cookies.set('cookiePermission', 'true', { expires: 365 });
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div className="cookie-popup bg-goldd rounded-xl p-5">
        <p>This website uses cookies to improve your experience.</p>
        <button onClick={handleAccept}>Accept</button>
      </div>
    )
  );
};

export default CookiePopup;
