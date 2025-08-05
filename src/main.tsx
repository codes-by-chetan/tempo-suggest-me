import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./lib/theme-context";
import { AuthProvider } from "./lib/auth-context";

import { TempoDevtools } from "tempo-devtools";
import { NotificationProvider } from "./lib/notification-context.tsx";
import { SocketProvider } from "./lib/socket-context.tsx";
import { ChatProvider } from "./lib/chat-context.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from "./config/env.config.ts";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <ChatProvider>
            <BrowserRouter basename={basename}>
              <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                <App />
              </GoogleOAuthProvider>
            </BrowserRouter>
          </ChatProvider>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  </ThemeProvider>
);
