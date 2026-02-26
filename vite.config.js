import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [laravel({
        input: 'resources/js/app.jsx',
        refresh: true,
    }), react(), {
        name: '@mui/styles',
        plugin: () => {}
    }, sentryVitePlugin({
        org: "gold-tiger-logistics-soluti-wt",
        project: "gtrs-frontend"
    })],

    optimizeDeps: {
        exclude: ['js-big-decimal']
      },

    build: {
        sourcemap: true
    }
});