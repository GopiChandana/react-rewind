# React Rewind

A **React learning monorepo** where I revisit concepts by building real, working features instead of isolated examples.

## 🍛 Gopi's Bhojanalaya

A **single-page React application** built as a component-based restaurant ordering interface. Restaurants, search, filters, dishes, cart, checkout and supporting interactions are composed within the same page rather than split across multiple routes/pages.

The interesting part is the cart: **it has a rewindable history**. Cart actions are stored as timeline states, so users can undo, redo, or jump back to an earlier cart state. The app also keeps an audit trail and can sync cart/session changes across browser tabs.

**Live:** https://gopis-bhojanalaya.vercel.app

### What makes it interesting

- ⏪ **Rewind / redo cart history** with timeline navigation
- 🧾 **Action audit trail** with timestamps
- 🔄 **Cross-tab state synchronization** using browser storage events
- 💾 **Persistent cart/session state** with `localStorage`
- 🧮 **Real-time pricing** with GST, delivery and platform fees
- 📊 **Bill splitter** with WhatsApp sharing
- 📱 **Responsive single-page UI** with a dedicated mobile cart experience
- ⚡ **Lazy-loaded bill splitter** using `React.lazy` and `Suspense`

## How to Use

1. **Browse** restaurants and dishes on the page.
2. **Search or filter** the menu, including the vegetarian-only option.
3. **Add dishes** and adjust quantities directly from the interface.
4. **Open the cart** to review items and the price breakdown.
5. **Checkout** — orders below ₹250 are blocked with validation.
6. **View the receipt**, split the bill if needed, and share it through WhatsApp.
7. **Rewind / Redo** to move through previous cart states and restore an earlier cart.

## Monorepo Structure

This repository uses **npm workspaces** and is structured to hold multiple React applications and shared packages.

```text
react-rewind/
├── apps/
│   ├── bhojanalaya/       # Current active application
│   └── shared-utils/      # Shared package
├── docs/                  # React notes and implementation documentation
├── my-code-implementations-with-explanations/
└── package.json
```

**Bhojanalaya is the first active app. Other applications are currently being built and will be added to the monorepo as they progress.**

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 4
- React Context API + custom hooks
- Parcel
- npm Workspaces
- `localStorage` + browser Storage Events
- Vercel

## Run Locally

From the repository root:

```bash
npm install
npm run start:bhojanalaya
```

Or run the app directly:

```bash
cd apps/bhojanalaya
npm install
npm start
```

### Build

```bash
cd apps/bhojanalaya
npm run build
```

## Status

🚧 **Work in progress** — Bhojanalaya is the current active project, with more applications in development as part of the monorepo.

## Author

**Gopi Chandana**  
https://github.com/GopiChandana
