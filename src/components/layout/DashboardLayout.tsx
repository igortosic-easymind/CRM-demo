// src/components/layout/DashboardLayout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, UserCircle, Calendar, Settings as SettingsIcon, CheckSquare } from "lucide-react";
import { NavBar } from "./NavBar";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
    },
    {
      name: "Clients",
      icon: UserCircle,
      href: "/clients",
    },
    {
      name: "Tasks",
      icon: CheckSquare, // Import this from lucide-react
      href: "/tasks",
    },
    {
      name: "Calendar",
      icon: Calendar,
      href: "/calendar",
    },
    {
      name: "Settings",
      icon: SettingsIcon,
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-lg">
        <div className="p-4">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold mb-8 cursor-pointer hover:text-gray-600">CRM System</h1>
          </Link>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <NavBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
