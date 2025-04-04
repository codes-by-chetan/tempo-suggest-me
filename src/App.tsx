import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ErrorPage from "./components/errorPage";

// Lazy load routes for better performance
const SuggestedToMe = lazy(() => import("./pages/suggested-to-me"));
const MySuggestions = lazy(() => import("./pages/my-suggestions"));
const MyWatchlist = lazy(() => import("./pages/my-watchlist"));
const Profile = lazy(() => import("./pages/profile"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ContentDetailsPage = lazy(() => import("./pages/ContentDetailsPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suggested-to-me" element={<SuggestedToMe />} />
          <Route path="/my-suggestions" element={<MySuggestions />} />
          <Route path="/my-watchlist" element={<MyWatchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/content/:id" element={<ContentDetailsPage />} />
          <Route path="*" element={<ErrorPage />} />

          {/* Allow Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
