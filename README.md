# React Rewind

A hands-on React learning repository focused on revisiting core concepts through practical, production-style implementations.

The repository currently includes **Gopi's Bhojanalaya**, a responsive restaurant ordering experience built to explore React state management, reusable components, cart workflows, browser persistence, timeline-based undo/redo, and performance-conscious UI patterns.

## Featured Project — Gopi's Bhojanalaya 🍛

**Gopi's Bhojanalaya** is a mobile-first restaurant ordering interface where users can browse restaurants and dishes, search the menu, filter vegetarian options, build a cart, review pricing, complete a simulated checkout flow, and revisit cart actions through a rewindable history.

### Live Demo

[**Open Gopi's Bhojanalaya**](https://gopis-bhojanalaya.vercel.app)

## Key Features

- **Restaurant & dish browsing** — Browse structured restaurant and dish data with cuisine, ratings, delivery times, pricing, and featured recommendations.
- **Search & filtering** — Quickly narrow the menu with search and a vegetarian-only filter.
- **Cart management** — Add items, increment or decrement quantities, remove items automatically when quantity reaches zero, and clear the cart.
- **Persistent cart state** — Cart contents are stored in `localStorage` so the active cart can be restored across visits.
- **Cross-tab synchronization** — Cart and session changes can be broadcast between browser tabs using the `storage` event.
- **Rewind / redo history** — Cart mutations are represented as timeline states, allowing users to move backward, forward, or jump to a previous state.
- **Audit history** — User actions are recorded with timestamps for a persistent activity trail.
- **Checkout flow** — Includes minimum-order validation, order confirmation, receipt presentation, and session reset handling.
- **Bill splitting** — A lazily loaded bill-splitting flow supports sharing a receipt total through WhatsApp.
- **Responsive UI** — Optimized for both compact mobile layouts and larger desktop screens.
- **Interaction feedback** — Cart totals, quantities, status states, and checkout transitions update from shared React state.

## Technical Highlights

This project is intentionally more than a static UI. It is designed around reusable React patterns and stateful application behavior.

### State & Data Flow

A dedicated `CartProvider` exposes cart state and actions through a custom `useCart` hook. Cart items are modeled with a consistent `CartItem` type containing the dish identity, pricing, and quantity.

Cart updates are also used to build a timeline of immutable cart states, which powers the rewind/redo experience. cite-placeholder-use-source-files-not-in-readme

### Persistence & Synchronization

The active cart is persisted in browser storage, while a lightweight storage-event mechanism synchronizes cart changes and session resets across tabs.

### Performance

The bill splitter is loaded with `React.lazy` and `Suspense`, keeping that heavier interaction out of the initial component path until it is needed.

### Styling

The Bhojanalaya app uses **Tailwind CSS** utility classes for responsive layout, spacing, states, and component styling.

## Tech Stack

| Technology | Usage |
| --- | --- |
| **React 19** | UI and component architecture |
| **TypeScript** | Type-safe application development |
| **Tailwind CSS 4** | Responsive styling and UI states |
| **Parcel** | Development server and production bundling |
| **Browser `localStorage`** | Cart/session persistence |
| **React Context** | Shared cart and application state |

## Project Structure

```text
react-rewind/
├── apps/
│   └── bhojanalaya/
│       ├── src/
│       │   ├── components/
│       │   │   ├── BillSplitter.tsx
│       │   │   ├── DishCard.tsx
│       │   │   ├── DishGrid.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── RewindHistory.tsx
│       │   │   ├── SearchBar.tsx
│       │   │   └── ShoppingCart.tsx
│       │   ├── hooks/
│       │   │   ├── useCart.tsx
│       │   │   └── useTabSync.ts
│       │   ├── utils/
│       │   ├── App.tsx
│       │   └── restaurantData.ts
│       └── package.json
├── shared-libs/
└── package.json
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Run Locally

```bash
npm install
npm run start
```

For the Bhojanalaya app specifically:

```bash
cd apps/bhojanalaya
npm install
npm run start
```

The app is served through Parcel and can be opened at the local URL shown in the terminal.

### Production Build

```bash
npm run build
```

## Deployment

The Bhojanalaya app is deployed on **Vercel**.

Production deployments can be triggered through the connected Git repository or the Vercel CLI.

## Why This Project Exists

**React Rewind** is a practical learning workspace rather than a collection of isolated tutorials. Each project is used to revisit React fundamentals by solving real application problems: shared state, derived values, persistence, history, responsive interaction design, lazy loading, and user-flow handling.

The goal is to turn repeated practice into production-ready habits.

## Repository Status

This repository is actively used as a learning and implementation workspace. Features evolve as new React concepts are revisited and existing workflows are refined through real user testing.

## Author

**Gopi Chandana**

[GitHub](https://github.com/GopiChandana)
