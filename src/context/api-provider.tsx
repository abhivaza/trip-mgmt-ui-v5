"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuth } from "./auth-provider"

const baseUrl = import.meta.env.VITE_API_URL

interface ApiContextType {
  get: <Resp>(url: string) => Promise<Resp>
  post: <Req, Resp>(url: string, data: Req) => Promise<Resp>
  put: <Req, Resp>(url: string, data: Req) => Promise<Resp>
  delete: <Resp>(url: string) => Promise<Resp>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}

export function ApiProvider({ children }: { children: ReactNode }) {
  const { jwtToken } = useAuth()

  const api: ApiContextType = {
    get: async (url: string) => {
      const response = await fetch(`${baseUrl}${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Network response was not ok")
      return response.json()
    },

    post: async <Req, Resp>(url: string, data: Req): Promise<Resp> => {
      const response = await fetch(`${baseUrl}${url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Network response was not ok")
      return response.json()
    },

    put: async <Req, Resp>(url: string, data: Req): Promise<Resp> => {
      const response = await fetch(`${baseUrl}${url}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Network response was not ok")
      return response.json()
    },

    delete: async (url: string) => {
      const response = await fetch(`${baseUrl}${url}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Network response was not ok")
      return response.json()
    },
  }

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}
