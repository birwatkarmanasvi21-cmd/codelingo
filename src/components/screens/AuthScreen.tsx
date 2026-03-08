import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGame } from "@/contexts/GameContext";
import type { UserProfile } from "@/types/game";
import {
  signUp,
  confirmSignUp,
  signIn,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type AuthMode = "signup" | "confirm" | "signin";

async function fetchUserProfile(email: string) {
  const response = await fetch(
    "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "get-user-profile",
        email,
      }),
    },
  );

  const data = await response.json();
  return typeof data.body === "string" ? JSON.parse(data.body) : data;
}

export function AuthScreen() {
  const { userProfile, setUserProfile, completeOnboarding } = useGame();
  const [name, setName] = useState(userProfile?.name ?? "");
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCode = confirmationCode.trim();

    if (authMode === "signup") {
      if (!trimmedName || !trimmedEmail || !trimmedPassword) return;
    } else if (authMode === "confirm") {
      if (!trimmedEmail || !trimmedCode) return;
    } else if (authMode === "signin") {
      if (!trimmedEmail || !trimmedPassword) return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (authMode === "signup") {
        await signUp({
          username: trimmedEmail,
          password: trimmedPassword,
          options: {
            userAttributes: {
              email: trimmedEmail,
              name: trimmedName,
            },
          },
        });

        setAuthMode("confirm");
      } else if (authMode === "confirm") {
        await confirmSignUp({
          username: trimmedEmail,
          confirmationCode: trimmedCode,
        });

        setAuthMode("signin");
      } else if (authMode === "signin") {
        try {
          await getCurrentUser();
          await signOut();
        } catch {
          // Ignore if there is no current user or sign-out fails
        }

        const signInResult = await signIn({
          username: trimmedEmail,
          password: trimmedPassword,
        });

        if (!signInResult.isSignedIn) {
          setError("Additional authentication is required to sign in.");
          return;
        }

        const attributes = await fetchUserAttributes();

        let remoteProfile: any = null;
        try {
          remoteProfile = await fetchUserProfile(trimmedEmail);
        } catch {
          remoteProfile = null;
        }

        const onboardingComplete =
          (remoteProfile?.onboardingComplete as boolean | undefined) ??
          false;

        const profile: UserProfile & {
          onboardingComplete: boolean;
          language?: string;
          level?: string;
          goal?: string;
          dailyTime?: number;
        } = {
          id: trimmedEmail,
          name: attributes.name || trimmedName || trimmedEmail,
          email: attributes.email || trimmedEmail,
          onboardingComplete,
          language: remoteProfile?.language,
          level: remoteProfile?.level,
          goal: remoteProfile?.goal,
          dailyTime: remoteProfile?.dailyTime,
        };

        const payload = {
          name: profile.name,
          email: profile.email,
          role: "player",
        };

        try {
          await fetch(`${API_BASE}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch {
          // If the backend is unreachable, proceed with local profile only.
        }

        try {
          await fetch(
            "https://r2yweyjn7f.execute-api.us-east-1.amazonaws.com/prod/interview",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "register",
                name: profile.name,
                email: profile.email,
              }),
            },
          );
        } catch {
          // Ignore if AWS call fails — app should still work.
        }

        setUserProfile(profile);

        if (onboardingComplete) {
          const level = profile.level === "intermediate" || profile.level === "advanced" ? profile.level : "beginner";
          completeOnboarding({
            language: profile.language ?? "",
            level,
            goal: profile.goal ?? "",
            dailyTime: profile.dailyTime ?? 10,
          });
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignup = authMode === "signup";
  const isConfirm = authMode === "confirm";
  const isSignin = authMode === "signin";

  const isFormValid =
    (isSignup &&
      !!name.trim() &&
      !!email.trim() &&
      !!password.trim()) ||
    (isConfirm && !!email.trim() && !!confirmationCode.trim()) ||
    (isSignin && !!email.trim() && !!password.trim());

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Welcome to Codelingo</h1>
          <p className="text-muted-foreground text-sm">
            Tell us a bit about you so we can personalize your journey.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            {(isSignup || isSignin) && (
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  disabled={isSubmitting}
                />
              </div>
            )}

            {isConfirm && (
              <div className="space-y-2">
                <label
                  className="text-sm font-medium"
                  htmlFor="confirmationCode"
                >
                  Confirmation Code
                </label>
                <Input
                  id="confirmationCode"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold game-button"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting
                ? authMode === "signup"
                  ? "Signing up..."
                  : authMode === "confirm"
                    ? "Confirming..."
                    : "Signing in..."
                : authMode === "signup"
                  ? "Sign up"
                  : authMode === "confirm"
                    ? "Confirm"
                    : "Sign in"}
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              {(isSignup || isConfirm) && (
                <button
                  type="button"
                  className="underline underline-offset-2 font-medium"
                  onClick={() => setAuthMode("signin")}
                  disabled={isSubmitting}
                >
                  Already have an account? Sign in
                </button>
              )}
              {isSignin && (
                <button
                  type="button"
                  className="underline underline-offset-2 font-medium"
                  onClick={() => setAuthMode("signup")}
                  disabled={isSubmitting}
                >
                  Don&apos;t have an account? Sign up
                </button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

