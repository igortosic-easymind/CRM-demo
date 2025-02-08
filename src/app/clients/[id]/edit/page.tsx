// src/app/clients/id/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ClientForm from "@/components/clients/form/ClientForm";
import { getClient } from "@/app/actions/clients";
import { Client } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditClientPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const result = await getClient(resolvedParams.id);
        if (result.success && result.data) {
          setClient(result.data);
        } else {
          setError(result.error || "Failed to load client");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error || "Client not found"}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Client: {client.company_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientForm mode="edit" initialData={client} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
