// src/app/login/page.tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/app/actions/auth";
import { setLoading, loginSuccess, loginFailure } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset error when user starts typing
  const handleInputChange = () => {
    setError(null);
  };

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }

      setIsLoading(true);
      setError(null);
      dispatch(setLoading(true));

      try {
        const result = await login({ username, password });

        if (result.success && result.user) {
          dispatch(loginSuccess(result.user));
          router.push("/dashboard");
        } else {
          // More specific error message
          const errorMessage =
            result.error === "Failed to fetch user data"
              ? "Unable to access user information. Please try again."
              : "Invalid username or password";

          dispatch(loginFailure(errorMessage));
          setError(errorMessage);
        }
      } catch {
        setError("Unable to connect to the server. Please try again.");
        dispatch(loginFailure("Connection error"));
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    },
    [dispatch, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  className="w-full"
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full pr-10"
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
