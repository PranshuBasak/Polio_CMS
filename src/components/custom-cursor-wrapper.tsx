'use client';

import dynamic from 'next/dynamic';

const CustomCursor = dynamic(
  () => import('@/shared/components/ui-enhancements/custom-cursor'),
  { ssr: false }
);

export default function CustomCursorWrapper() {
  return <CustomCursor />;
}
