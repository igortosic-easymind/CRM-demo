import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LeadFilter({ value, onChange, className }: LeadFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Filter by lead status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All Leads</SelectItem>
        <SelectItem value="cold">Cold</SelectItem>
        <SelectItem value="warm">Warm</SelectItem>
        <SelectItem value="hot">Hot</SelectItem>
      </SelectContent>
    </Select>
  );
}
