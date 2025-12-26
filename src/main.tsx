import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize theme before render to prevent flash
const initTheme = () => {
    const saved = localStorage.getItem('prism-theme');
    if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
    } else {
        // Use system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
};

initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
