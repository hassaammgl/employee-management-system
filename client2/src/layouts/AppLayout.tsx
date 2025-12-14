// import { SidebarProvider } from "@/components/ui/sidebar";
// import { Topbar } from "./Topbar";
// import { Sidebar } from "./Sidebar";
// import { Outlet, Navigate } from "react-router";
// // import { ModeToggle } from "@/components/mode-toggle";

// const AppLayout = () => {
//   //  const { isAuthenticated } = useAuthStore();
//   const isAuthenticated = true;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <SidebarProvider className="flex h-screen w-full bg-background">
//       <Sidebar />
//       <div className="flex flex-1 flex-col pl-64">
//         <Topbar />
//         <main className="flex-1 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default AppLayout;


import { SidebarProvider } from "@/components/ui/sidebar";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "@/store/auth";

const AppLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider className="min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-0">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

