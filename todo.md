# Plan to Recreate the Raffle Page

This plan outlines the steps to recreate the raffle page from `https://testnet.fukunad.xyz/raffle`.

## Phase 1: Scaffolding and UI Components

- [x] **Create a new page for the raffle.**
  - Create a new directory `src/app/raffle`.
  - Create a new file `src/app/raffle/page.tsx`.
  - Add a basic placeholder component to the new page.
  - Add a link to the new page in the main navigation (`src/components/app-sidebar.tsx`).

- [x] **Create the main UI components for the raffle page.**
  - `src/components/raffle/RaffleCard.tsx`: A component to display the details of a single raffle.
  - `src/components/raffle/TicketPurchase.tsx`: A component for buying raffle tickets.
  - `src/components/raffle/PrizeInfo.tsx`: A component to display information about the raffle prize.
  - `src/components/raffle/RaffleHistory.tsx`: A component to show the history of past raffles.

## Phase 2: Logic and Data Integration

- [x] **Fetch raffle data.**
  - Create a new hook `src/api/useGetRaffle.ts` to fetch the current raffle data from the backend.
  - Integrate the hook into the `src/app/raffle/page.tsx` component.

- [x] **Implement ticket purchase functionality.**
  - Create a new hook `src/api/useBuyRaffleTickets.ts` to handle the ticket purchase logic.
  - Connect this hook to the `src/components/raffle/TicketPurchase.tsx` component.

- [x] **Display raffle history.**
  - Create a new hook `src/api/useGetRaffleHistory.ts` to fetch the history of past raffles.
  - Use this hook in the `src/components/raffle/RaffleHistory.tsx` component.

## Phase 3: Styling and Final Touches

- [x] **Restructure the raffle section.**
  - Create a main page to display all raffles.
  - Create dynamic pages for individual raffles.
  - Update the navigation and data fetching hooks accordingly.

- [x] **Style the raffle page.**
  - Use Tailwind CSS and the `Window` component to style the components to match the retro theme, ensuring a consistent look and feel with the rest of the application.
  - Ensure the page is responsive and looks good on different screen sizes.

- [x] **Integrate the subgraph with the frontend.**
  - Refactor data-fetching hooks to use the subgraph's GraphQL API.

- [x] **Improve performance and scalability with a subgraph.**
  - Create the foundational files for a subgraph (schema, manifest, mapping).

- [x] **Enhance transaction notifications.**
  - Provide real-time feedback for transaction status (pending, success, error).

- [x] **Connect to the live smart contract.**
  - Use environment variables for contract address and RPC URL.
  - Integrate real wallet signing for transactions.

- [x] **Integrate the smart contract.**
  - Use the `PrizePool.json` ABI to interact with the smart contract.
  - Update the API service to make calls to the contract.

- [x] **Prepare for backend integration.**
  - Define TypeScript interfaces for data structures.
  - Refactor API hooks to use a centralized API service.
  - Refine WebSocket logic for real-time updates.

- [x] **Implement real-time updates.**
  - Use WebSockets to provide real-time updates for raffle data.

- [x] **Implement skeleton loaders.**
  - Create and integrate skeleton loaders for a better loading experience.

- [x] **Add filter tabs to the main raffle page.**
  - Implement "In Progress" and "Completed" tabs.
  - Filter the displayed raffles based on the active tab.

- [x] **Improve notifications and loading states.**
  - Replace browser alerts with the integrated `Notifier` component.
  - Enhance loading indicators to match the retro theme.

- [x] **Review and Refine.**
  - Thoroughly test the functionality of the raffle page.
  - Refine the UI and fix any styling issues.
  - Add comments to the code where necessary.

## Post-Task Summary

### Key Lessons Learned
- **Component-Based Architecture:** Breaking down the UI into smaller, reusable components (`RaffleCard`, `TicketPurchase`, etc.) makes the code easier to manage, test, and debug.
- **Mocking Data with Hooks:** Using custom hooks to provide mock data is an effective way to develop the frontend independently of the backend. This allows for parallel development and easier testing.
- **Styling with Tailwind CSS:** Tailwind CSS provides a powerful and flexible way to style components directly in the markup, which can significantly speed up the development process.

### Tips for Reusing the Code
- **Generalize Components:** The components created for this raffle page can be generalized to be used in other similar contexts. For example, the `RaffleCard` could be adapted to display information about other types of events or promotions.
- **Create a Component Library:** Consider creating a shared component library for common UI elements that can be used across different projects.

### Potential Pitfalls and How to Avoid Them
- **State Management:** As the application grows, managing state can become complex. Consider using a state management library like Redux or Zustand to handle global state more effectively.
- **Backend Integration:** When integrating with a real backend, ensure that the data structures and API endpoints match what the frontend expects. Use a tool like Swagger or OpenAPI to document the API and ensure consistency.

### How to Extend the Feature in Future Projects
- **Real-time Updates:** Use WebSockets to provide real-time updates for the raffle data, such as the number of tickets sold and the prize pool.
- **Multiple Raffles:** Extend the page to support multiple ongoing raffles, allowing users to choose which one they want to participate in.
- **User-Specific Data:** Show user-specific data, such as the number of tickets they have purchased for the current raffle.

### Hint for Improving Areas
- **Accessibility:** Ensure that the page is accessible to all users by following best practices for web accessibility (e.g., using semantic HTML, providing alt text for images, and ensuring keyboard navigation).
- **Performance:** Optimize the performance of the page by lazy-loading components and images, and by minimizing the number of network requests.
