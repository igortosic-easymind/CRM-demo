// src/app/clients/page.tsx
"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientList } from "@/components/clients/list/ClientList";

export default function ClientsPage() {
  return (
    <DashboardLayout>
      <ClientList />
    </DashboardLayout>
  );
}
