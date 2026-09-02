# 📦 Workspace Architecture Guide (React 19 + Tailwind v4 + Parcel)

This repository is organized as an **npm workspaces monorepo** bundled with **Parcel**. Instead of creating a separate Git repository for every cloned application, all projects live together under a single, unified ecosystem. 

---

## 🧠 Core Philosophy: Separation of Concerns

Each `package.json` in this workspace has a strict, unique job description:
1. **The Root Manager (`/package.json`)**: Configures high-level npm workspaces. It hosts orchestration scripts and global configurations. It contains **no** application source code.
2. **The Shared Utility Engine (`/packages/shared-utils`)**: Houses reusable custom code (like state-rewinding hooks, context wrappers, or common formatters) that any application can seamlessly import.
3. **The App Containers (`/packages/*`)**: Isolated folders containing the exact business logic, markup, assets, and unique dependencies for individual clone applications.

---

## 📂 Structural Overview

```text
react-rewind/                  <-- Project Root (Manager)
├── package.json               # Defines workspaces & root shortcut scripts
├── .postcssrc                 # Centralized PostCSS engine for Tailwind v4
├── MONOREPO_GUIDE.md          # This architectural reference documentation
└── packages/                  <-- Application Directory
    ├── shared-utils/          <-- Custom Utility Engine
    │   ├── package.json       # Configures package name: `@react-rewind/shared-utils`
    │   └── index.js           # Shared utilities entry point (Hooks, Helpers)
    │
    ├── bhojanalaya/           <-- App 1: Food Delivery
    │   ├── package.json       
    │   ├── index.html         
    │   ├── public/            
    │   └── src/               # React components & styles
    │
    ├── Web Performance Analyzer/           <-- App 2: The Performance Analyzer
    │   ├── package.json       
    │   ├── index.html         
    │   ├── public/            
    │   └── src/               
    │
       
```

---

## 🛠️ Global Configuration Blueprints

### 1. Root Orchestrator (`/package.json`)
```json
{
  "name": "react-rewind",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "start:bhojanalaya": "npm start --workspace=packages/bhojanalaya",
  }
}
```

### 2. Centralized Styles (`/.postcssrc`)
Parcel automatically cascades upward to resolve config files. Keeping this single file at the root configures Tailwind v4 globally for all applications without duplicating configs in every single subfolder.
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 3. Base Application Recipe Template (`/packages/*/package.json`)
All 4 apps use this clean configuration structure. Each app manages its own target builds, dependencies, and independent packages.
```json
{
  "name": "bhojanalaya", 
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "parcel index.html",
    "build": "parcel build index.html"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "tailwindcss": "^4.3.3",
    "@react-rewind/shared-utils": "*"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "parcel": "^2.16.4"
  }
}
```

---

## 🚀 Daily Development Workflow

When working in this monorepo environment, follow these execution patterns:

### 1. Initial Setup / Dependency Rebuilding
Always run installation commands from the **root directory**. Npm automatically crawls all `packages/*` subfolders, resolves local dependency conflicts, and creates active symlinks for the shared utility library behind the scenes.
```bash
# Clear structural caches and node modules if rearranging workspace configurations
rm -rf node_modules package-lock.json packages/**/node_modules .parcel-cache packages/**/.parcel-cache dist packages/**/dist

# Install and build the absolute ecosystem links
npm install
```

### 2. Launching an Application
You never need to navigate (`cd`) deep into application subfolders to run development environments. Fire up specific projects from your main root directory terminal using workspace target configurations:
```bash
# To run Food Delivery Based Application
npm run start:bhojanalaya

```

### 3. Asset & Resource Scope Isolation
* Place public assets (logos, pictures, local favicons) inside the application's local `/public` folder path.
* Reference assets locally via relative layouts (e.g., `<img src="./public/banner.jpg" />`). Parcel will automatically capture, process, and optimize these files on compile execution.

---

