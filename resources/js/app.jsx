import "./bootstrap";
import React from "react";
import "../css/app.css";
import "../css/table.css";
import "../css/sideBar.css";
import "../css/chartsPage.css";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./CommonContext";
ReactGA.initialize("G-0KMJRECLV1");

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (!name) {
            return;
        }
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        ReactGA.pageview(window.location.pathname + window.location.search);
        root.render(
            <BrowserRouter>
                <HeroUIProvider>
                    <ContextProvider>
                        <App {...props} />
                    </ContextProvider>
                </HeroUIProvider>
            </BrowserRouter>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
