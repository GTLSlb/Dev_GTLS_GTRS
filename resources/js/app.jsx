import "./bootstrap";
import React from "react";
import "../css/app.css";
import "../css/table.css";
import "../css/sideBar.css";
import "../css/chartsPage.css";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
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
            import.meta.glob("./Pages/**/*.jsx"),
        );
    },
    setup({ el, App, props }) {
        Sentry.init({
            dsn: "https://e0d17607912aa642af3ec58da48378bc@o4510894575779840.ingest.de.sentry.io/4510951124500560",
            // Setting this option to true will send default PII data to Sentry.
            // For example, automatic IP address collection on events
            sendDefaultPii: true,
            // to actually see what users were doing before an error
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });

        const root = createRoot(el);
        ReactGA.pageview(window.location.pathname + window.location.search);
        root.render(
            <BrowserRouter>
                <HeroUIProvider>
                    <ContextProvider>
                        <Sentry.ErrorBoundary
                            fallback={<p>An error has occurred</p>}
                        >
                            <App {...props} />
                        </Sentry.ErrorBoundary>
                    </ContextProvider>
                </HeroUIProvider>
            </BrowserRouter>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
