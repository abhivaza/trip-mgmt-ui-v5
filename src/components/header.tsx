"use client";

import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CompanyLogo from "./company-logo";
import { useState } from "react";
import { useAuth } from "../context/auth-provider";
import { auth } from "../firebase";
import LoginPopup from "./login-popup";
import MobileMenu from "./mobile-menu";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <header className="py-4 px-4 md:px-8 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl md:text-4xl font-bold">
            <CompanyLogo />
          </Link>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4"></nav>
            {user ? (
              <>
                <Link
                  to="/app/trips"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  My Trips
                </Link>
                <span className="hidden md:flex text-sm font-medium text-muted-foreground mr-2">
                  Hi, {userName}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center"
                  onClick={signOut}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Logout
                </Button>
                <MobileMenu
                  signOut={signOut}
                  openLoginDialog={openLoginDialog}
                />
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="items-center"
                  onClick={openLoginDialog}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <LoginPopup
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </header>
  );
}
