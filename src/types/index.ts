// src/types/index.ts

export interface ReferralData {
    referralCode: string;
    // Add any other fields the backend might send for a referral
}

export interface ReferralSummary {
    totalReferrals: number;
    totalReferralPoints: number;
}

export interface Player {
    address: string;
    totalPoints: number;
}