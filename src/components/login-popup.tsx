"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "@/firebase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPopup({
  isOpen,
  onClose,
  enablePasswordAuth = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  enablePasswordAuth?: boolean;
}) {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [emailLinkUrl, setEmailLinkUrl] = useState("");

  const handleSuccessfulAuth = () => {
    onClose();
    router.push("/app/trips");
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError("");
      await signInWithPopup(auth, provider);
      handleSuccessfulAuth();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!enablePasswordAuth) {
        await handleMagicLink();
        return;
      }

      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handleSuccessfulAuth();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send password reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const actionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      window.localStorage.setItem("emailForSignIn", email);
      setMagicLinkSent(true);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to send sign in link"
      );
    } finally {
      setLoading(false);
    }
  };

  const completeSignInWithEmailLink = async (email: string, url: string) => {
    try {
      setLoading(true);
      await signInWithEmailLink(auth, email, url);
      window.localStorage.removeItem("emailForSignIn");
      window.history.replaceState(null, "", window.location.pathname);
      setShowEmailConfirmation(false);
      handleSuccessfulAuth();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to complete sign-in"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const emailForSignIn = window.localStorage.getItem("emailForSignIn");

      if (emailForSignIn) {
        completeSignInWithEmailLink(emailForSignIn, window.location.href);
      } else {
        setEmailLinkUrl(window.location.href);
        setShowEmailConfirmation(true);
      }
    }
  }, []);

  const EmailConfirmationPopup = () => (
    <Dialog
      open={showEmailConfirmation}
      onOpenChange={(open) => !open && setShowEmailConfirmation(false)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Email Confirmation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            Please provide your email to complete the sign-in process.
          </p>
          <div className="space-y-2">
            <Label htmlFor="confirmation-email">Email</Label>
            <Input
              id="confirmation-email"
              type="email"
              value={confirmationEmail}
              onChange={(e) => setConfirmationEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              completeSignInWithEmailLink(confirmationEmail, emailLinkUrl)
            }
            disabled={!confirmationEmail || loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Login</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Circle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {magicLinkSent ? (
              <div className="text-center space-y-4">
                <p>Sign in link sent! Check your email to complete sign-in.</p>
                <Button
                  variant="outline"
                  onClick={() => setMagicLinkSent(false)}
                >
                  Back to Login
                </Button>
              </div>
            ) : resetSent ? (
              <div className="text-center space-y-4">
                <p>
                  Password reset email sent! Check your inbox for further
                  instructions.
                </p>
                <Button variant="outline" onClick={() => setResetSent(false)}>
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={signInWithGoogle}
                  disabled={loading}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Enter email to receive sign-in link
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {enablePasswordAuth && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={enablePasswordAuth}
                      />
                    </div>

                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required={enablePasswordAuth}
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading
                        ? "Processing..."
                        : isSignUp
                        ? "Sign Up"
                        : "Sign In"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-primary hover:underline"
                      >
                        {isSignUp
                          ? "Already have an account? Sign In"
                          : "Don't have an account? Sign Up"}
                      </button>
                    </div>
                  </>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleMagicLink}
                  disabled={loading}
                >
                  Send me a link to Sign in
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showEmailConfirmation && <EmailConfirmationPopup />}
    </>
  );
}
