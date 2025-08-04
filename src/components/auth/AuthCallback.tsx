import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/services/toast.service";
import config from "@/config/env.config";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin, facebookLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get("provider");
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error(error || "Social login failed, bhai!");
        navigate("/login");
        return;
      }

      if (!provider || !token) {
        toast.error("Invalid callback parameters, kuch toh gadbad hai!");
        navigate("/login");
        return;
      }

      try {
        let success;
        if (provider === "google") {
          success = await googleLogin(token);
        } else if (provider === "facebook") {
          success = await facebookLogin(token);
        } else {
          toast.error("Unknown provider, yeh kya bakchodi hai?");
          navigate("/login");
          return;
        }

        if (success) {
          toast.success("Login successful, mast kaam kiya!");
          navigate("/profile");
        } else {
          toast.error("Social login failed, try again, bhai!");
          navigate("/login");
        }
      } catch (err) {
        console.error("Callback error:", err);
        toast.error("Something went wrong, bhai! Check console for details.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, googleLogin, facebookLogin, navigate]);

  // Initialize Facebook SDK for potential future use
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Processing, ek minute ruk!</h1>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default AuthCallback;