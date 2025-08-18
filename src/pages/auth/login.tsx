import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import AppName from "@/components/tags/AppName";
import config from "@/config/env.config";
import FacebookLogin from "@greatsumini/react-facebook-login";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await auth.login(values.email, values.password);
      if (res) {
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("google Login response: ", credentialResponse);

    setIsLoading(true);
    setError(null);
    try {
      const token = credentialResponse.credential;
      const success = await auth.googleLogin(token);
      if (success) {
        navigate("/");
      } else {
        setError("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("An error occurred during Google login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (response: any) => {
    setIsLoading(true);
    setError(null);

    if (response) {
      try {
        const token = response.accessToken;
        const success = await auth.facebookLogin(token);
        if (success) {
          navigate("/");
        } else {
          setError("Facebook login failed");
        }
      } catch (error) {
        console.error("Facebook login error:", error);
        setError("An error occurred during Facebook login");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Facebook login cancelled");
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: config.GOOGLE_CLIENT_ID,
        callback: handleGoogleSuccess,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if ( !auth.isLoading && !auth.isAuthenticated) {
      setTimeout(() => {
        window.google.accounts.id.prompt();
      }, 5000);
    }
  }, [auth.isAuthenticated]);

  const handleGoogleLoginClick = () => {
    window.google.accounts.id.prompt(); // This shows the popup manually
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            <AppName />
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/90"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="flex-shrink-0 p-6 pt-4 space-y-4 border-t border-border">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-1 w-full items-center">
              <div className="relative w-[201px]">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleGoogleLoginClick()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </div>
              <div className="relative w-[201px]">
                <FacebookLogin
                  appId={config.FACEBOOK_APP_ID}
                  onSuccess={handleFacebookLogin}
                  onFail={(error) => {
                    console.log("Login Failed!", error);
                    setError("Facebook login failed");
                    setIsLoading(false);
                  }}
                >
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Sign in with Facebook
                  </Button>
                </FacebookLogin>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
