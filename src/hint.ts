import MarkdownIt from 'markdown-it'
import ParserBlock from 'markdown-it/lib/parser_block'

export function hintBlock(
  md: MarkdownIt
) {
  const open = '{% hint'
  const lineClose = '%}'
  const blockClose = '{% endhint %}'
  const hintBlock: ParserBlock.RuleBlock = (state, startLine, endLine, silent) => {
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

    const token = state.push('hint', haveBlockEndMarker ? 'hint_block' : 'hint', 0)
    token.block = true
    const styleMatch = firstLineWithoutClose.match(/style=\"(.+)\"/)
    token.meta = {
      style: styleMatch?.[1] || 'info',
      content: haveBlockEndMarker
        ? state.src.slice(state.bMarks[startLine + 1], state.bMarks[state.line - 1]).trim()
        : null
    }
    token.map = [startLine, state.line]
    token.markup = open

    return true
  }
  md.block.ruler.after('blockquote', 'hint', hintBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules.hint = (tokens, idx) => {
    const token = tokens[idx]
    const { style, content } = token.meta
    return `::: ${style}
${content}
:::\n`
  }
}
