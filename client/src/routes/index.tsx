import { lazy } from "react";
import { redirect } from "react-router";
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
import ProfilePage from "@/pages/ProfilePage";
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
import MySuspense from "./MySuspense";
import AdminDashboard from "@/pages/admin/Dashboard";
import EmployeePage from "@/pages/admin/EmployeePage";
import DepartmentPage from "@/pages/admin/DepartmentPage";
import LeavesPage from "@/pages/admin/LeavesPage";

const routes = [
  {
    path: "/",
    loader: () => redirect("/login"),
  },
  {
    path: "/login",
    element: (
      <MySuspense>
        <LoginPage />
      </MySuspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <MySuspense>
        <SignupPage />
      </MySuspense>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <MySuspense>
        <AdminDashboard />
      </MySuspense>
    ),
  },
  {
    path: "/admin/employees",
    element: (
      <MySuspense>
        <EmployeePage />
      </MySuspense>
    ),
  },
  {
    path: "/admin/departments",
    element: (
      <MySuspense>
        <DepartmentPage/>
      </MySuspense>
    ),
  },
  {
    path: "/admin/leaves",
    element: (
      <MySuspense>
        <LeavesPage />
      </MySuspense>
    ),
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;