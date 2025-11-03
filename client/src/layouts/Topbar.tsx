import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { LogOut, Settings2, User } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-16 w-full flex items-center justify-between px-4 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger variant="outline" />
        <h2 className="font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar>
                <AvatarFallback>
                  U{/* {user?.username?.charAt(0) || "U"} */}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col justify-center space-y-1">
                <span className="flex">
                  <Avatar>
                    <AvatarFallback className="text-md">
                      {/* {user?.username?.charAt(0)?.toUpperCase() || "U"} */}U
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 flex justify-center items-start flex-col">
                    <p className="text-sm font-medium leading-none mb-1">
                      {/* {user?.username} */}
                      Abcs
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {/* {user?.email} */}
                      abc@xyz.com
                    </p>
                  </span>
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <NavLink to="/profile">
              <DropdownMenuItem>
                <User className="mr-2 size-4 text-primary" />
                <span>Profile</span>
              </DropdownMenuItem>
            </NavLink>
            <NavLink to="/settings">
              <DropdownMenuItem>
                <Settings2 className="mr-2 size-4 text-primary" />
                <span>Settings</span>
              </DropdownMenuItem>
            </NavLink>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 size-4 text-primary" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Topbar;
