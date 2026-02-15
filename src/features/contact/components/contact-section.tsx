import { ContactClient } from './contact-client';

/**
 * Contact Section - Server Component
 *
 * Contact form and information
 */
export default async function ContactSection() {
  // Contact info can be fetched from config/env or hardcoded
  const contactInfo = {
    email: 'pranshubasak@gmail.com',
    location: 'C.G. , India',
    social: {
      github: 'https://github.com/PranshuBasak',
      linkedin: 'https://www.linkedin.com/in/pranshubasak',
      medium: 'https://medium.com/@0xPranshu',
    },
  };

  return <ContactClient contactInfo={contactInfo} />;
}
