import { Client } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ClientTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  loading?: boolean;
}

export function ClientTable({ clients = [], onView, onEdit, onDelete, loading = false }: ClientTableProps) {
  const getLeadStatusColor = (status: string | null) => {
    switch (status) {
      case "hot":
        return "bg-red-500 hover:bg-red-600";
      case "warm":
        return "bg-amber-500 hover:bg-amber-600";
      case "cold":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No clients found
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client) => (
            <TableRow key={`client-${client.id}`}>
              <TableCell className="font-medium">{client.company_name || "N/A"}</TableCell>
              <TableCell>
                {client.first_name || client.last_name ? `${client.first_name || ""} ${client.last_name || ""}` : "N/A"}
              </TableCell>
              <TableCell>{client.email || "N/A"}</TableCell>
              <TableCell>
                <Badge className={getLeadStatusColor(client.lead)}>
                  {client.lead ? client.lead.charAt(0).toUpperCase() + client.lead.slice(1) : "N/A"}
                </Badge>
              </TableCell>
              <TableCell>{client.created_at ? formatDate(client.created_at) : "N/A"}</TableCell>
              <TableCell>{client.date_of_last_contact ? formatDate(client.date_of_last_contact) : "Never"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(client);
                    }}
                    disabled={loading}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(client);
                    }}
                    disabled={loading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(client);
                    }}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
