// src/components/leaderboard/SignInPrompt.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Window from "@/views/home-v2/components/Window";
import { RetroButton } from "@/components/RetroButton";
import {
    useAppKit,
    useAppKitAccount,
    useDisconnect,
} from "@reown/appkit/react";
import { useSignMessage } from "wagmi";

interface SignInPromptProps {
    signature: string | null;
    onSignInSuccess: (signature: string) => void;
    onDisconnect: () => void;
}

const SignInPrompt: React.FC<SignInPromptProps> = ({ signature, onSignInSuccess, onDisconnect }) => {
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const { signMessage } = useSignMessage();
    const hasAttemptedSignature = useRef(false);

    const handleSignMessage = () => {
        const message = "Please sign this message to confirm your identity.";
        signMessage(
            { message },
            {
                onSuccess: (data) => {
                    onSignInSuccess(data);
                    hasAttemptedSignature.current = true;
                },
                onError: (error) => {
                    console.error("Failed to sign message:", error);
                    hasAttemptedSignature.current = true; // Mark as attempted even on error
                },
            }
        );
    };

    useEffect(() => {
        if (isConnected && !signature && !hasAttemptedSignature.current) {
            handleSignMessage();
        }
    }, [isConnected, signature]);

    const handleDisconnect = () => {
        onDisconnect();
        disconnect();
    };

    if (!isConnected) {
        return (
            <Window>
                <div className="flex justify-center items-center h-full">
                    <RetroButton onClick={() => open()}>Sign In</RetroButton>
                </div>
            </Window>
        );
    }

    if (signature) {
        return (
            <Window>
                <div className="flex flex-col justify-center items-center h-full">
                    <p className="mb-4">You are signed in!</p>
                    <RetroButton onClick={handleDisconnect}>Disconnect</RetroButton>
                </div>
            </Window>
        );
    }

    return (
        <Window>
            <div className="flex flex-col justify-center items-center h-full">
                <p>Please sign the message in your wallet...</p>
            </div>
        </Window>
    );
};

export default SignInPrompt;
