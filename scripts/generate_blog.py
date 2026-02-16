import json, os, re, html
from datetime import datetime, timezone

def safe_slug(s):
    s = (s or "").lower()
    s = re.sub(r'[^a-z0-9\-]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s

def rewrite_assets(html_str):
    return re.sub(r'https?://images\.bloggi\.co/([a-z0-9]+)\.(jpg|png|jpeg|gif|webp)',
                  r'../images-bloggi/\1.\2', html_str or '', flags=re.I)

def strip_tags(s, maxlen=None):
    t = re.sub(r'<[^>]*>', ' ', s or '')
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:maxlen] if maxlen else t

BASE_URL = "https://yogakiddy.com/"
DEFAULT_OG_IMAGE = BASE_URL + "assets/photo_presencial.png"

def layout_head(title, description, level, canonical=None, og=None, ld_json=None):
    css_href = 'css/main.css' if level == 1 else '../css/main.css'
    header_src = 'components/header.js' if level == 1 else '../components/header.js'
    footer_src = 'components/footer.js' if level == 1 else '../components/footer.js'
    main_js = 'js/main.js' if level == 1 else '../js/main.js'
    og_tags = []
    if og:
        if og.get('title'): og_tags.append(f'<meta property="og:title" content="{html.escape(og["title"])}">')
        if og.get('description'): og_tags.append(f'<meta property="og:description" content="{html.escape(og["description"])}">')
        if og.get('type'): og_tags.append(f'<meta property="og:type" content="{html.escape(og["type"])}">')
        if og.get('url'): og_tags.append(f'<meta property="og:url" content="{html.escape(og["url"])}">')
        if og.get('image'): og_tags.append(f'<meta property="og:image" content="{html.escape(og["image"])}">')
        if og.get('published'): og_tags.append(f'<meta property="article:published_time" content="{html.escape(og["published"])}">')
        if og.get('modified'): og_tags.append(f'<meta property="article:modified_time" content="{html.escape(og["modified"])}">')
    twitter_tags = []
    if og:
        twitter_tags.append('<meta name="twitter:card" content="summary_large_image">')
        if og.get('title'): twitter_tags.append(f'<meta name="twitter:title" content="{html.escape(og["title"])}">')
        if og.get('description'): twitter_tags.append(f'<meta name="twitter:description" content="{html.escape(og["description"])}">')
        if og.get('image'): twitter_tags.append(f'<meta name="twitter:image" content="{html.escape(og["image"])}">')
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description)}">
{f'<link rel="canonical" href="{html.escape(canonical)}">' if canonical else ''}
{''.join(og_tags)}
{''.join(twitter_tags)}
<link rel="stylesheet" href="{css_href}">
<script src="{header_src}" defer></script>
<script src="{footer_src}" defer></script>
<script src="{main_js}" defer></script>
{f'<script type="application/ld+json">{ld_json}</script>' if ld_json else ''}
</head>
<body>
<yk-header></yk-header>
"""

def layout_foot():
    return "</main>\n<yk-footer></yk-footer>\n</body>\n</html>\n"

def render_index(posts):
    canonical = BASE_URL + "blog"
    og = {
        "title": "Blog | YogaKiddy",
        "description": "Lecturas y novedades de YogaKiddy: yoga infantil, bienestar y comunidad.",
        "type": "website",
        "url": canonical,
        "image": DEFAULT_OG_IMAGE
    }
    items = []
    for p in posts:
        href = f'blog/{safe_slug(p.get("slug"))}.html'
        dt = p.get('published_at')
        try:
            fmt = datetime.fromisoformat(dt.replace('Z','+00:00')).strftime('%-d de %B de %Y') if dt else ''
        except Exception:
            fmt = ''
        excerpt = p.get('excerpt') or ''
        items.append(f"""
<article class="card" style="padding: 1.2rem 1.4rem; margin-bottom: 1rem; border-radius: var(--radius-lg);">
  <a href="{href}" class="link-arrow" style="font-size: 1.2rem; display: inline-block; margin-bottom: 0.25rem;">{html.escape(p.get('title',''))}</a>
  <div style="color: var(--color-text-light); font-size: 0.9rem;">{fmt}</div>
  {f'<p style="margin-top: 0.6rem; color: var(--color-text);">{html.escape(excerpt)}</p>' if excerpt else ''}
</article>
""")
    content_items = ''.join(items) or '<p>No hay artículos por ahora.</p>'
    return layout_head('Blog | YogaKiddy', 'Lecturas y novedades de YogaKiddy: yoga infantil, bienestar y comunidad.', 1, canonical=canonical, og=og) + f"""
<main>
<section class="section">
  <div class="container reveal">
    <div class="text-center mb-8">
      <span class="pill-badge">YogaKiddy</span>
      <h1>Blog</h1>
      <p class="text-large" style="max-width: 720px; margin: 0 auto;">Historias, recursos y experiencias de nuestra comunidad. Sin fotos en la lista para lectura rápida.</p>
    </div>
    <div class="container-narrow" style="max-width: 820px;">
      {content_items}
    </div>
  </div>
