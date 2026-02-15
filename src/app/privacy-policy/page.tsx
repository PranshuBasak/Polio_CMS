import { LegalPageLayout } from '@/features/legal/components/legal-page-layout';
import { privacyPolicyContent } from '@/features/legal/content/privacy-policy';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: privacyPolicyContent.title,
  description: privacyPolicyContent.description,
};

export default function PrivacyPolicyPage() {
  return <LegalPageLayout document={privacyPolicyContent} />;
}

