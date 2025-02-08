// src/components/layout/NavBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "@/store/authSlice";
import { logout } from "@/app/actions/auth";
import { RootState } from "@/store/store";
import { User, ChevronDown, Settings, LogOut, Plus } from "lucide-react";
// import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Badge } from '@/components/ui/badge';

export function NavBar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      dispatch(logoutAction());
      router.push("/login");
    }
  };

  return (
    <div className="p-4 border-b bg-white flex items-center justify-between gap-4">
      {/* Left side stays the same */}
      <div className="flex items-center gap-6 flex-1">
        {/* <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search..." className="pl-8" />
        </div> */}
        {/* <div className="text-sm text-muted-foreground hidden md:block">
          Dashboard / Clients
        </div> */}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="cursor-pointer">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/clients/new")}>
              Add New Client
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/calendar")}>
              Schedule Meeting
            </DropdownMenuItem>
            {/* <DropdownMenuItem className="cursor-pointer">Create Follow-up</DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/tasks/new")}>
              Create Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative cursor-pointer">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 text-sm font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-medium">Follow-up Due</div>
                <div className="text-sm text-muted-foreground">Acme Corp meeting follow-up</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-medium">Meeting Tomorrow</div>
                <div className="text-sm text-muted-foreground">Tech Solutions proposal review</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{user?.username}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem> */}
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
