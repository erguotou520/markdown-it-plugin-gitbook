import { describe, expect, it } from 'bun:test'
import Bun from 'bun'
import MarkdownIt from 'markdown-it'
import gitbookPlugin from '../src'

async function readFixtures(name: string): Promise<string[][]> {
  const fixtures = await Bun.file(`tests/fixtures/${name}.md`).text()
  return fixtures.split('----').map((s) => s.trim().split('\n\n.\n\n'))
}

describe('Parses embed', async () => {
  const mdit = MarkdownIt().use(gitbookPlugin)
  const embedCaseContent = await readFixtures('embed')
  for (const [name, text, expected] of embedCaseContent) {
    const rendered = mdit.render(text)
    it(name, () => expect(rendered).toEqual(`${expected}\n`))
  }
})
