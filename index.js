import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './18-08-26-starting-react/App';

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<App/>)
