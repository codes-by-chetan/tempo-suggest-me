import AuthService from "@/services/auth.service";
import { toast } from "@/services/toast.service";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface User {
  _id: string;
  fullName: FullName;
  email: string;
  contactNumber: ContactNumber;
  role: string;
  fullNameString: string;
  avatar?: {
    url: string;
    publicId: string;
  };
}

interface ContactNumber {
  countryCode: string;
  number: string;
  _id: string;
  id: string;
}

interface FullName {
  firstName: string;
  lastName: string;
  _id: string;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  googleLogin: (token: string) => Promise<boolean>;
  facebookLogin: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshAuthState: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authService = new AuthService();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuthState = useCallback(async () => {
    setIsLoading(true);
    const storedAuth = localStorage.getItem("token");
    console.log("Stored auth token:", storedAuth);

    if (storedAuth) {
      await authService.refreshUserDetails().then((res) => {
        if (res.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          console.log("User details refreshed:", res.data.user);
        } else {
          console.error("Error parsing stored user:", res.message);
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          setUser(null);
          setIsAuthenticated(false);
        }
      });
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshAuthState();
  }, [refreshAuthState]);

  const login = async (email: string, password: string) => {
    console.log("Login attempt with:", { email, password });

    const success = await authService
      .login({ email, password })
      .then((res) => {
        if (res.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("tokenExpiry", res.data.expiryTime);
          setUser(res.data.user);
          setIsAuthenticated(true);
          refreshAuthState();
          return true;
        } else {
          toast.error(res.message || "Login Failed");
          return false;
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Login Failed");
        return false;
      });
    return success;
  };

  const signup = async (data: any) => {
    console.log("Signup attempt with:", data);

    const success = await authService
      .register(data)
      .then((res) => {
        if (res.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("tokenExpiry", res.data.expiryTime);
          setUser(res.data.user);
          setIsAuthenticated(true);
          return true;
        } else {
          toast.error(res.message || "Signup Failed");
          return false;
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Signup Failed");
        return false;
      });
    return success;
  };

  const googleLogin = async (token: string) => {
    console.log("Google login attempt with token:", token);

    const success = await authService
      .verifySocialToken("google", token)
      .then((res) => {
        if (res.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("tokenExpiry", res.data.expiryTime);
          setUser(res.data.user);
          setIsAuthenticated(true);
          refreshAuthState();
          return true;
        } else {
          toast.error(res.message || "Google Login Failed");
          return false;
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Google Login Failed");
        return false;
      });
    return success;
  };

  const facebookLogin = async (token: string) => {
    console.log("Facebook login attempt with token:", token);

    const success = await authService
      .verifySocialToken("facebook", token)
      .then((res) => {
        if (res.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("tokenExpiry", res.data.expiryTime);
          setUser(res.data.user);
          setIsAuthenticated(true);
          refreshAuthState();
          return true;
        } else {
          toast.error(res.message || "Facebook Login Failed");
          return false;
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Facebook Login Failed");
        return false;
      });
    return success;
  };

  const logout = async () => {
    await authService.logout().then((res) => {
      if (res) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        googleLogin,
        facebookLogin,
        logout,
        refreshAuthState,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
