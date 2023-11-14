import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
ReactGA.initialize('G-0KMJRECLV1');

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        ReactGA.pageview(window.location.pathname + window.location.search);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
