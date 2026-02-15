import type { LegalDocument } from './legal-content-types';

export const termsAndConditionsContent: LegalDocument = {
  title: 'Terms and Conditions',
  description:
    'These Terms and Conditions govern your use of this website and describe your rights, responsibilities, and limitations.',
  effectiveDate: 'February 15, 2026',
  contactEmail: 'legal@pranshubasak.site',  
  jurisdiction: 'Madhya Pradesh, India',
  governingLaw: 'Laws of India',
  sections: [
    {
      title: 'Acceptance of Terms',
      paragraphs: [
        'By accessing or using this website, you agree to be bound by these Terms and Conditions and all applicable laws.',
      ],
    },
    {
      title: 'Permitted Use',
      paragraphs: [
        'You may use this website for lawful personal or professional viewing purposes.',
        'You may not misuse the service, attempt unauthorized access, or interfere with website operations.',
      ],
    },
    {
      title: 'Intellectual Property',
      paragraphs: [
        'Unless stated otherwise, content including text, design, source code excerpts, graphics, and branding is owned by the site owner or used with permission.',
        'You may not copy, redistribute, or commercially exploit protected content without prior written consent.',
      ],
    },
    {
      title: 'User Submissions',
      paragraphs: [
        'When you submit forms or messages, you confirm that provided information is accurate and does not violate third-party rights or laws.',
      ],
    },
    {
      title: 'Disclaimers',
      paragraphs: [
        'This website is provided on an "as is" and "as available" basis without warranties of any kind, express or implied.',
        'We do not guarantee uninterrupted service, absolute accuracy, or continuous availability.',
      ],
    },
    {
      title: 'Limitation of Liability',
      paragraphs: [
        'To the maximum extent permitted by law, the site owner is not liable for indirect, incidental, or consequential damages arising from use of this website.',
      ],
    },
    {
      title: 'Termination',
      paragraphs: [
        'We reserve the right to restrict or terminate access to the website at any time for misuse, policy violations, or operational reasons.',
      ],
    },
    {
      title: 'Governing Law and Jurisdiction',
      paragraphs: [
        'These terms are governed by the governing law and jurisdiction listed in the legal details section of this page.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'For legal inquiries regarding these terms, contact us at the legal email provided on this page.',
      ],
    },
  ],
};