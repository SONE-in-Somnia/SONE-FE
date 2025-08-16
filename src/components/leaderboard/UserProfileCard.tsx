// src/components/leaderboard/UserProfileCard.tsx
"use client";

import React, {useState} from "react";
import Window from "@/views/home-v2/components/Window";
import useGetReferral from "@/api/useGetReferral";
import useGetReferralSummary from "@/api/useGetReferralSummary";
import { RetroButton } from "@/components/RetroButton";

interface UserProfileCardProps {
    address: string;
    rank: number | string;
    points: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ address, rank, points }) => {
    const [copied, setCopied] = useState(false);

    // Use the refactored query hooks
    const { data: referralData, isLoading: isLoadingReferral } = useGetReferral({ address, page: 1, limit: 10 });
    const { data: summaryData, isLoading: isLoadingSummary } = useGetReferralSummary(address);

    const generateAvatar = (seed: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = 50;
        canvas.height = 50;
        const context = canvas.getContext("2d");

        if (context) {
            const seedArr = seed.slice(2, 10).split("").map(char => parseInt(char, 16));
            const bgColor = `#${seed.slice(10, 16)}`;
            const mainColor = `#${seed.slice(2, 8)}`;

            context.fillStyle = bgColor;
            context.fillRect(0, 0, 50, 50);

            context.fillStyle = mainColor;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 4; j++) {
                    if (seedArr[i] > j * 4) {
                        context.fillRect(j * 10, i * 6.25, 10, 6.25);
                        context.fillRect((4 - j) * 10, i * 6.25, 10, 6.25);
                    }
                }
            }
        }
        return canvas.toDataURL();
    };

    const handleCopy = () => {
        if (referralData?.referralCode) {
            const referralLink = `${window.location.origin}?ref=${referralData.referralCode}`;
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Window title="⚡️ YOUR STATS ⚡️">
            <div className="p-4">
                <div className="flex items-center">
                    <img src={generateAvatar(address)} alt="User Avatar" className="w-16 h-16 rounded-none mr-4" />
                    <div>
                        <p className="font-bold text-lg">Rank: {rank}</p>
                        <p>Points: {points}</p>
                        <p className="text-sm text-gray-500 truncate">{address}</p>
                    </div>
                </div>
                <div className="mt-4 border-t pt-4">
                    <h3 className="font-bold mb-2">Your Referral Stats</h3>
                    {isLoadingSummary ? (
                        <p>Loading stats...</p>
                    ) : (
                        <div className="flex justify-between">
                            <p>Total Referrals: <span className="font-bold">{summaryData?.totalReferrals ?? 0}</span></p>
                            <p>Referral Points: <span className="font-bold">{summaryData?.totalReferralPoints ?? 0}</span></p>
                        </div>
                    )}
                </div>
                <div className="mt-4 border-t pt-4">
                    <h3 className="font-bold">Your Referral Code</h3>
                    {isLoadingReferral ? (
                        <p>Loading referral code...</p>
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-lg font-mono bg-gray-200 p-2">{referralData?.referralCode ?? "N/A"}</p>
                            <RetroButton onClick={handleCopy} disabled={!referralData?.referralCode}>
                                {copied ? "Copied!" : "Copy Link"}
                            </RetroButton>
                        </div>
                    )}
                </div>
            </div>
        </Window>
    );
};

export default UserProfileCard;