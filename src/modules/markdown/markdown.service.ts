import mk from '@vscode/markdown-it-katex';
import hljs from 'highlight.js';
import type { Options as LinkifyOptions } from 'linkify-it';
import MarkdownIt from 'markdown-it';

const linkifyOptions: LinkifyOptions = {
  fuzzyLink: false,
  fuzzyIP: false,
  fuzzyEmail: false,
};

// TODO: support right now only $ delimiters, need to add [ delimiters
const katexOptions = {
  throwOnError: false,
  // errorColor: '#cc0000',
  enableBareBlocks: true,
  enableMathBlockInHtml: true,
  enableMathInlineInHtml: true,
  enableFencedBlocks: true,
};

const disable = ['reference', 'image', 'html_block', 'html_inline', 'autolink']; // 'link',

export class MarkdownService {
  private md: MarkdownIt;

  constructor() {
    // Create instance first so we can reference it in the highlight function
    this.md = new MarkdownIt({
      html: false,
      breaks: true,
      linkify: false,
      typographer: true,
    });

    // Set highlight function with access to the instance
    this.md.options.highlight = (str: string, lang: string) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            `<pre><code class="hljs language-${lang}">` +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>'
          );
        } catch (__) {
          // silently ignore
        }
      }

      return '<pre><code class="hljs">' + this.md.utils.escapeHtml(str) + '</code></pre>';
    };

    this.md.disable(disable);
    this.md.linkify.set(linkifyOptions);
    this.md.use(mk, katexOptions);

    this.setupParagraphRenderer();
    this.setupExternalLinks();
  }

  private setupParagraphRenderer(): void {
    const defaultParagraphRenderer =
      this.md.renderer.rules.paragraph_open ||
      ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

    this.md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
      let result = '';
      if (idx > 1) {
        const inline = tokens[idx - 2];
        const paragraph = tokens[idx];
        if (
          inline.type === 'inline' &&
          inline.map &&
          inline.map[1] &&
          paragraph.map &&
          paragraph.map[0]
        ) {
          const diff = paragraph.map[0] - inline.map[1];
          if (diff > 0) {
            result = '<p class="empty">&nbsp;</p>'.repeat(diff);
          }
        }
      }
      return result + defaultParagraphRenderer(tokens, idx, options, env, self);
    };
  }

  private setupExternalLinks(): void {
    this.md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];

      // Add target="_blank"
      const aIndex = token.attrIndex('target');
      if (aIndex < 0) {
        token.attrPush(['target', '_blank']);
      } else if (token.attrs) {
        token.attrs[aIndex][1] = '_blank';
      } else {
        token.attrSet('target', '_blank');
      }

      // Add rel="noopener noreferrer"
      const relIndex = token.attrIndex('rel');
      if (relIndex < 0) {
        token.attrPush(['rel', 'noopener noreferrer']);
      } else if (token.attrs) {
        token.attrs[relIndex][1] = 'noopener noreferrer';
      } else {
        token.attrSet('rel', 'noopener noreferrer');
      }

      return self.renderToken(tokens, idx, options);
    };
  }

  public toHtml(markdown: string): string {
    return this.md.render(markdown);
  }
}

// Export a singleton instance for direct imports
export const markdownService = new MarkdownService();
