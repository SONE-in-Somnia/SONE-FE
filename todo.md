# Wheely Wheely Feature Implementation Plan

This document outlines the tasks required to implement the "Wheely Wheely" game feature, based on the provided UI design.

## Phase 1: Scaffolding and Basic Structure

- [x] Create the main page file at `src/app/wheely-wheely/page.tsx`.
- [x] Implement the basic three-column layout using Tailwind CSS.
- [x] Create a `WheelyWheelyContext` at `src/context/wheely-wheely/WheelyWheelyContext.tsx` to manage game state. (Later removed in favor of wagmi hooks).
- [x] Create placeholder components for each of the main UI panels.

## Phase 2: Core Component Development

- [x] Develop the `RetroPanel` component for consistent container styling. (Reused `Window` component instead).
- [x] Implement the "Input Your Entry" panel component.
- [x] Implement the "Players" panel component.
- [x] Build the "Wheel of Fortune" visual component.
  - [x] Integrate `@mui/x-charts` to render the player shares.
  - [x] Use the `NumberCounter` component for the total pot display.

## Phase 3: Web3 and State Integration

- [x] Integrate the `WheelyWheelyContext` with the main page.
- [x] Create `useSubmitWheelyEntry.ts` hook for handling the deposit logic.
- [x] Create `useGetWheelyWheelyPlayers.ts` hook to fetch the player list.
- [x] Connect the `useSubmitWheelyEntry` hook to the "SUBMIT" button.
- [x] Fetch and display real-time data using the `useGetWheelyWheelyPlayers` hook.
- [ ] Implement real-time updates using the `SocketContext`.
- [x] Add a `useGetWheelyWheelyHistory` hook and a corresponding view for the "View History" button.

## Phase 4: Finalization and Review

- [ ] Conduct a final review of the UI to ensure it matches the design.
- [ ] Test the functionality of the game from end to end (with real contract).
- [ ] Remove any placeholder code and add final comments.
- [ ] Merge the `feat/wheely-wheely` branch into the main branch.