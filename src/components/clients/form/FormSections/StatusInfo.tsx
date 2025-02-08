// src/components/clients/form/FormSections/StatusInfo.tsx
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateClientData } from "@/types";

interface StatusInfoProps {
  data: CreateClientData;
  onChange: (field: keyof CreateClientData, value: string) => void;
  errors?: Partial<Record<keyof CreateClientData, string>>;
  disabled?: boolean;
}

export function StatusInfo({ data, onChange, errors = {}, disabled }: StatusInfoProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="lead">Lead Status</Label>
        <Select value={data.lead} onValueChange={(value) => onChange("lead", value)} disabled={disabled}>
          <SelectTrigger id="lead" className={errors.lead ? "border-destructive" : ""}>
            <SelectValue placeholder="Select lead status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cold">Cold</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
          </SelectContent>
        </Select>
        <FormError message={errors.lead ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="first_contact" className="flex items-center gap-1">
          First Contact Date
          {/* <span className="text-destructive">*</span> */}
        </Label>
        <Input
          id="first_contact"
          type="datetime-local"
          value={data.first_contact || ""}
          onChange={(e) => onChange("first_contact", e.target.value)}
          disabled={disabled}
          className={errors.first_contact ? "border-destructive" : ""}
        />
        <FormError message={errors.first_contact ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={data.comments}
          onChange={(e) => onChange("comments", e.target.value)}
          disabled={disabled}
          className={errors.comments ? "border-destructive" : ""}
          placeholder="General comments about the client..."
        />
        <FormError message={errors.comments ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description_contact">Contact Description</Label>
        <Textarea
          id="description_contact"
          value={data.description_contact}
          onChange={(e) => onChange("description_contact", e.target.value)}
          disabled={disabled}
          className={errors.description_contact ? "border-destructive" : ""}
          placeholder="Details about the initial contact..."
        />
        <FormError message={errors.description_contact ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description_contact_more">Additional Contact Details</Label>
        <Textarea
          id="description_contact_more"
          value={data.description_contact_more}
          onChange={(e) => onChange("description_contact_more", e.target.value)}
          disabled={disabled}
          className={errors.description_contact_more ? "border-destructive" : ""}
          placeholder="Additional contact information..."
        />
        <FormError message={errors.description_contact_more ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="follow_up_action">Follow-up Action</Label>
        <Input
          id="follow_up_action"
          value={data.follow_up_action}
          onChange={(e) => onChange("follow_up_action", e.target.value)}
          disabled={disabled}
          className={errors.follow_up_action ? "border-destructive" : ""}
          placeholder="Next steps or follow-up tasks..."
        />
        <FormError message={errors.follow_up_action ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new_business">New Business Opportunities</Label>
        <Textarea
          id="new_business"
          value={data.new_business}
          onChange={(e) => onChange("new_business", e.target.value)}
          disabled={disabled}
          className={errors.new_business ? "border-destructive" : ""}
          placeholder="Potential business opportunities..."
        />
        <FormError message={errors.new_business ?? ""} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="recommendation">Recommendations</Label>
        <Textarea
          id="recommendation"
          value={data.recommendation}
          onChange={(e) => onChange("recommendation", e.target.value)}
          disabled={disabled}
          className={errors.recommendation ? "border-destructive" : ""}
          placeholder="Recommendations for this client..."
        />
        <FormError message={errors.recommendation ?? ""} />
      </div>
    </div>
  );
}
