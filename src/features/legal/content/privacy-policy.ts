import type { LegalDocument } from './legal-content-types';

export const privacyPolicyContent: LegalDocument = {
  title: 'Privacy Policy',
  description:
    'This Privacy Policy explains what data we collect, how we use it, and the rights available to visitors and users of this portfolio website.',
  effectiveDate: 'February 15, 2026',
  contactEmail: 'legal@pranshubasak.site',  
  jurisdiction: 'India',
  governingLaw: 'Laws of India',
  sections: [
    {
      title: 'Information We Collect',
      paragraphs: [
        'We may collect personal information that you provide directly, such as your name, email address, and message content when using the contact form.',
        'We may also collect technical data such as browser type, device information, pages visited, and interaction events through analytics or server logs.',
      ],
    },
    {
      title: 'How We Use Information',
      paragraphs: [
        'We use collected data to respond to inquiries, improve website performance, maintain security, and deliver requested functionality.',
        'We may process contact submissions to send notifications and service-related communication.',
      ],
    },
    {
      title: 'Sharing and Disclosure',
      paragraphs: [
        'We do not sell personal data.',
        'Data may be shared with infrastructure or service providers strictly for hosting, analytics, email delivery, and operational purposes.',
      ],
    },
    {
      title: 'Cookies and Analytics',
      paragraphs: [
        'This website may use cookies or similar technologies to understand usage and improve user experience.',
        'You can control cookie behavior through your browser settings, though some features may be impacted.',
      ],
    },
    {
      title: 'Data Retention',
      paragraphs: [
        'We retain data only as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, and resolve disputes.',
      ],
    },
    {
      title: 'Your Rights',
      paragraphs: [
        'Depending on your location and applicable law, you may have rights to access, correct, delete, or restrict processing of your personal data.',
        'You may submit requests through the legal contact information listed below.',
      ],
    },
    {
      title: 'Security',
      paragraphs: [
        'Reasonable technical and organizational safeguards are used to protect information. However, no method of transmission or storage is fully secure.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'For privacy questions, requests, or concerns, contact us at the legal email provided on this page.',
      ],
    },
  ],
};