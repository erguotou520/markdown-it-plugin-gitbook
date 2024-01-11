import MarkdownIt from 'markdown-it'
import ParserBlock from 'markdown-it/lib/parser_block'

/**
 * An gitbook syntax plugin for markdown-it.
 */
export default function GitbookSyntaxPlugin(md: MarkdownIt, options?: { embedUrls?: (Record<string, string>) | ((url: string) => string) }): void {
  const open = '{% embed'
  const lineClose = '%}'
  const blockClose = '{% endembed %}'
  const embedBlock: ParserBlock.RuleBlock = (state, startLine, endLine, silent) => {
    let haveLineEndMarker = false
    let haveBlockEndMarker = false
    let lastLine: string | undefined = undefined
    let pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    if (pos + open.length > max) {
      return false
    }

    const openDelim = state.src.slice(pos, pos + open.length)

    if (openDelim !== open) {
      return false
    }

    pos += open.length
    let firstLine = state.src.slice(pos, max)

    // Since start is found, we can report success here in validation mode
    if (silent) {
      return true
    }

    const firstLineWithoutClose = firstLine.trim().slice(0, -lineClose.length)
    if (firstLineWithoutClose === lineClose) {
      // Single line expression
      firstLine = firstLineWithoutClose
      haveLineEndMarker = true
    }

    // search end of block
    let nextLine = startLine

    for (;;) {
      if (haveBlockEndMarker) {
        break
      }

      // embed end look-down should not over 2 lines
      if (nextLine - startLine > 1) {
        break
      }

      nextLine++

      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine]
      const max = state.eMarks[nextLine]

      if (pos < max && state.tShift[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        break
      }

      if (state.src.slice(pos, max).trim().slice(-blockClose.length) !== blockClose) {
        continue
      }

      if (state.tShift[nextLine] - state.blkIndent >= 4) {
        // [NotSure] closing block math should be indented less then 4 spaces
        continue
      }

      const lastLinePos = state.src.slice(0, max).lastIndexOf(blockClose)
      lastLine = state.src.slice(pos, lastLinePos)

      pos += lastLine.length + blockClose.length

      // make sure tail has spaces only
      pos = state.skipSpaces(pos)

      if (pos < max) {
        continue
      }

      // found!
      haveBlockEndMarker = true
    }

    state.line = haveBlockEndMarker ? nextLine + 1 : haveLineEndMarker ? startLine + 1 : startLine + 1

    const token = state.push('embed', haveBlockEndMarker ? 'embed_block' : 'embed', 0)
    token.block = true
    const urlMatch = firstLineWithoutClose.match(/url=\"(.+)\"/)
    token.meta = {
      url: urlMatch ? urlMatch[1] : '',
      caption: haveBlockEndMarker
        ? state.src.slice(state.bMarks[startLine + 1], state.bMarks[state.line - 1]).trim()
        : null
    }
    token.map = [startLine, state.line]
    token.markup = open

    return true
  }
  md.block.ruler.after('blockquote', 'embed', embedBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules.embed = (tokens, idx) => {
    const token = tokens[idx]
    const { url, caption } = token.meta
    let iframeUrl = url
    const embedUrls = options?.embedUrls
    if (embedUrls) {
      if (typeof embedUrls === 'function') {
        iframeUrl = embedUrls(url)
      } else {
        iframeUrl = embedUrls[url]
      }
    }
    return `<figure class="gitbook-embed${
      caption ? ' with-caption' : ''
    }">\n  <iframe src="${iframeUrl || url}"${caption ? ` alt="${caption}"` : ''} style="padding:16px 0;width:100%;max-with:100%;border:none;"></iframe>\n${
      caption
        ? `  <figcaption style="padding-top:8px;color:#8899a8;font-size:12px;text-align:center;">${caption}</figcaption>\n`
        : ''
    }</figure>\n`
  }
}
