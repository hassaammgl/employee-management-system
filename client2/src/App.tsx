import { ThemeProvider } from "@/components/theme-provider";
import { RouterProvider, createBrowserRouter } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import routes from "@/routes";
import { Toaster } from "sonner";

const router = createBrowserRouter(routes);

function App() {
  const me = useAuthStore((s) => s.me);

  useEffect(() => {
    me();
  }, [me]);
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

export default App;
