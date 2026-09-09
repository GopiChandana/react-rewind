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

## Demo

### 📱 Mobile

A short mobile walkthrough covering the main ordering flow, cart controls, checkout, receipt and bill splitting.

[▶️ **Watch the mobile walkthrough**](https://github.com/user-attachments/assets/f28a0468-95db-4d37-b595-c93711032e52)

<p>
<img width="280" alt="Bhojanalaya mobile application - restaurant browsing" src="https://github.com/user-attachments/assets/dcc2dc47-bd2f-45f7-a9a7-5ef14b18c22" />
<img width="280" alt="Bhojanalaya mobile application - Food Ledger and rewind history" src="https://github.com/user-attachments/assets/2da3c23b-94f4-4eef-8231-48241a3a3149" />
</p>

### 🖥️ Desktop

Application screenshots showing the wider layout, cart experience and **Timeline / Food Ledger** history controls.

<p>
<img width="420" alt="Bhojanalaya desktop application screenshot 1" src="https://github.com/user-attachments/assets/72f7479c-f3e1-479d-8645-e9b84327bf39" />
<img width="420" alt="Bhojanalaya desktop application screenshot 2" src="https://github.com/user-attachments/assets/a3afdedb-396f-481d-970b-5610e2d69fe1" />
</p>

## How to Use

1. **Browse** restaurants and dishes on the page.
2. **Search or filter** the menu, including the vegetarian-only option.
3. **Add dishes** and adjust quantities directly from the interface.
4. **Open the cart** to review items and the price breakdown.
5. **Checkout** — orders below ₹250 are blocked with validation.
6. **View the receipt**, split the bill if needed, and share it through WhatsApp.
7. **Rewind / Redo** to move through previous cart states and restore an earlier cart.

## Lighthouse

Results were captured on the **deployed application using Chrome Lighthouse in Incognito mode**.

| | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| 📱 Mobile | **100** | **100** | **100** | **90** |
| 🖥️ Desktop | **100** | **100** | **100** | **90** |

> Lighthouse scores can vary depending on device, network conditions, browser extensions and other local factors.

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
