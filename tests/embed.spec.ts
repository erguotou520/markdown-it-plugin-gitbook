import { describe, expect, it } from 'bun:test'
import Bun from 'bun'
import MarkdownIt from 'markdown-it'
import gitbookPlugin from '../src'

async function readFixtures(name: string): Promise<string[][]> {
  const fixtures = await Bun.file(`tests/fixtures/${name}.md`).text()
  return fixtures.split('----').map((s) => s.trim().split('\n\n.\n\n'))
}

describe('Parses embed', async () => {
  const mdit = MarkdownIt().use(gitbookPlugin, { embedUrls: {
    'https://www.bilibili.com/video/BV1w24y1U7fx': 'https://player.bilibili.com/player.html?aid=691941128&bvid=BV1w24y1U7fx&cid=940710925&page=1'
  } })
  const embedCaseContent = await readFixtures('embed')
  for (const [name, text, expected] of embedCaseContent) {
    const rendered = mdit.render(text)
    it(name, () => expect(rendered).toEqual(`${expected}\n`))
  }
})
