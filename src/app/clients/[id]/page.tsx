// src/app/clients/id/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Mail, Phone, Globe, MapPin, Plus } from "lucide-react";
import { getClient, deleteClient } from "@/app/actions/clients";
import { removeClient } from "@/store/clientsSlice";
import { Client } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClientViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "bg-red-500";
      case "warm":
        return "bg-amber-500";
      case "cold":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

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

  const handleDelete = async () => {
    if (!client) return;

    setIsDeleting(true);
    try {
      const result = await deleteClient(client.id);
      if (result.success) {
        dispatch(removeClient(client.id));
        toast({
          title: "Success",
          description: `${client.company_name} has been deleted successfully.`,
        });
        router.push("/clients");
      } else {
        throw new Error(result.error || "Failed to delete client");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{client.company_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getLeadStatusColor(client.lead)}>
                {client.lead.charAt(0).toUpperCase() + client.lead.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">Created {formatDate(client.created_at)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/clients/${client.id}/edit`)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Contact Person:</span>
                  <span>{`${client.first_name} ${client.last_name}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Position:</span>
                  <span>{client.position}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="hover:underline">
                    {client.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.website}
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{client.address}</p>
                    <p>{`${client.city}, ${client.state} ${client.zipcode}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {client.related_name && (
                <div>
                  <h3 className="font-medium mb-1">Related Contact</h3>
                  <p>{client.related_name}</p>
                </div>
              )}
              {client.linkedin_connection && (
                <div>
                  <h3 className="font-medium mb-1">LinkedIn Connection</h3>
                  <p>{client.linkedin_connection}</p>
                </div>
              )}
              {client.comments && (
                <div>
                  <h3 className="font-medium mb-1">Comments</h3>
                  <p className="whitespace-pre-wrap">{client.comments}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact History */}
        <Card>
          <CardHeader>
            <CardTitle>Contact History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {client.first_contact && (
                <div>
                  <h3 className="font-medium mb-1">First Contact</h3>
                  <p>{formatDate(client.first_contact)}</p>
                  {client.description_contact && (
                    <p className="mt-2 text-muted-foreground">{client.description_contact}</p>
                  )}
                </div>
              )}
              {client.date_of_last_contact && (
                <div>
                  <h3 className="font-medium mb-1">Last Contact</h3>
                  <p>{formatDate(client.date_of_last_contact)}</p>
                  {client.description_contact_more && (
                    <p className="mt-2 text-muted-foreground">{client.description_contact_more}</p>
                  )}
                </div>
              )}
              {client.date_of_next_contact && (
                <div>
                  <h3 className="font-medium mb-1">Next Scheduled Contact</h3>
                  <p>{formatDate(client.date_of_next_contact)}</p>
                  {client.follow_up_action && <p className="mt-2 text-muted-foreground">{client.follow_up_action}</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {client.new_business && (
                <div>
                  <h3 className="font-medium mb-1">New Business Opportunities</h3>
                  <p className="whitespace-pre-wrap">{client.new_business}</p>
                </div>
              )}
              {client.recommendation && (
                <div>
                  <h3 className="font-medium mb-1">Recommendations</h3>
                  <p className="whitespace-pre-wrap">{client.recommendation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push(`/tasks/new?clientId=${client.id}`)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* We can add task list here later */}
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {client.company_name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
