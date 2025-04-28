import { Suspense, lazy, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import ErrorPage from "./components/errorPage";
import { useAuth } from "./lib/auth-context";
import AuthService from "./services/auth.service";
import { getToast } from "./services/toasts.service";
import NotificationsPage from "./pages/NotificationsPage";
// Lazy load routes for better performance
const SuggestedToMe = lazy(() => import("./pages/suggested-to-me"));
const MySuggestions = lazy(() => import("./pages/my-suggestions"));
const MyWatchlist = lazy(() => import("./pages/my-watchlist"));
const Profile = lazy(() => import("./pages/profile"));
const EditProfile = lazy(() => import("./pages/edit-profile"));
const Login = lazy(() => import("./pages/auth/login"));
const Signup = lazy(() => import("./pages/auth/signup"));
const ContentDetailsPage = lazy(() => import("./pages/ContentDetailsPage"));

// Explore pages
const ExploreTrending = lazy(() => import("./pages/explore/Trending"));
const ExploreFriends = lazy(() => import("./pages/explore/FriendActivity"));
const ExploreRecommended = lazy(() => import("./pages/explore/Recommended"));


function App() {
  // const authProvider = useAuth();
  // const authService = new AuthService();
  // const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

  //   useEffect(()=>{
     
  //       authService.isAuthenticated().then((response)=>{
          
  //           authProvider.refreshAuthState()
          
  //       }).catch((_err)=>{
  //         // setResult(false)
  //         getToast("error", _err.message)
  //       })
      
  //   },[])
  //   if (!result) {
  //     authService.logout()
  //   }
  //   return result ? children : <Navigate to="/auth/login" />;
  // };
  // const CanAccess = ({ children }: { children: JSX.Element }) => {
  //   if(isAuthenticated()) getToast("error", "user is already logged in")
  //   return !isAuthenticated() ? children : <Navigate to="/" />;
  // };
  
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
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/content/:id" element={<ContentDetailsPage />} />
          <Route path="/explore/trending" element={<ExploreTrending />} />
          <Route path="/explore/friends" element={<ExploreFriends />} />
          <Route path="/explore/recommended" element={<ExploreRecommended />} />
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
