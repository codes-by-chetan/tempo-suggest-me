import { Suspense, lazy } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ErrorPage from "./components/errorPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContentDetailsForm from "./components/suggestions/ContentDetailsForm";
import SuggestionDetails from "./pages/SuggestionDetailsPage";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { ScrollArea } from "./components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, useSidebar } from "./lib/sidebar-context";
import DesktopSidebar from "./components/layout/DesktopSidebar";
import MobileTabBar from "./components/layout/MobileTabBar";
import MusicDetailsPage from "./pages/MusicDetailsPage";
import ChatConversation from "./pages/chat/conversation";

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
  const { collapsed } = useSidebar();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const tempoEnabled = import.meta.env.VITE_TEMPO === "true";
  const tempoRoutes = tempoEnabled ? useRoutes(routes) : useRoutes([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <ScrollArea className="w-full md:min-h-full  h-[82%]" ref={scrollRef}>
      <motion.div
        className=""
        initial={false}
        animate={{
          marginLeft: collapsed ? "0.5rem" : "1rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <main className="flex items-center justify-center pb-0 my-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/suggested-to-me" element={<SuggestedToMe />} />
            <Route
              path="/suggested-to-me/suggestion/:suggestionId"
              element={<SuggestionDetails />}
            />
            <Route path="/my-suggestions" element={<MySuggestions />} />
            <Route path="/my-watchlist" element={<MyWatchlist />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
            <Route path="/chat" element={<ChatPage />} children={<Route path="/chat/:chatId" element={<ChatConversation />} />} />
            
            <Route
              path="/add-content/:contentType"
              element={
                <div className="container mx-auto py-8">
                  <ContentDetailsForm
                    onSubmit={(data) => {
                      // getToast("success", "Content added successfully!");
                      window.history.back();
                    }}
                    onBack={() => window.history.back()}
                  />
                </div>
              }
            />
            <Route path="*" element={<ErrorPage />} />

            {/* Allow Tempo routes */}
            {tempoEnabled && <Route path="/tempobook/*" />}
          </Routes>
          {tempoRoutes}
        </main>
      </motion.div>
    </ScrollArea>
  );
}

function App() {
  return (
    <div className="flex   bg-background ">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <SidebarProvider>
          <div className="flex flex-col flex-1 h-screen max-h-svh  overflow-hidden md:overflow-auto">
            <Navbar />
            <div className="flex flex-col md:flex-row !w-full min-h-[105vh] max-h-[105vh] md:min-h-[92vh] md:max-h-[100vh]   pt-2 ">
              <DesktopSidebar />
              <div className="w-full min-h-[100%] max-h-[100%]">
                <MainContent />
              </div>
              <MobileTabBar />
            </div>
          </div>
        </SidebarProvider>
      </Suspense>
    </div>
  );
}

export default App;
