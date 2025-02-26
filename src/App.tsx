import AuthProvider from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import Routes from '@/routes/routes'
import { Toaster } from "sonner"

function App() {
  return (
    <AuthProvider>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes />
      <Toaster richColors closeButton position="top-center" />
    </ThemeProvider>
    </AuthProvider>
  )
}

export default App
