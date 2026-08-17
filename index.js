import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './17-08-26-react-basics/App';

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<App/>)
