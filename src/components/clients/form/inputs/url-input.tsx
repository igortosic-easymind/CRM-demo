import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";

interface URLInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

export function URLInput({
  id,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  className = "",
}: URLInputProps) {
  // Store URL without protocol for display
  const [localValue, setLocalValue] = useState(() => {
    return value ? value.replace(/^https?:\/\//, "") : "";
  });
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    // Update local value when prop changes, strip protocol
    setLocalValue(value ? value.replace(/^https?:\/\//, "") : "");
  }, [value]);

  const validateURL = (url: string) => {
    if (!url) {
      return required ? "Website URL is required" : "";
    }

    try {
      // Test with https:// to validate
      new URL(`https://${url.replace(/^https?:\/\//, "")}`);
      return "";
    } catch {
      return "Please enter a valid website URL";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim();
    // Always strip protocols from input
    const cleanValue = newValue.replace(/^https?:\/\//, "");
    setLocalValue(cleanValue);

    if (newValue || required) {
      const error = validateURL(cleanValue);
      setValidationError(error);

      if (!error) {
        // Always add https:// when updating parent
        onChange(`https://${cleanValue}`);
      }
    } else {
      setValidationError("");
      onChange("");
    }
  };

  const handleBlur = () => {
    if (localValue) {
      const cleanValue = localValue.replace(/^https?:\/\//, "");
      setLocalValue(cleanValue);
      if (!validateURL(cleanValue)) {
        onChange(`https://${cleanValue}`);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Input
        id={id}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        placeholder="example.com"
        className={`${error || validationError ? "border-destructive" : ""} ${className}`}
      />
      <FormError message={error || validationError} />
    </div>
  );
}
