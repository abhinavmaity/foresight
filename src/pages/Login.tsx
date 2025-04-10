import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Get the path they were trying to access before being redirected to login
  const from = location.state?.from?.pathname || "/";

  // Redirect to home if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Successful",
            description: "Please check your email to verify your account.",
          });
          navigate(from);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Success, navigate to the intended destination
          navigate(from);
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // If still checking auth state, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-primary">
          {isSignUp ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
