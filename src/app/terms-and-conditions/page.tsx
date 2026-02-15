import { LegalPageLayout } from '@/features/legal/components/legal-page-layout';
import { termsAndConditionsContent } from '@/features/legal/content/terms-and-conditions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: termsAndConditionsContent.title,
  description: termsAndConditionsContent.description,
};

export default function TermsAndConditionsPage() {
  return <LegalPageLayout document={termsAndConditionsContent} />;
}

