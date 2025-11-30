import type React from "react"
import { Mail, MapPin, Phone } from "lucide-react"

type ContactInfoProps = {
  t: (key: string) => string
}

/**
 * Presentational component for contact information
 */
export function ContactInfo({ t }: ContactInfoProps) {
  return (
    <div className="flex flex-col justify-center">
      <div className="space-y-6">
        <ContactInfoItem
          icon={Mail}
          title={t("contact.info.email")}
          content={
            <a href="mailto:pranshubasak@gmail.com" className="hover:text-primary transition-colors">
              pranshubasak@gmail.com
            </a>
          }
        />

        <ContactInfoItem
          icon={MapPin}
          title={t("contact.info.location")}
          content={<span>{t("contact.info.location.value")}</span>}
        />

        <ContactInfoItem
          icon={Phone}
          title={t("contact.info.social")}
          content={
            <span>
              <a
                href="https://github.com/PranshuBasak"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              {" • "}
              <a
                href="https://linkedin.com/in/0xPranshu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
              {" • "}
              <a
                href="https://medium.com/@0xPranshu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Medium
              </a>
            </span>
          }
        />
      </div>
    </div>
  )
}

type ContactInfoItemProps = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  content: React.ReactNode
}

function ContactInfoItem({ icon: Icon, title, content }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <div className="text-muted-foreground">{content}</div>
      </div>
    </div>
  )
}
