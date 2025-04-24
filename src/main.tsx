import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./lib/theme-context";
import { AuthProvider } from "./lib/auth-context";

import { TempoDevtools } from "tempo-devtools";
import { NotificationProvider } from "./lib/notification-context.tsx";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
