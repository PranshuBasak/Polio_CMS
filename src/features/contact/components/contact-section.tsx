import { ContactClient } from './contact-client';

/**
 * Contact Section - Server Component
 *
 * Contact form and information
 */
export default async function ContactSection() {
  // Contact info can be fetched from config/env or hardcoded
  const contactInfo = {
    email: 'tanzimhossain2@gmail.com',
    location: 'Dhaka, Bangladesh',
    social: {
      github: 'https://github.com/0xTanzim',
      linkedin: 'https://linkedin.com/in/0xTanzim',
      medium: 'https://medium.com/@0xTanzim',
    },
  };

  return <ContactClient contactInfo={contactInfo} />;
}
