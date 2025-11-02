"use client"

import type React from "react"

import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { CheckCircle } from "lucide-react"

type ContactFormUIProps = {
  formData: {
    name: string
    email: string
    message: string
  }
  errors: Record<string, string>
  isSubmitting: boolean
  isSuccess: boolean
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onResetSuccess: () => void
  t: (key: string) => string
}

/**
 * Presentational component for contact form
 * Pure UI component with event handlers passed as props
 */
export function ContactFormUI({
  formData,
  errors,
  isSubmitting,
  isSuccess,
  onSubmit,
  onChange,
  onResetSuccess,
  t,
}: ContactFormUIProps) {
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">{t("contact.form.success.title")}</h3>
        <p className="text-muted-foreground mb-4">{t("contact.form.success.description")}</p>
        <Button onClick={onResetSuccess}>{t("contact.form.success.button")}</Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("contact.form.name")}</Label>
        <Input
          id="name"
          name="name"
          placeholder={t("contact.form.name")}
          value={formData.name}
          onChange={onChange}
          className={errors.name ? "border-red-500" : ""}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("contact.form.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("contact.form.email")}
          value={formData.email}
          onChange={onChange}
          className={errors.email ? "border-red-500" : ""}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("contact.form.message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("contact.form.message")}
          rows={5}
          value={formData.message}
          onChange={onChange}
          className={errors.message ? "border-red-500" : ""}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-sm text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
      </Button>
    </form>
  )
}
