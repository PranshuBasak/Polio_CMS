'use client';

import dynamic from 'next/dynamic';

// Dynamic import for client-only component
const CustomCursor = dynamic(
  () => import('@/shared/components/ui-enhancements/custom-cursor'),
  { ssr: false }
);

export default CustomCursor;
