'use client'

import { InkeepChatButton } from '@inkeep/cxkit-react'
import type { FC } from 'react'

export const ChatButton: FC = () => {
  return (
    <InkeepChatButton
      aiChatSettings={{
        aiAssistantAvatar: '/icon.svg',
        aiAssistantName: 'DynamicFolio Assistant'
      }}
      baseSettings={{
        apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
        primaryBrandColor: '#238aff',
        colorMode: {
          sync: {
            target: 'html',
            attributes: ['class'],
            isDarkMode(attrs: { class?: string }) {
              return attrs.class === 'dark'
            }
          }
        }
      }}
    />
  )
}
