// src/components/clients/list/Filters.tsx
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setLeadFilter } from "@/store/clientsSlice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LeadStatus } from "@/types";

export function Filters() {
  const dispatch = useDispatch();
  const leadFilter = useSelector((state: RootState) => state.clients.filters.lead);

  const handleLeadChange = (value: string) => {
    // If "all", set to undefined, otherwise cast to LeadStatus
    dispatch(setLeadFilter(value === "all" ? undefined : (value as LeadStatus)));
  };

  const clearFilters = () => {
    dispatch(setLeadFilter(undefined));
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={leadFilter || "all"} onValueChange={handleLeadChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by lead status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Leads</SelectItem>
          <SelectItem value="cold">Cold</SelectItem>
          <SelectItem value="warm">Warm</SelectItem>
          <SelectItem value="hot">Hot</SelectItem>
        </SelectContent>
      </Select>

      {leadFilter && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
