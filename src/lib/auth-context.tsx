import AuthService from "@/services/auth.service";
import { getToast } from "@/services/toasts.service";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface User {
  fullName: FullName;
  email: string;
  contactNumber: ContactNumber;
  role: string;
  fullNameString: string;
  avatar?: {
    url: string;
    publicId: string
  }
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
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  logout: () => void;
  refreshAuthState: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authService = new AuthService();
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to refresh auth state from localStorage
  const refreshAuthState = useCallback(async () => {
    const storedAuth = localStorage.getItem("token");

    if (storedAuth === "true") {
      try {
        await authService.refreshUserDetails().then((res)=>{})

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        // Clear invalid data
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Initialize auth state on component mount
  useEffect(() => {
    refreshAuthState();

    // Add storage event listener to sync auth state across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isAuthenticated" || event.key === "user") {
        refreshAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuthState]);

  const login = async (email: string, password: string) => {
    console.log("Login attempt with:", { email, password });

    const success = await authService.login({ email, password }).then((res) => {
      if (res.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        getToast("error", res.message);
        return false;
      }
    });
    return success;
  };

  const signup = async (data: any) => {
    // In a real app, this would be an API call to register the user
    console.log("Signup attempt with:", data);

    // Simulate API call
    const success = await authService.register(data).then((res) => {
      if (res.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        getToast("error", res.message);
        return false;
      }
    });
    return success;
  };

  const logout = () => {
    // Update state first to ensure immediate UI update
    setUser(null);
    setIsAuthenticated(false);

    // Then update localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
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
