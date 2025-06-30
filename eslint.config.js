// eslint.config.js

import globals from "globals";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import unicorn from 'eslint-plugin-unicorn';

export default defineConfig([
    {
        ignores: [
            "vendor/**/*",
            "node_modules/**/*",
            "public/**/*",
            "storage/**/*",
        ],
    },
    {
        files: ["*.config.js", "tailwind.config.js", "**/*.config.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module", // or 'script' if not using ESM in config files
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            unicorn,
        },
        rules: {
            ...js.configs.recommended.rules,

            // ✅ Disallow console.log
            "no-console": ["warn", { allow: ["warn", "error"] }],

            // ✅ Disallow TODO/FIXME comments
            "no-warning-comments": [
                "warn",
                { terms: ["todo", "fixme"], location: "start" },
            ],
        },
    },
    {
        files: ["**/*.{js,jsx}"],
        plugins: {
            react,
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            "react/no-unescaped-entities": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