</section>
""" + layout_foot()

def render_post(p):
    title = p.get('title','Artículo')
    dt = p.get('published_at')
    try:
        fmt = datetime.fromisoformat(dt.replace('Z','+00:00')).strftime('%-d de %B de %Y') if dt else ''
    except Exception:
        fmt = ''
    desc = p.get('excerpt') or strip_tags(p.get('html',''), 160)
    content = rewrite_assets(p.get('html',''))
    slug = safe_slug(p.get("slug"))
    canonical = BASE_URL + f"blog/{slug}.html"
    image = p.get('image_url') or (re.search(r'images-bloggi/([a-z0-9]+\.(?:jpg|png|jpeg|gif|webp))', content) and BASE_URL + re.search(r'images-bloggi/([a-z0-9]+\.(?:jpg|png|jpeg|gif|webp))', content).group(0)) or DEFAULT_OG_IMAGE
    published_iso = dt or ''
    modified_iso = p.get('updated_at') or published_iso
    og = {
        "title": title,
        "description": desc,
        "type": "article",
        "url": canonical,
        "image": image,
        "published": published_iso,
        "modified": modified_iso
    }
    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "datePublished": published_iso,
        "dateModified": modified_iso,
        "author": {"@type": "Organization", "name": "YogaKiddy"},
        "mainEntityOfPage": canonical,
        "image": [image]
    }
    ld_json = json.dumps(ld, ensure_ascii=False)
    return layout_head(f"{title} | YogaKiddy", desc, 2, canonical=canonical, og=og, ld_json=ld_json) + f"""
<main>
<section class="section">
  <div class="container-narrow reveal">
    <a href="../blog.html" class="back-link link-arrow">← Volver al blog</a>
    <h1 class="post-title" style="font-size: clamp(2rem, 4vw, 2.6rem); margin-bottom: .5rem;">{html.escape(title)}</h1>
    <div class="post-meta" style="color: var(--color-text-light); margin-bottom: 1.2rem;">{fmt}</div>
    <article class="post-content">{content}</article>
  </div>
</section>
""" + layout_foot()

def build_sitemap(posts):
    today = datetime.now(timezone.utc).date().isoformat()
    urls = set()
    def add(loc, changefreq="weekly", priority="0.6"):
        urls.add((loc, changefreq, priority))
    # Static core pages
    add(BASE_URL, "weekly", "1.0")
    for p in ["about.html", "contact.html", "blog.html"]:
        add(BASE_URL + p, "monthly", "0.7")
    # Services HTMLs
    services_dir = os.path.join(os.getcwd(), "services")
    if os.path.isdir(services_dir):
        for name in os.listdir(services_dir):
            if name.endswith(".html"):
                add(BASE_URL + "services/" + name, "monthly", "0.7")
    # Blog posts
    for p in posts:
        slug = safe_slug(p.get("slug"))
        add(BASE_URL + f"blog/{slug}.html", "monthly", "0.6")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    for loc, changefreq, priority in sorted(urls):
        lines += [
            "  <url>",
            f"    <loc>{loc}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f"    <changefreq>{changefreq}</changefreq>",
            f"    <priority>{priority}</priority>",
            "  </url>"
        ]
    lines.append("</urlset>")
    with open(os.path.join(os.getcwd(), "sitemap.xml"), "w", encoding="utf8") as f:
        f.write("\n".join(lines) + "\n")

def main():
    cwd = os.getcwd()
    export_path = os.path.join(cwd, 'export.json')
    blog_dir = os.path.join(cwd, 'blog')
    if not os.path.exists(export_path):
        raise SystemExit('export.json no encontrado')
    with open(export_path, 'r', encoding='utf8') as f:
        data = json.load(f)
    posts = [p for p in data.get('posts', []) if p and p.get('slug') and p.get('title')]
    posts.sort(key=lambda x: x.get('published_at') or '', reverse=True)
    if not os.path.exists(blog_dir):
        os.makedirs(blog_dir, exist_ok=True)
    with open(os.path.join(cwd, 'blog.html'), 'w', encoding='utf8') as f:
        f.write(render_index(posts))
    for p in posts:
        out = os.path.join(blog_dir, f"{safe_slug(p.get('slug'))}.html")
        with open(out, 'w', encoding='utf8') as f:
            f.write(render_post(p))
    # Build redirects file for legacy URLs
    redirects_lines = []
    for p in posts:
        url = p.get("url") or ""
        m = re.match(r"https?://[^/]+(/[^?#]*)", url)
        if m:
            path_only = m.group(1)
            redirects_lines.append(f"{path_only} /blog/{safe_slug(p.get('slug'))}.html 301!")
    if redirects_lines:
        with open(os.path.join(cwd, "_redirects"), "w", encoding="utf8") as f:
            f.write("\n".join(redirects_lines) + "\n")
    # Build sitemap
    build_sitemap(posts)
    print(f"Generadas {len(posts)} páginas, sitemap.xml y redirects")

if __name__ == '__main__':
    main()
