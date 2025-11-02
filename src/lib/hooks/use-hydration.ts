'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to safely handle hydration mismatches
 * Returns true only after client-side hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to delay state update until after paint
    const frame = requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return isHydrated;
}
