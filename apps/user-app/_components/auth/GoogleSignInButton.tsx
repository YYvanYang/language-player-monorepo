// apps/user-app/_components/auth/GoogleSignInButton.tsx
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { googleCallbackAction } from '@/../_actions/authActions'; // Adjust path
import { Button } from '@repo/ui'; // Use shared button for consistency
import { Loader } from 'lucide-react'; // Example loading icon

// Your Google Client ID from environment variable
// IMPORTANT: This MUST be prefixed with NEXT_PUBLIC_ for client-side access
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ success: boolean; message?: string; isNewUser?: boolean } | null>(null);

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    setError(null); // Clear previous errors
    setActionResult(null);
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setError('Google Sign-In failed: No ID token received.');
      return;
    }

    startTransition(async () => {
      const result = await googleCallbackAction(idToken);
      setActionResult(result); // Store action result
    });
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed');
    setError('Google Sign-In failed. Please try again.');
  };

  // Effect to handle redirection or error display after action completes
  useEffect(() => {
     if(actionResult?.success) {
        console.log("Google Sign-In successful, redirecting...");
        // Redirect to home page or intended destination
        router.push('/');
        // router.refresh(); // Optional
     } else if (actionResult?.success === false) {
        setError(actionResult.message || 'Google Sign-In failed.');
     }
  }, [actionResult, router]);

  if (!googleClientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
    // Render nothing or a placeholder if ID is missing
    return <p className="text-xs text-red-500">Google Sign-In not configured.</p>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        <div className="flex flex-col items-center space-y-2">
             {/* Option 1: Use Google's default styled button */}
             <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={handleGoogleError}
                 useOneTap={false} // Disable one-tap login initially if preferred
                 shape="rectangular"
                 theme="outline"
                 size="large"
                 width="300px" // Example width
             />

             {/* Option 2: Use a custom button with useGoogleLogin hook (more flexible styling) */}
             {/* <CustomGoogleButton /> */}

             {isPending && (
                 <div className="flex items-center text-sm text-gray-500">
                     <Loader className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                 </div>
             )}
             {error && (
                 <p className="text-red-600 text-sm">{error}</p>
             )}
         </div>
    </GoogleOAuthProvider>
  );
}

// Example for Option 2: Custom Button
// import { useGoogleLogin } from '@react-oauth/google';
// function CustomGoogleButton() {
//     const [isPending, startTransition] = useTransition();
//     const [error, setError] = useState<string|null>(null);
//     const router = useRouter();

//     const handleCustomGoogleSuccess = async (tokenResponse: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {
//          setError(null);
//          // IMPORTANT: This flow gives an ACCESS TOKEN, NOT an ID token directly.
//          // Your backend /auth/google/callback MUST be adapted to handle an access token
//          // by calling Google's userinfo endpoint, OR you need a different flow
//          // to get the ID token with useGoogleLogin (less common with this hook).
//          // ---> The GoogleLogin component flow (getting ID token) is generally easier for backend verification.
//          // ---> Sticking with GoogleLogin component is recommended unless you specifically need access tokens client-side.
//          console.warn("useGoogleLogin flow with access token needs backend adjustment!");
//         // Example IF backend handles access token:
//         // startTransition(async () => {
//         //    const result = await someActionHandlingAccessToken(tokenResponse.access_token);
//         //    // ... handle result ...
//         // });
//     };

//     const login = useGoogleLogin({
//         onSuccess: handleCustomGoogleSuccess,
//         onError: () => setError('Google Login Failed'),
//         // flow: 'auth-code', // Alternative: Get auth code, send to backend -> backend exchanges for tokens
//     });

//     return (
//         <Button onClick={() => login()} disabled={isPending} variant="outline">
//             {isPending ? <Loader /> : <img src="/google-icon.svg" alt="" width={20} height={20} className="mr-2"/>} Sign in with Google
//         </Button>
//     );
// }