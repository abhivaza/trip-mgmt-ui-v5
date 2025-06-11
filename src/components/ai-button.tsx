"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would typically call your AI generation function
      console.log("AI content generated!");
    }, 2000);
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating}
      className={cn(
        "relative w-full py-4 px-6 rounded-xl font-medium text-gray-800 shadow-lg",
        "transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-pink-200",
        "bg-linear-to-r from-[#ffe4e6] to-[#dbeafe]",
        "before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-r before:from-[#dbeafe] before:to-[#ffe4e6]",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:z-[-1]",
        "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100",
        "border-2 border-gray-300 shadow-[inset_0_-4px_6px_rgba(0,0,0,0.1)]"
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>Generate AI Content</span>
          </>
        )}
      </span>
    </button>
  );
}
