import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { URLInput } from "@/components/clients/form/inputs/url-input";
import { CreateClientData } from "@/types";

interface BasicInfoProps {
  data: CreateClientData;
  onChange: (field: keyof CreateClientData, value: string) => void;
  errors?: Partial<Record<keyof CreateClientData, string>>;
  disabled?: boolean;
}

export function BasicInfo({ data, onChange, errors = {}, disabled }: BasicInfoProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="company_name" className="flex items-center gap-1">
          Company Name
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="company_name"
          value={data.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
          disabled={disabled}
          required
          className={errors.company_name ? "border-destructive" : ""}
        />
        <FormError message={errors.company_name ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name" className="flex items-center gap-1">
            First Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="first_name"
            value={data.first_name}
            onChange={(e) => onChange("first_name", e.target.value)}
            disabled={disabled}
            required
            className={errors.first_name ? "border-destructive" : ""}
          />
          <FormError message={errors.first_name ?? ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last_name" className="flex items-center gap-1">
            Last Name
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_name"
            value={data.last_name}
            onChange={(e) => onChange("last_name", e.target.value)}
            disabled={disabled}
            required
            className={errors.last_name ? "border-destructive" : ""}
          />
          <FormError message={errors.last_name ?? ""} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="position" className="flex items-center gap-1">
          Position
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="position"
          value={data.position}
          onChange={(e) => onChange("position", e.target.value)}
          disabled={disabled}
          required
          className={errors.position ? "border-destructive" : ""}
        />
        <FormError message={errors.position ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website" className="flex items-center gap-1">
          Website
          <span className="text-destructive">*</span>
        </Label>
        <URLInput
          id="website"
          value={data.website}
          onChange={(value) => onChange("website", value)}
          disabled={disabled}
          required
          error={errors.website}
        />
      </div>
    </div>
  );
}
