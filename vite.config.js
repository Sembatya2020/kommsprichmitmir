import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';

const pageTitles = {
  'index.html': ['content/de/startseite.json', 'startseite_page_title'],
  'beratung.html': ['content/de/beratung.json', 'beratung_page_title'],
  'supervision.html': ['content/de/supervision.json', 'supervision_page_title'],
  'preise.html': ['content/de/preise.json', 'preise_page_title'],
  'ueber-mich.html': ['content/de/ueber-mich.json', 'about_page_title'],
  'kontakt.html': ['content/de/kontakt.json', 'kontakt_page_title'],
  'agb.html': ['content/de/agb.json', 'agb_page_title'],
  'datenschutz.html': ['content/de/datenschutz.json', 'datenschutz_page_title'],
  'nutzung.html': ['content/de/nutzung-impressum.json', 'nutzung_page_title'],
  '404.html': ['content/de/404.json', 'notfound_page_title'],
  'success.html': ['content/de/success.json', 'success_page_title']
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function setMetaTitle(html, property, title) {
  const tag = `<meta property="${property}" content="${title}">`;
  const pattern = new RegExp(`(<meta\\s+property="${property}"\\s+content=")[^"]*(")`, 'i');
  if (pattern.test(html)) {
    return html.replace(pattern, (_match, prefix, suffix) => prefix + title + suffix);
  }
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

/* Every German content file, keyed by file name. Baked into each page so the
   current CMS text is there on the very first paint (no flash of old text). */
const contentPages = [
  'startseite',
  'beratung',
  'supervision',
  'preise',
  'ueber-mich',
  'kontakt',
  'agb',
  'datenschutz',
  'nutzung-impressum',
  'allgemein-footer',
  '404',
  'success'
];

function readContent(root) {
  const content = {};
  contentPages.forEach((page) => {
    const file = join(root, 'content', 'de', page + '.json');
    if (!existsSync(file)) return;
    try {
      content[page] = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      console.warn(`[inline-cms-content] ${page}.json could not be read: ${error.message}`);
    }
  });
  return content;
}

function inlineCmsContent() {
  return {
    name: 'inline-cms-content',
    transformIndexHtml: {
      order: 'pre',
      handler(_html, ctx) {
        // The CMS admin is its own app — leave it untouched.
        if (/(^|[\\/])admin[\\/]/.test(ctx.filename || '') || /^\/admin\//.test(ctx.path || '')) return;

        const content = readContent(__dirname);
        const json = JSON.stringify(content)
          .replace(/</g, '\\u003c')
          .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
          .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
        const headingStyle = (content['allgemein-footer'] || {}).heading_style === 'playfair' ? 'playfair' : 'cormorant';

        return [
          {
            tag: 'style',
            children: 'html.cms-pending body{opacity:0}',
            injectTo: 'head'
          },
          {
            tag: 'script',
            // Hide the page until main.js has applied the content, with a
            // safety timeout so the page can never stay hidden.
            children:
              '(function(){var d=document.documentElement;d.classList.add("cms-pending");' +
              `d.setAttribute("data-heading-style","${headingStyle}");` +
              'setTimeout(function(){d.classList.remove("cms-pending")},3000);' +
              `window.__CMS_CONTENT__=${json};})();`,
            injectTo: 'head'
          }
        ];
      }
    }
  };
}

function copyStaticRuntimeFiles() {
  return {
    name: 'copy-static-runtime-files',
    closeBundle() {
      const root = __dirname;
      const dist = resolve(root, 'dist');
      const entries = [
        'content',
        'admin',
        'images'
      ];

      Object.entries(pageTitles).forEach(([page, [contentFile, titleKey]]) => {
        const contentPath = join(root, contentFile);
        const htmlPath = join(dist, page);
        if (!existsSync(contentPath) || !existsSync(htmlPath)) return;

        const title = JSON.parse(readFileSync(contentPath, 'utf8'))[titleKey];
        if (typeof title !== 'string' || !title.trim()) return;

        const escapedTitle = escapeHtml(title.trim());
        let html = readFileSync(htmlPath, 'utf8')
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
        html = setMetaTitle(html, 'og:title', escapedTitle);
        html = setMetaTitle(html, 'twitter:title', escapedTitle);
        writeFileSync(htmlPath, html);
      });

      entries.forEach((entry) => {
        const src = join(root, entry);
        const dest = join(dist, entry);
        if (existsSync(src)) {
          cpSync(src, dest, { recursive: true });
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [inlineCmsContent(), copyStaticRuntimeFiles()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        supervision: resolve(__dirname, 'supervision.html'),
        beratung: resolve(__dirname, 'beratung.html'),
        ueberMich: resolve(__dirname, 'ueber-mich.html'),
        preise: resolve(__dirname, 'preise.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
        agb: resolve(__dirname, 'agb.html'),
        datenschutz: resolve(__dirname, 'datenschutz.html'),
        nutzung: resolve(__dirname, 'nutzung.html'),
        success: resolve(__dirname, 'success.html'),
        404: resolve(__dirname, '404.html'),
      },
    },
  },
});
