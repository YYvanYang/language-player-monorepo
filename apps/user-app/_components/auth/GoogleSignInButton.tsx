// apps/user-app/_components/auth/GoogleSignInButton.tsx
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleCallbackAction } from '@/_actions/authActions'; // Adjust path
import { Button } from '@repo/ui'; // Use shared button for consistency
import { Loader } from 'lucide-react'; // Example loading icon

// IMPORTANT: This MUST be prefixed with NEXT_PUBLIC_ for client-side access
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton() {
  const router = useRouter();
  const [isProcessing, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Store action result locally to trigger effects
  const [actionResult, setActionResult] = useState<{ success: boolean; message?: string; isNewUser?: boolean } | null>(null);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null);
    setActionResult(null);
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError('Google Sign-In failed: No ID token received.');
      return;
    }

    startTransition(async () => {
      const result = await googleCallbackAction(idToken);
      setActionResult(result); // Store action result to trigger useEffect
    });
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In Provider Error');
    setError('Google Sign-In failed. Please ensure popups are allowed and try again.');
    setActionResult(null); // Clear previous results
  };

  // Effect to handle redirection or error display after action completes
  useEffect(() => {
     if (actionResult?.success) {
        console.log("Google Sign-In successful via action, redirecting...");
        // Redirect to home page or intended destination
        router.push('/'); // Redirect to dashboard
        // router.refresh(); // Optional: Force refresh
     } else if (actionResult && actionResult.success === false) {
        // Set error state based on the action's message
        setError(actionResult.message || 'Google Sign-In failed.');
     }
  }, [actionResult, router]);

  if (!googleClientId) {
    console.error("GoogleSignInButton: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
    return <p className="text-xs text-center text-red-500 mt-2">Google Sign-In is currently unavailable.</p>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        <div className="flex flex-col items-center space-y-2 w-full">
             <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={handleGoogleError}
                 useOneTap={false} // Disable one-tap initially
                 shape="rectangular" // or 'circle', 'pill'
                 theme="outline" // or 'filled_blue', 'filled_black'
                 size="large"
                 width="100%" // Make it responsive
                 // containerProps={{ style: { width: '100%'} }} // Ensure container allows full width
             />

             {isProcessing && (
                 <div className="flex items-center justify-center text-sm text-gray-500 pt-2">
                     <Loader className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                 </div>
             )}
             {/* Display error messages below the button */}
             {error && !isProcessing && ( // Only show error if not processing
                 <p className="text-red-600 text-sm pt-1 text-center">{error}</p>
             )}
         </div>
    </GoogleOAuthProvider>
  );
}