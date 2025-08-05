import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import AppName from "@/components/tags/AppName";
import "react-intl-tel-input/dist/main.css";
import IntlTelInput from "react-intl-tel-input";
import "./signup.css";
import { useAuth } from "@/lib/auth-context";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import config from "@/config/env.config";

const formSchema = z
  .object({
    fullName: z.object({
      firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" }),
      lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" }),
    }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    contactNumber: z.object({ countryCode: z.string(), number: z.string() }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpData = z.infer<typeof formSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: {
        firstName: "",
        lastName: "",
      },
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: {
        countryCode: "",
        number: "",
      },
      terms: false,
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

  const onSubmit = async (values: SignUpData) => {
    setIsLoading(true);
    setError(null);
    const { confirmPassword, terms, ...userData } = values;
    try {
      const success = await auth.signup(userData);
      if (success) {
        navigate("/profile");
      } else {
        setError("Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = credentialResponse.credential;
      const success = await auth.googleLogin(token);
      if (success) {
        navigate("/profile");
      } else {
        setError("Google signup failed");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setError("An error occurred during Google signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError(null);
    window.FB.login(
      async (response: any) => {
        if (response.authResponse) {
          try {
            const token = response.authResponse.accessToken;
            const success = await auth.facebookLogin(token);
            if (success) {
              navigate("/profile");
            } else {
              setError("Facebook signup failed");
            }
          } catch (error) {
            console.error("Facebook signup error:", error);
            setError("An error occurred during Facebook signup");
          } finally {
            setIsLoading(false);
          }
        } else {
          setError("Facebook signup cancelled");
          setIsLoading(false);
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-3xl border-none">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              <AppName />
            </CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Input
                              placeholder="First name"
                              className="pl-10"
                              {...field}
                              aria-required="true"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullName.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Input
                              placeholder="Last name"
                              className="pl-10"
                              {...field}
                              aria-required="true"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Input
                              type="email"
                              placeholder="Email address"
                              className="pl-10"
                              {...field}
                              aria-required="true"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IntlTelInput
                              preferredCountries={["us", "in"]}
                              defaultCountry="in"
                              value={field.value.number}
                              placeholder="Phone number"
                              onPhoneNumberChange={(
                                isValid,
                                value,
                                countryData
                              ) =>
                                field.onChange({
                                  countryCode: `+${countryData.dialCode}`,
                                  number: value,
                                })
                              }
                              containerClassName="intl-tel-input w-full"
                              inputClassName="form-control w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-none focus:border-blue-500 dark:border-gray-600 dark:bg-slate-950 dark:text-white dark:focus:border-primary-400"
                              aria-required="true"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="pl-10 pr-10"
                              {...field}
                              aria-required="true"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              className="pl-10 pr-10"
                              {...field}
                              aria-required="true"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-primary">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-required="true"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link
                            to="/terms-of-service"
                            className="text-primary hover:text-primary/90"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy-policy"
                            className="text-primary hover:text-primary/90"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  aria-label="Create account"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
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

              <div className="mt-6 grid grid-cols-2 gap-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setError("Google signup failed");
                    setIsLoading(false);
                  }}
                  width="100%"
                />
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={handleFacebookLogin}
                  aria-label="Sign up with Facebook"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;