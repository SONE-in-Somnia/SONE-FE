"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// This hook now simulates a blockchain transaction for UI testing purposes.
export const useSubmitWheelyEntry = () => {
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const submitEntry = async (amount: string) => {
    setIsPending(true);
    setError(null);
    setHash(null);

    console.log(`Simulating deposit of ${amount}...`);

    // Simulate the delay of a real transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate a successful transaction
    const mockHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    console.log(`Simulated success with hash: ${mockHash}`);
    setHash(mockHash);
    toast.success("Deposit successful!");
    
    // To simulate a failure, you could uncomment this:
    // const mockError = new Error("User rejected transaction");
    // setError(mockError);
    // toast.error("Deposit failed!");

    setIsPending(false);
  };

  return {
    submitEntry,
    hash,
    isPending,
    error,
  };
};
