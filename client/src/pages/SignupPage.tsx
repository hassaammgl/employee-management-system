import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { NavLink } from "react-router";
import { Label } from "@/components/ui/label";

const SignUpPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    // TODO: Add signup logic here (API / Supabase)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-6 right-6">
        <ModeToggle />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif">
            <span className="text-primary">Employee</span> Management System
          </h1>
          <p className="mt-2 text-muted-foreground">Signup to your account</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="abc@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Signup
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="text-primary hover:underline hover:text-secondary"
                >
                  Login
                </NavLink>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
