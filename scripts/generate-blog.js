const fs = require('fs');
const path = require('path');

function safeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function rewriteAssets(html) {
  return String(html || '').replace(/https?:\/\/images\.bloggi\.co\/([a-z0-9]+)\.(jpg|png|jpeg|gif|webp)/gi, function (_, name, ext) {
    return `../images-bloggi/${name}.${ext}`;
  });
}

function htmlEscape(s) {
  return String(s || '').replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

function stripTags(html, maxLen) {
  const t = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return maxLen ? t.slice(0, maxLen) : t;
}

function layoutHead({ title, description, level }) {
  const cssHref = level === 1 ? 'css/main.css' : '../css/main.css';
  const headerSrc = level === 1 ? 'components/header.js' : '../components/header.js';
  const footerSrc = level === 1 ? 'components/footer.js' : '../components/footer.js';
  const mainJs = level === 1 ? 'js/main.js' : '../js/main.js';
  return [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${htmlEscape(title)}</title>`,
    `<meta name="description" content="${htmlEscape(description)}">`,
    `<link rel="stylesheet" href="${cssHref}">`,
    `<script src="${headerSrc}" defer></script>`,
    `<script src="${footerSrc}" defer></script>`,
    `<script src="${mainJs}" defer></script>`,
    '</head>',
    '<body>',
    '<yk-header></yk-header>'
  ].join('\n');
}

function layoutFoot() {
  return ['<yk-footer></yk-footer>', '</body>', '</html>'].join('\n');
}

function renderIndex(posts) {
  const items = posts.map(p => {
    const href = `blog/${safeSlug(p.slug)}.html`;
    const date = p.published_at ? new Date(p.published_at) : null;
    const fmt = date ? date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const excerpt = p.excerpt ? String(p.excerpt) : '';
    return [
      '<article class="card" style="padding: 1.2rem 1.4rem; margin-bottom: 1rem; border-radius: var(--radius-lg);">',
      `<a href="${href}" class="link-arrow" style="font-size: 1.2rem; display: inline-block; margin-bottom: 0.25rem;">${htmlEscape(p.title)}</a>`,
      `<div style="color: var(--color-text-light); font-size: 0.9rem;">${fmt}</div>`,
      (excerpt ? `<p style="margin-top: 0.6rem; color: var(--color-text);">${htmlEscape(excerpt)}</p>` : ''),
      '</article>'
    ].join('');
  }).join('\n');
  return [
    layoutHead({ title: 'Blog | YogaKiddy', description: 'Lecturas y novedades de YogaKiddy: yoga infantil, bienestar y comunidad.', level: 1 }),
    '<main>',
    '<section class="section">',
    '<div class="container reveal">',
    '<div class="text-center mb-8">',
    '<span class="pill-badge">YogaKiddy</span>',
    '<h1>Blog</h1>',
    '<p class="text-large" style="max-width: 720px; margin: 0 auto;">Historias, recursos y experiencias de nuestra comunidad. Sin fotos en la lista para lectura rápida.</p>',
    '</div>',
    '<div class="container-narrow" style="max-width: 820px;">',
    items || '<p>No hay artículos por ahora.</p>',
    '</div>',
    '</div>',
    '</section>',
    '</main>',
    layoutFoot()
  ].join('\n');
}

function renderPost(p) {
  const title = p.title || 'Artículo';
  const date = p.published_at ? new Date(p.published_at) : null;
  const fmt = date ? date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const desc = p.excerpt ? stripTags(p.excerpt, 160) : stripTags(p.html, 160);
  const content = rewriteAssets(p.html || '');
  return [
    layoutHead({ title: `${title} | YogaKiddy`, description: desc, level: 2 }),
    '<main>',
    '<section class="section">',
    '<div class="container-narrow reveal">',
    '<a href="../blog.html" class="back-link link-arrow">← Volver al blog</a>',
    `<h1 class="post-title" style="font-size: clamp(2rem, 4vw, 2.6rem); margin-bottom: .5rem;">${htmlEscape(title)}</h1>`,
    `<div class="post-meta" style="color: var(--color-text-light); margin-bottom: 1.2rem;">${fmt}</div>`,
    `<article class="post-content">${content}</article>`,
    '</div>',
    '</section>',
    '</main>',
    layoutFoot()
  ].join('\n');
}

function main() {
  const cwd = process.cwd();
  const exportPath = path.join(cwd, 'export.json');
  const blogDir = path.join(cwd, 'blog');
  if (!fs.existsSync(exportPath)) {
    throw new Error('export.json no encontrado');
  }
  const raw = fs.readFileSync(exportPath, 'utf8');
  const data = JSON.parse(raw);
  const posts = Array.isArray(data.posts) ? data.posts.filter(p => p && p.slug && p.title) : [];
  posts.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir);
  const indexHtml = renderIndex(posts);
  fs.writeFileSync(path.join(cwd, 'blog.html'), indexHtml, 'utf8');
  for (const p of posts) {
    const file = path.join(blogDir, `${safeSlug(p.slug)}.html`);
    const html = renderPost(p);
    fs.writeFileSync(file, html, 'utf8');
  }
  process.stdout.write(`Generadas ${posts.length} páginas de posts y blog.html\n`);
}

main();
