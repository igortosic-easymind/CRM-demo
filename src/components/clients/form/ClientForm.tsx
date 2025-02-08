"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BasicInfo } from "./FormSections/BasicInfo";
import { ContactInfo } from "./FormSections/ContactInfo";
import { StatusInfo } from "./FormSections/StatusInfo";
import { createClient, updateClient } from "@/app/actions/clients";
import { addClient, updateClient as updateClientAction } from "@/store/clientsSlice";
import { Client, CreateClientData } from "@/types";

interface ClientFormProps {
  initialData?: Client;
  mode?: "create" | "edit";
}

type InputChangeHandler = (field: keyof CreateClientData, value: string) => void;

type ValidationErrors = Partial<Record<keyof CreateClientData, string>>;

const requiredFields = [
  "company_name",
  "first_name",
  "last_name",
  "position",
  "phone",
  "email",
  "website",
  "address",
  "city",
  "state",
  "zipcode",
] as const;

export default function ClientForm({ initialData, mode = "create" }: ClientFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<CreateClientData>({
    company_name: initialData?.company_name || "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    position: initialData?.position || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipcode: initialData?.zipcode || "",
    lead: initialData?.lead || "cold",
    first_contact: initialData?.first_contact ? new Date(initialData.first_contact).toISOString().slice(0, 16) : "",
    related_name: initialData?.related_name || "",
    linkedin_connection: initialData?.linkedin_connection || "",
    comments: initialData?.comments || "",
    description_contact: initialData?.description_contact || "",
    description_contact_more: initialData?.description_contact_more || "",
    follow_up_action: initialData?.follow_up_action || "",
    new_business: initialData?.new_business || "",
    recommendation: initialData?.recommendation || "",
  });

  const validateForm = () => {
    const errors: ValidationErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field
          .split("_")
          .join(" ")
          .replace(/\b\w/g, (l) => l.toUpperCase())} is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Website validation
    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      errors.website = "Please enter a valid URL starting with http:// or https://";
      isValid = false;
    }

    // Phone validation (basic)
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange: InputChangeHandler = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error for the field being changed
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const result = await createClient(formData);
        if (result.success && result.data) {
          dispatch(addClient(result.data));
          router.push("/clients");
        } else {
          console.log(result.error);
          setError(result.error || "Failed to create client");
        }
      } else {
        if (!initialData?.id) throw new Error("No client ID provided for update");
        const result = await updateClient(initialData.id.toString(), {
          ...formData,
          id: initialData.id,
        });
        if (result.success && result.data) {
          dispatch(updateClientAction(result.data));
          router.push("/clients");
        } else {
          setError(result.error || "Failed to update client");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <BasicInfo data={formData} errors={validationErrors} onChange={handleInputChange} disabled={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactInfo data={formData} errors={validationErrors} onChange={handleInputChange} disabled={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusInfo data={formData} onChange={handleInputChange} disabled={loading} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Client" : "Update Client"}
        </Button>
      </div>
    </form>
  );
}
