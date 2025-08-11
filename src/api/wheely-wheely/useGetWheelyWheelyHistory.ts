"use client";

import { useQuery } from "@tanstack/react-query";

const getWheelyWheelyHistory = async () => {
  // Placeholder for fetching data from a smart contract or API
  console.log("Fetching wheely wheely history...");
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([]); // Start with an empty array
    }, 1000)
  );
};

export const useGetWheelyWheelyHistory = () => {
  return useQuery({
    queryKey: ["wheely-wheely-history"],
    queryFn: getWheelyWheelyHistory,
  });
};
