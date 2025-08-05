"use client";

import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "./components/ui/spinner";
import { Toaster } from "./components/ui/toaster";
import { Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import ErrorPage from "./components/errorPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContentDetailsForm from "./components/suggestions/ContentDetailsForm";
import SuggestionDetails from "./pages/SuggestionDetailsPage";
import Navbar from "./components/layout/Navbar";
import { ScrollArea } from "./components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, useSidebar } from "./lib/sidebar-context";
import { AuthDialogProvider } from "./lib/auth-dialog-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GlobalAuthDialog } from "./components/auth/GlobalAuthDialog";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import MobileTabBar from "./components/layout/MobileTabBar";
import MusicDetailsPage from "./pages/MusicDetailsPage";
import MobileChatConversation from "./pages/chat/mobile-conversation";
import DesktopChatConversation from "./pages/chat/desktop-conversation";
import SearchPage from "./pages/search/search-page";
import Home from "./components/home/home";
import AuthCallback from "./components/auth/AuthCallback";
import TermsOfService from "./pages/policies/terms-of-service";
import PrivacyPolicy from "./pages/policies/privacy-policy";
import DeleteAccount from "./pages/help/account-deletion";

// Lazy load routes for better performance
const SuggestedToMe = lazy(() => import("./pages/suggested-to-me"));
const MySuggestions = lazy(() => import("./pages/my-suggestions"));
const MyWatchlist = lazy(() => import("./pages/my-watchlist"));
const Profile = lazy(() => import("./pages/profile"));
const EditProfile = lazy(() => import("./pages/edit-profile"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ContentDetailsPage = lazy(() => import("./pages/ContentDetailsPage"));
const BookDetailsPage = lazy(() => import("./pages/BookDetailsPage"));
const ChatPage = lazy(() => import("./pages/chat"));

// Explore pages
const ExploreTrending = lazy(() => import("./pages/explore/Trending"));
const ExploreFriends = lazy(() => import("./pages/explore/FriendActivity"));
const ExploreRecommended = lazy(() => import("./pages/explore/Recommended"));

function MainContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { collapsed } = useSidebar();
  const tempoEnabled = import.meta.env.VITE_TEMPO === "true";
  const tempoRoutes = useRoutes(routes);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    if (scrollRef.current) {
      const scrollableElement = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollableElement) {
        scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location.pathname]);

  if (isMobile) {
    return (
      <ScrollArea className="w-full h-[92vh]" ref={scrollRef}>
        <motion.div
          className=""
          initial={false}
          animate={{
            marginLeft: isMobile ? "0" : collapsed ? "0.5rem" : "1rem",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Navbar />
          <main className="flex items-center justify-center pb-10 mt-4">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suggested-to-me"
                element={
                  <ProtectedRoute>
                    <SuggestedToMe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suggested-to-me/suggestion/:suggestionId"
                element={
                  <ProtectedRoute>
                    <SuggestionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-suggestions"
                element={
                  <ProtectedRoute>
                    <MySuggestions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-watchlist"
                element={
                  <ProtectedRoute>
                    <MyWatchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id?"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/content/:id" element={<ContentDetailsPage />} />
              <Route path="/movies/:id" element={<ContentDetailsPage />} />
              <Route path="/series/:id" element={<ContentDetailsPage />} />
              <Route path="/books/:id" element={<BookDetailsPage />} />
              <Route path="/music/:id" element={<MusicDetailsPage />} />
              <Route path="/videos/:id" element={<ContentDetailsPage />} />
              <Route path="/explore/trending" element={<ExploreTrending />} />
              <Route path="/explore/friends" element={<ExploreFriends />} />
              <Route
                path="/explore/recommended"
                element={<ExploreRecommended />}
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              >
                <Route
                  path=":chatId"
                  element={
                    isMobile ? (
                      <MobileChatConversation />
                    ) : (
                      <DesktopChatConversation />
                    )
                  }
                />
              </Route>
              <Route
                path="/add-content/:contentType"
                element={
                  <div className="container mx-auto py-8">
                    <ContentDetailsForm
                      onSubmit={(data) => {
                        window.history.back();
                      }}
                      onBack={() => window.history.back()}
                    />
                  </div>
                }
              />
              <Route path="*" element={<ErrorPage />} />
              {tempoEnabled && <Route path="/tempobook/*" />}
            </Routes>
            {tempoRoutes}
          </main>
        </motion.div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="w-full md:min-h-full h-[82%]" ref={scrollRef}>
      <motion.div
        className=""
        initial={false}
        animate={{
          marginLeft: isMobile ? "0" : collapsed ? "0.5rem" : "1rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <main className="flex items-center justify-center pb-10 my-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suggested-to-me"
              element={
                <ProtectedRoute>
                  <SuggestedToMe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suggested-to-me/suggestion/:suggestionId"
              element={
                <ProtectedRoute>
                  <SuggestionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-suggestions"
              element={
                <ProtectedRoute>
                  <MySuggestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-watchlist"
              element={
                <ProtectedRoute>
                  <MyWatchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id?"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/help/account/delete-account" element={<DeleteAccount />} />
            <Route path="/content/:id" element={<ContentDetailsPage />} />
            <Route path="/movies/:id" element={<ContentDetailsPage />} />
            <Route path="/series/:id" element={<ContentDetailsPage />} />
            <Route path="/books/:id" element={<BookDetailsPage />} />
            <Route path="/music/:id" element={<MusicDetailsPage />} />
            <Route path="/videos/:id" element={<ContentDetailsPage />} />
            <Route path="/explore/trending" element={<ExploreTrending />} />
            <Route path="/explore/friends" element={<ExploreFriends />} />
            <Route
              path="/explore/recommended"
              element={<ExploreRecommended />}
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            >
              <Route
                path=":chatId"
                element={
                  isMobile ? (
                    <MobileChatConversation />
                  ) : (
                    <DesktopChatConversation />
                  )
                }
              />
            </Route>
            <Route
              path="/add-content/:contentType"
              element={
                <div className="container mx-auto py-8">
                  <ContentDetailsForm
                    onSubmit={(data) => {
                      window.history.back();
                    }}
                    onBack={() => window.history.back()}
                  />
                </div>
              }
            />
            <Route path="*" element={<ErrorPage />} />
            {tempoEnabled && <Route path="/tempobook/*" />}
          </Routes>
          {tempoRoutes}
        </main>
      </motion.div>
    </ScrollArea>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthDialogProvider>
      <div className="flex bg-background">
        <Toaster />
        <GlobalAuthDialog />
        <Suspense fallback={<LoadingSpinner />}>
          <SidebarProvider>
            {isMobile ? (
              <div className="hide-scroll min-w-full h-screen max-h-svh overflow-auto">
                <MainContent />
                <MobileTabBar />
              </div>
            ) : (
              <div className="flex hide-scroll flex-col flex-1 h-screen max-h-svh overflow-hidden md:overflow-auto">
                <Navbar />
                <div className="flex flex-col md:flex-row !w-full min-h-[105vh] max-h-[105vh] md:min-h-[92vh] md:max-h-[100vh] pt-0">
                  <DesktopSidebar />
                  <div className="w-full flex-1 min-h-[100%] max-h-[100%]">
                    <MainContent />
                  </div>
                </div>
              </div>
            )}
          </SidebarProvider>
        </Suspense>
      </div>
    </AuthDialogProvider>
  );
}

export default App;
