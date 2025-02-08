import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { CreateClientData } from "@/types";

interface ContactInfoProps {
  data: CreateClientData;
  onChange: (field: keyof CreateClientData, value: string) => void;
  errors?: Partial<Record<keyof CreateClientData, string>>;
  disabled?: boolean;
}

export function ContactInfo({ data, onChange, errors = {}, disabled }: ContactInfoProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="email" className="flex items-center gap-1">
          Email Address
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          disabled={disabled}
          required
          className={errors.email ? "border-destructive" : ""}
        />
        <FormError message={errors.email ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone" className="flex items-center gap-1">
          Phone Number
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          disabled={disabled}
          required
          placeholder="+1 (555) 000-0000"
          className={errors.phone ? "border-destructive" : ""}
        />
        <FormError message={errors.phone ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address" className="flex items-center gap-1">
          Address
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          disabled={disabled}
          required
          className={errors.address ? "border-destructive" : ""}
        />
        <FormError message={errors.address ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city" className="flex items-center gap-1">
          City
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="city"
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          disabled={disabled}
          required
          className={errors.city ? "border-destructive" : ""}
        />
        <FormError message={errors.city ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="state" className="flex items-center gap-1">
          State
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="state"
          value={data.state}
          onChange={(e) => onChange("state", e.target.value)}
          disabled={disabled}
          required
          className={errors.state ? "border-destructive" : ""}
        />
        <FormError message={errors.state ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="zipcode" className="flex items-center gap-1">
          Zip Code
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="zipcode"
          value={data.zipcode}
          onChange={(e) => onChange("zipcode", e.target.value)}
          disabled={disabled}
          required
          className={errors.zipcode ? "border-destructive" : ""}
        />
        <FormError message={errors.zipcode ?? ""} />
      </div>
    </div>
  );
}
