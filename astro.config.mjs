import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeCitation from 'rehype-citation';
import rehypeBibLinks from './src/plugins/rehype-bib-links.mjs';

export default defineConfig({
  site: 'https://paninihq.com',
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri processor, so
    // rehype plugins like rehype-citation can run.
    processor: unified({
      rehypePlugins: [
        [
          rehypeCitation,
          {
            // Shared BibTeX file for all posts. Cite with [@key] in markdown.
            // The bibliography renders where a post has a lone [^ref]
            // paragraph (else at the end), and only if the post cites anything.
            bibliography: 'src/content/references.bib',
            path: process.cwd(),
            csl: 'apa',
            linkCitations: true,
          },
        ],
        rehypeBibLinks,
      ],
    }),
  },
});
