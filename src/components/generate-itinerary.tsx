"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Sparkles } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../context/auth-provider"
import { useApi } from "../context/api-provider"
import type { Itinerary } from "../types/itinerary"
import { TRY_AGAIN_TEXT } from "../lib/app-utils"
import { AI_TRIP_PROMPTS } from "../constants/ai-trip-prompts"

export const GenerateItinerary = () => {
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(null)
  const tickerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const api = useApi()
  const [showPrompts, setShowPrompts] = useState([{ title: "", prompt: "" }])

  useEffect(() => {
    setShowPrompts(AI_TRIP_PROMPTS.sort(() => 0.5 - Math.random()).slice(0, 5))
  }, [])

  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    let animationId: number
    let position = 0

    const animate = () => {
      position -= 0.5

      if (position < -ticker.scrollWidth / 2) {
        position = 0
      }

      ticker.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleGenerateItinerary = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate an itinerary.",
        variant: "destructive",
      })
      return
    }
    if (!destination) {
      toast({
        title: "Destination required",
        description: "Please enter a destination for your trip.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const itineraryData = await api.post<{ destination: string }, Itinerary>("/app/trip/generate", {
        destination: destination,
      })

      if (itineraryData?.itinerary?.length == 0 || itineraryData.message != "SUCCESS") {
        toast({
          title: "Error",
          description: "Invalid destination." + " " + TRY_AGAIN_TEXT,
          variant: "destructive",
        })
      } else {
        navigate(`/app/trip/${itineraryData?.id}`)
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate itinerary." + " " + TRY_AGAIN_TEXT,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (index: number) => {
    setActivePromptIndex(index)
    setDestination(showPrompts[index].prompt)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="relative rounded-md">
        <textarea
          placeholder="5 days kid friendly tour of New York city... (Or pick example prompts from below and customize)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleGenerateItinerary()
            }
          }}
          className="w-full p-3 rounded-lg focus:outline-none resize-none"
          rows={3}
        />

        <div className="overflow-hidden bg-white rounded-lg p-2">
          <div className="relative overflow-hidden text-xs">
            <div ref={tickerRef} className="flex whitespace-nowrap" style={{ willChange: "transform" }}>
              {[...showPrompts, ...showPrompts].map((prompt, index) => (
                <div
                  key={index}
                  onClick={() => handlePromptClick(index % showPrompts.length)}
                  className={`
                    inline-block px-3 py-1 mr-3 rounded-full cursor-pointer transition-colors
                    ${
                      activePromptIndex === index % showPrompts.length
                        ? `bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-md`
                        : `bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 hover:text-gray-800`
                    }
                  `}
                >
                  {prompt.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <Button onClick={handleGenerateItinerary} disabled={isLoading}>
            {!isLoading && <Sparkles className="h-4 w-4 mr-1" />}
            {isLoading ? "Generating..." : "Let's go"}
          </Button>
        </div>
      </div>
    </div>
  )
}
