// src/app/clients/new/page.tsx
"use client";

import ClientForm from "@/components/clients/form/ClientForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewClientPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
