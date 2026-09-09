# React Rewind

A monorepo where I revisit React concepts through hands-on projects, experiments, and small implementations.

Instead of keeping the learning limited to isolated examples, I use this repository to build complete features and work through real application problems as I go.

## Current Project

### 🍛 Gopi's Bhojanalaya

The first application in the repo is **Gopi's Bhojanalaya** — a responsive restaurant ordering experience built with React and TypeScript.

**Live:** https://gopis-bhojanalaya.vercel.app

The app currently includes:

- Restaurant and dish browsing
- Search and vegetarian-only filtering
- Add-to-cart and quantity management
- Persistent cart state using `localStorage`
- Cart totals, GST, delivery and platform fee calculations
- Minimum order validation
- Simulated checkout and receipt flow
- Bill splitting and WhatsApp sharing
- Rewind / redo of cart actions
- Cart action audit history
- Cross-tab cart/session synchronization
- Responsive mobile and desktop layouts
- Lazy loading for the bill splitter

The project is also being refined through actual usability testing, especially around the mobile ordering flow.

## Repository Structure

This repository is set up as a **monorepo** using npm workspaces.

```text
react-rewind/
├── apps/
│   ├── bhojanalaya/       # Current React application
│   └── shared-utils/      # Shared utilities/package
├── docs/                  # Notes and learning documentation
├── my-code-implementations-with-explanations/
├── To-be-done/
└── package.json
```

The monorepo is intentionally structured to make it easy to add more React applications and experiments. **Bhojanalaya is the first active app; other apps are currently in progress and will be added as they are built.**

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS 4
- Parcel
- React Context API
- npm Workspaces
- Browser `localStorage`
- Vercel

## Running Bhojanalaya Locally

From the repository root:

```bash
npm install
npm run start:bhojanalaya
```

The root workspace script starts the Bhojanalaya app through its workspace configuration.

You can also run the app directly:

```bash
cd apps/bhojanalaya
npm install
npm start
```

### Production build

```bash
cd apps/bhojanalaya
npm run build
```

## A Few Things I'm Exploring Here

This repo is mainly a space for learning by building, so the focus is not just on getting a UI to work.

Some of the concepts being explored include:

- Reusable React components and props
- Shared state with Context and custom hooks
- Derived state and state transitions
- Browser persistence and cross-tab communication
- Undo/redo and timeline-based state management
- Responsive UI and mobile-first interaction
- Lazy loading and code splitting
- TypeScript types and safer component APIs
- Performance and rendering behaviour
- Debugging and documenting implementation decisions

## Why "React Rewind"?

The idea is simple: go back over React fundamentals, but this time by actually building things with them.

Each project is a chance to revisit something I have learned, understand it more deeply, and turn it into a working feature rather than just another tutorial example.

## Status

🚧 **Work in progress**

Bhojanalaya is the current active application. The monorepo will continue to grow as more projects and experiments are developed.

## Author

**Gopi Chandana**

GitHub: https://github.com/GopiChandana
