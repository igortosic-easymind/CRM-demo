import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressInfoProps {
  data: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function AddressInfo({ data, onChange, disabled }: AddressInfoProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="address">Street Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={data.city} onChange={(e) => onChange("city", e.target.value)} disabled={disabled} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={data.state}
            onChange={(e) => onChange("state", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={data.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
