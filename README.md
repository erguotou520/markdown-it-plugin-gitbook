# markdown-it-plugin-gitbook

[![npm version](https://img.shields.io/npm/v/markdown-it-plugin-gitbook.svg)](https://www.npmjs.com/package/markdown-it-plugin-gitbook)
[![License](https://img.shields.io/npm/l/markdown-it-plugin-gitbook.svg)](https://github.com/erguotou520/markdown-it-plugin-gitbook/blob/main/LICENSE)

> :book: A markdown-it plugin for parsing GitBook-specific block tags

`markdown-it-plugin-gitbook` is a plugin for `markdown-it` that allows parsing GitBook-specific block tags. It currently supports the `embed` block.

## Installation

Install via npm:

```bash
npm install markdown-it-plugin-gitbook
```

Or install via yarn:

```bash
yarn add markdown-it-plugin-gitbook
```

## Usage

```javascript
const markdownIt = require('markdown-it');
const markdownItGitBook = require('markdown-it-plugin-gitbook');

const md = markdownIt();
md.use(markdownItGitBook, {
   // embedUrls: { 'url': 'https://example.com/real/url' }
   embedUrls: (url) => {
      // Replace this to get real video player url instead of website url
      // This function does not support async call as markdown-it not support async
      return url
   }
});

const markdown = `Your GitBook content with embed blocks`;
const result = md.render(markdown);

console.log(result);
```

## Block Tags

### embed

The `embed` block tag allows you to embed various content such as videos, audios, or other web pages within GitBook.

```markdown
{% embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" %}
```

Replace the `url` attribute with the URL of the content you want to embed.

We also support `embed` block tag with caption, like this

```markdown
{% embed url="https://www.bilibili.com/video/BV1w24y1U7fx" %}
Abort fireboom
{% endembed %}
```

[see more from test](./tests/fixtures/embed.md)

## Local Development

If you want to contribute or make modifications to the `markdown-it-plugin-gitbook` plugin, you can follow these steps for local development:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/markdown-it-plugin-gitbook.git
   ```

2. Install dependencies:

We use [bun](https://bun.sh) to develop this plugin, so [install bun](https://bun.sh/docs/bundler#format) first, then

   ```bash
   cd markdown-it-plugin-gitbook
   bun i
   ```

3. Make your modifications and perform development.

4. Run tests:

   ```bash
   bun test
   ```

5. Commit your changes and create a Pull Request.

## License

This project is licensed under the [MIT](https://opensource.org/license/mit/) License.
