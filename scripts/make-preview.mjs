// Turns the static export (out/) into a relocatable preview (preview/) that works under any URL path,
// e.g. a claude.ai artifact. Only for review previews; real hosting serves out/ at the domain root.
import fs from 'node:fs';
import path from 'node:path';

const src = 'out', dst = 'preview';
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
// The artifact host reserves top-level names starting with "_": move _next/ to assets/.
fs.renameSync(path.join(dst, '_next'), path.join(dst, 'assets'));
const files = walk(dst);

// Clicks on internal links: skip Next's client router (it fetches absolute RSC paths) and let the browser follow the relative href.
const NAV = `<script>addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-rel]');if(a&&!e.metaKey&&!e.ctrlKey){e.stopPropagation()}},true)</script>`;

for (const f of files) {
  if (f.endsWith('.css')) {
    fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replaceAll('url(/_next/static/media/', 'url(../media/'));
  } else if (f.endsWith('.js') && !/webpack-.*\.js$/.test(f)) {
    fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replaceAll('/_next/', '/assets/').replaceAll('\uFFFD', '\\ufffd')); // host rejects a literal U+FFFD; the JS escape is equivalent
  } else if (/webpack-.*\.js$/.test(f)) {
    // publicPath from the webpack script's own URL instead of the domain root
    fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('r.p="/_next/"', 'r.p=(document.querySelector(\'script[src*="chunks/webpack"]\').src.replace(/static\\/chunks\\/webpack.*$/,""))'));
  } else if (f.endsWith('.html')) {
    const depth = path.relative(dst, path.dirname(f)).split(path.sep).filter(Boolean).length;
    const rel = '../'.repeat(depth) || './';
    let html = fs.readFileSync(f, 'utf8');
    html = html.replace(/(\\?["'(])\/_next\//g, `$1${rel}assets/`);
    // href="/x/y/#h" -> href="<rel>x/y/index.html#h"
    html = html.replace(/href="\/([^"]*?)"/g, (m, p) => {
      if (p.startsWith('_next/') || p.startsWith('assets/')) return m;
      if (/^[^#?]*\.[a-z0-9]+([?#].*)?$/i.test(p)) return `href="${rel}${p}"`; // files like favicon.ico, icon.svg
      const [pathPart, hash] = p.split('#');
      const target = (pathPart ? pathPart.replace(/\/?$/, '/') + 'index.html' : '') + (hash ? '#' + hash : ''); // home = the artifact index itself
      return `data-rel="1" href="${rel}${target}"`;
    });
    html = html.replace('</head>', NAV + '</head>');
    fs.writeFileSync(f, html);
  }
}
console.log('preview ready:', files.filter((f) => f.endsWith('.html')).length, 'pages');
