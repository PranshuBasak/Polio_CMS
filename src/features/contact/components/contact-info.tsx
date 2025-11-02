'use client';

import { useTranslations } from '@/lib/i18n/translations-context';
import { Mail, MapPin, Phone } from 'lucide-react';

/**
 * Contact Info - Presentational Component
 */
interface ContactInfoProps {
  contactInfo: {
    email: string;
    location: string;
    social: {
      github: string;
      linkedin: string;
      medium: string;
    };
  };
}

export function ContactInfo({ contactInfo }: ContactInfoProps) {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col justify-center space-y-6">
      <div className="flex items-start space-x-4">
        <Mail className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-medium">{t('contact.info.email')}</h3>
          <p className="text-muted-foreground">
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:text-primary"
            >
              {contactInfo.email}
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <MapPin className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-medium">{t('contact.info.location')}</h3>
          <p className="text-muted-foreground">{contactInfo.location}</p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <Phone className="h-6 w-6 text-primary mt-1" />
        <div>
          <h3 className="font-medium">{t('contact.info.social')}</h3>
          <p className="text-muted-foreground">
            <a
              href={contactInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              GitHub
            </a>
            {' • '}
            <a
              href={contactInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              LinkedIn
            </a>
            {' • '}
            <a
              href={contactInfo.social.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Medium
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
