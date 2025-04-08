'use client';

import * as React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { googleCallbackAction } from '../../_actions/authActions'; // Use relative path
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

// Placeholder for shared UI components
// End Placeholder

export function GoogleSignInButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = React.useState<string | null>(null);

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        setError(null);
        if (!credentialResponse.credential) {
            setError('Google Sign-In failed: No ID token received.');
            return;
        }

        const idToken = credentialResponse.credential;

        startTransition(async () => {
            try {
                const result = await googleCallbackAction(idToken);
                if (result.success) {
                    // Redirect based on whether the user is new or existing
                    // You might want different redirects, e.g., to a welcome page for new users
                    router.push(result.isNewUser ? '/welcome' : '/');
                    // Optionally router.refresh() here if needed
                } else {
                    setError(result.message || 'Google Sign-In failed.');
                }
            } catch (err) {
                console.error("Google Callback Action Error:", err);
                setError('An unexpected error occurred during Google Sign-In.');
            }
        });
    };

    const handleGoogleError = () => {
        console.error('Google Sign-In Provider Error');
        setError('Google Sign-In failed. Please try again.');
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                // You can customize the button text, theme, etc.
                // useOneTap // Option for one-tap sign-in experience
            />
             {isPending && <p className="text-sm text-gray-600">Signing in with Google...</p>}
             {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}

// Remember to wrap your app or layout with GoogleOAuthProvider
// import { GoogleOAuthProvider } from '@react-oauth/google';
//
// <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
//   {/* Your App or Layout Components */}
// </GoogleOAuthProvider> 