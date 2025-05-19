import "./bootstrap";
import "../css/app.css";
import "../css/table.css";
import "../css/sideBar.css";
import "../css/chartsPage.css";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./CommonContext";
ReactGA.initialize("G-0KMJRECLV1");

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        ReactGA.pageview(window.location.pathname + window.location.search);
        root.render(
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <NextUIProvider>
                        <ContextProvider>
                            <App {...props} />
                        </ContextProvider>
                    </NextUIProvider>
                </QueryClientProvider>
            </BrowserRouter>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
