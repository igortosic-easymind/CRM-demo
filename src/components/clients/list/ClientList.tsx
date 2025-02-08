"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLoading, setClients, setError, removeClient, setPagination } from "@/store/clientsSlice";
import { listClients, deleteClient } from "@/app/actions/clients";
import { SearchBar } from "./SearchBar";
import { Filters } from "./Filters";
import { ClientTable } from "./ClientTable";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeleteConfirmationDialog } from "../../DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types";

export function ClientList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { list: clients, loading, error, filters, pagination } = useSelector((state: RootState) => state.clients);

  // Use a ref to track if this is the initial mount
  const [isInitialMount, setIsInitialMount] = useState(true);

  const loadClients = useCallback(async () => {
    // Skip the initial server-side fetch if we already have clients
    if (isInitialMount && clients.length > 0) {
      setIsInitialMount(false);
      return;
    }

    try {
      dispatch(setLoading({ operation: "list", isLoading: true }));
      dispatch(setError(null));

      const result = await listClients({
        lead: filters.lead,
        search: filters.searchTerm,
        page: pagination.currentPage,
        itemsPerPage: pagination.itemsPerPage,
      });

      if (result.success && result.data) {
        dispatch(setClients(result.data));
        dispatch(setPagination(result.pagination));
      } else {
        dispatch(setError(result.error || "Failed to load clients"));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : "An unexpected error occurred"));
    } finally {
      dispatch(setLoading({ operation: "list", isLoading: false }));
      setIsInitialMount(false);
    }
  }, [
    dispatch,
    filters.lead,
    filters.searchTerm,
    clients.length,
    isInitialMount,
    pagination.currentPage,
    pagination.itemsPerPage,
  ]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleViewClient = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    router.push(`/clients/${client.id}/edit`);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      dispatch(setLoading({ operation: "delete", isLoading: true }));
      const result = await deleteClient(clientToDelete.id);

      if (result.success) {
        dispatch(removeClient(clientToDelete.id));
        toast({
          title: "Success",
          description: `${clientToDelete.company_name} has been deleted successfully.`,
        });
      } else {
        throw new Error(result.error || "Failed to delete client");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      dispatch(setLoading({ operation: "delete", isLoading: false }));
      setClientToDelete(null);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ ...pagination, currentPage: page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => router.push("/clients/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar />
        <Filters />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-md border">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-sm text-muted-foreground">{pagination.totalItems} clients found</div>
          <Button variant="ghost" size="sm" onClick={loadClients} disabled={loading.list}>
            <RefreshCw className={`h-4 w-4 ${loading.list ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <ClientTable
          clients={clients}
          onView={handleViewClient}
          onEdit={handleEditClient}
          onDelete={handleDeleteClick}
          loading={loading.delete}
        />

        <div className="p-4 border-t">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            disabled={loading.list}
          />
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client"
        description={`Are you sure you want to delete ${clientToDelete?.company_name}? This action cannot be undone.`}
      />
    </div>
  );
}
