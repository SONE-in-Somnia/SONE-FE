// src/views/leaderboard/leaderboard-view.tsx
"use client";

import React, { useState } from "react";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import MissionTable from "@/components/leaderboard/mission-table";
import Window from "@/views/home-v2/components/Window";
import Image from "next/image";
import RetroPanel from "@/components/customized/RetroPanel";
import SignInPrompt from "@/components/leaderboard/SignInPrompt";
import UserProfileCard from "@/components/leaderboard/UserProfileCard";
import { useAppKitAccount } from "@reown/appkit/react";
import useGetLeaderboard from "@/api/useGetLeaderboard"; // Import the new hook
import LeaderboardAnimation from "@/components/leaderboard/LeaderboardAnimation";

const LeaderboardView = () => {
    const { address, isConnected } = useAppKitAccount();
    const [signature, setSignature] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("userSignature");
        }
        return null;
    });

    // Use the new hook for fetching leaderboard data
    const { data: leaderboard = [], isLoading: isLoadingLeaderboard, isError: leaderboardError, isFetching } = useGetLeaderboard();

    const handleSignInSuccess = (newSignature: string) => {
        setSignature(newSignature);
        localStorage.setItem("userSignature", newSignature);
    };

    const handleDisconnect = () => {
        setSignature(null);
        localStorage.removeItem("userSignature");
    };

    const formattedLeaderboardData = leaderboard.map((player, index) => ({
        rank: index + 1,
        address: player.address,
        total_deposit: player.totalPoints,
    }));

    const currentUserData = isConnected && signature
        ? formattedLeaderboardData.find(player => player.address.toLowerCase() === address?.toLowerCase())
        : undefined;

    if (isLoadingLeaderboard && leaderboard.length === 0) {
        return <RetroPanel title="Leaderboard" className="bg-retro-orange text-center">Loading...</RetroPanel>;
    }

    return (
        <RetroPanel title="🏆 LEADERBOARD 🏆" className="bg-retro-orange h-fit">
            {isFetching && leaderboard.length > 0 && (
                <div className="text-center text-sm text-gray-500">Updating leaderboard...</div>
            )}
            <div className="mx-auto px-3 py-8 font-pixel-operator-mono">
                <div className="mb-5 h-[120px] overflow-hidden">
                    <LeaderboardAnimation />
                </div>
                
                <div className="flex gap-5">
                    <div className="w-1/2">
                        <Window title="👑 RANKING 👑" className="bg-retro-yellow">
                            {leaderboardError && <p className="text-red-500 text-center">Failed to load leaderboard.</p>}
                            {!leaderboardError && <LeaderboardTable data={formattedLeaderboardData} />}
                        </Window>
                    </div>
                    <div className="w-1/2 h-fit">
                        <div className="mb-5">
                            {isConnected && signature ? (
                                <UserProfileCard
                                    address={address || ""}
                                    rank={currentUserData?.rank ?? "N/A"}
                                    points={currentUserData?.total_deposit ?? 0}
                                />
                            ) : (
                                <SignInPrompt
                                    signature={signature}
                                    onSignInSuccess={handleSignInSuccess}
                                    onDisconnect={handleDisconnect}
                                />
                            )}
                        </div>
                        <MissionTable />
                    </div>
                </div>
            </div>
        </RetroPanel>
    );
};

export default LeaderboardView;