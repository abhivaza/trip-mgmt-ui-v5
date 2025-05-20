import type { ReactNode } from "react"
import { ApiProvider } from "./api-provider"
import { AuthProvider } from "./auth-provider"

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <ApiProvider>{children}</ApiProvider>
    </AuthProvider>
  )
}
