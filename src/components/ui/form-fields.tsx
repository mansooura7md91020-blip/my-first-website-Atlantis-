"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const fieldClasses =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand outline-none transition-colors";

function FieldWrapper({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
    </label>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, required, className, ...props }: TextFieldProps) {
  return (
    <FieldWrapper label={label} required={required} hint={hint}>
      <input required={required} className={cn(fieldClasses, className)} {...props} />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextAreaField({ label, hint, required, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} required={required} hint={hint}>
      <textarea
        required={required}
        rows={4}
        className={cn(fieldClasses, "resize-y", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function SelectField({ label, hint, required, className, children, ...props }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} required={required} hint={hint}>
      <select required={required} className={cn(fieldClasses, className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
