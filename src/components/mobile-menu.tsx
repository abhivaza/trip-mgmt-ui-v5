"use client";

import { Button } from "@/components/ui/button";
import { LogIn, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  signOut: () => Promise<void>;
  openLoginDialog: () => void;
}

export default function MobileMenu({
  signOut,
  openLoginDialog,
}: MobileMenuProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 md:hidden" align="end">
        <div className="flex flex-col py-2">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                Hi, {userName}
              </div>
              <Link
                to="/app/trips"
                className="hidden px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                onClick={handleLinkClick}
              >
                My Trips
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-start px-4 py-2 h-auto font-medium"
                onClick={() => {
                  signOut();
                  handleLinkClick();
                }}
              >
                <LogIn className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start px-4 py-2 h-auto font-medium"
              onClick={() => {
                openLoginDialog();
                handleLinkClick();
              }}
            >
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
