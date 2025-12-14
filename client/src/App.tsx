import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "@/routes/index"

const router = createBrowserRouter(routes)

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App;