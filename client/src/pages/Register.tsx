import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Building2 } from "lucide-react";
import { motion as m, AnimatePresence } from "motion/react";
import type { Role } from "@/types";

export default function Register() {
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [employeeId, setEmployeeId] = useState("");
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, fatherName, email, password, role, employeeId: role === "employee" ? employeeId : undefined })
      .then((ok) => {
        if (ok) {
          toast({ title: "Account created", description: "Welcome!" });
          navigate(role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
        } else {
          toast({ title: "Signup failed", description: "Please check your details.", variant: "destructive" });
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Employee Management
          </CardTitle>
          <CardDescription>Sign up to create your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                placeholder="Enter your father's name..."
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </m.div>
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </m.div>
            <AnimatePresence mode="wait">
              {role === "employee" && (
                <m.div
                  exit={{ opacity: 0, scale: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    placeholder="Enter your employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </m.div>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p>Admin: admin@company.com / admin123</p>
              <p>Employee: john@company.com / employee123</p>
            </div>
            <div className="text-center">
              <p>
                Already have an account?{" "}
                <NavLink className={"ml-1 text-primary"} to={"/login"}>
                  Sign-in
                </NavLink>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
