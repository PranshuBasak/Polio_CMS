import type { NextConfig } from 'next'
import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/',
  defaultShowCopyCode: true,
  search: true,
  staticImage: true,
  whiteListTagsStyling: ['table', 'thead', 'tbody', 'tr', 'th', 'td']
})

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      'next-mdx-import-source-file': './src/mdx-components.tsx'
    }
  }
}

export default withNextra(nextConfig)
