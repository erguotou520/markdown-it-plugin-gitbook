import MarkdownIt from 'markdown-it'
import { codeBlock } from './code'
import { embedBlock } from './embed'
import { hintBlock } from './hint'

/**
 * An gitbook syntax plugin for markdown-it.
 */
export default function GitbookSyntaxPlugin(md: MarkdownIt, options?: { embedUrls?: (Record<string, string>) | ((url: string) => string) }): void {
  embedBlock(md, options)
  hintBlock(md)
  codeBlock(md)
}
