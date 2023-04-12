import React, { useEffect, useState } from 'react';

function VerifyEmail({params}) {
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = params.token;
      try {
        const response = await fetch(`http://localhost:8080/api/verify/${token}`);
        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      {verificationStatus === 'success' && (
        <div className="success-message">
          Email successfully verified! You can now <a href="/login">log in</a>.
        </div>
      )}
      {verificationStatus === 'error' && (
        <div className="error-message">
          Email verification failed. The verification link may be invalid or expired. Please try
          registering again or contact support for assistance.
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
