import { importPage } from 'nextra/pages'
import { notFound } from 'next/navigation'

import { useMDXComponents } from '../../mdx-components'

type Params = {
  mdxPath?: string[]
}

type PageProps = {
  params: Promise<Params>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  try {
    const { metadata } = await importPage(params.mdxPath)
    return metadata
  } catch {
    return {}
  }
}

const Wrapper = useMDXComponents({}).wrapper

export default async function CatchAllDocsPage(props: PageProps) {
  const params = await props.params

  try {
    const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
      params.mdxPath
    )
    return (
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        <MDXContent params={params} />
      </Wrapper>
    )
  } catch {
    notFound()
  }
}
