// components/ProfileCard.js
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProfileCard = () => {
    return (
        <Card className=" text-white border-none rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <CardHeader className="p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Placeholder cho avatar */}
                    <div>
                        <h3 className="text-sm font-semibold">0x0309...def3</h3>
                    </div>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                    <span>Referral code:</span>
                    <span className="text-purple-400 font-mono">OXYDDD34</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-purple-400">⚪</span>
                        <span className="text-lg font-bold">120</span>
                    </div>

                </div>
                <div className="flex justify-between text-sm">
                    <div>
                        <span className="text-gray-400">Total Points</span>
                        <p className="text-green-400 font-bold">1,200</p>
                    </div>
                    <div>
                        <span className="text-gray-400">Rank</span>
                        <p className="text-yellow-400 font-bold">#12</p>
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4">
                <Button
                    variant="destructive"
                    className="w-full bg-red-700 hover:bg-red-800 text-white rounded-lg"
                >
                    Log out <span className="ml-2">➜</span>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProfileCard;