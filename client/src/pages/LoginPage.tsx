// import { Button } from "@/components/ui/button"
// import { Card,CardTitle,CardHeader,CardFooter,CardDescription, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { ModeToggle } from "@/components/mode-toggle"
// import { NavLink } from "react-router"
// import { Label } from "@/components/ui/label"

// const LoginPage = () => {

//   const handleSubmit = async () => {

//   }

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
//       <div className="fixed top-6 right-6">
//         <ModeToggle />
//       </div>
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold font-serif">
//             <span className="text-primary">Employee</span> Management System
//           </h1>
//           <p className="mt-2 text-muted-foreground">Login to your account</p>
//         </div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Login</CardTitle>
//             <CardDescription>
//               Enter your information to log in your account
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-4 mb-4">
//               <div className="space-y-2">
//                 <Label className="text-bold" htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your-email@example.com"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password **********"
//                   required
//                 />
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4">
//               <Button
//                 type="submit"
//                 className="w-full bg-primary hover:bg-secondary hover:text-white"
//               >
//                 {"Login"}
//               </Button>
//               <p className="text-center text-sm text-muted-foreground">
//                 Don't have an account?{" "}
//                 <NavLink to="/signup" className="text-primary hover:underline hover:text-secondary">
//                   Sign In
//                 </NavLink>
//               </p>
//             </CardFooter>
//           </form>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default LoginPage

import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    console.log("Email:", email);
    console.log("Password:", password);

    // TODO: Add login logic here
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
          <p className="mt-2 text-muted-foreground">Login to your account</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your information to log in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password **********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="text-primary hover:underline hover:text-secondary"
                >
                  Sign Up
                </NavLink>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
