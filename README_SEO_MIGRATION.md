SEO Migration for GitHub Pages (Static HTML)
Objective: migrate to a static site with zero loss of organic traffic, no content duplication, and smooth crawl/indexing by Google.

What you get with this approach
- Canonical URLs on every page
- Sitemap.xml and Robots.txt kept up-to-date
- Redirects from old URLs to new canonical URLs using static HTML pages (GitHub Pages friendly)
- Simple internal linking plan to preserve interlinks

Prerequisites
- You have export.json from your CMS/export tool containing the list of old URLs and new slugs.
- Your site is served from GitHub Pages (gh-pages or docs folder) with static HTML files.

Step-by-step plan
1) Generate migration artifacts (redirects, sitemap, robots)
- Run the tool to produce redirects and HTML redirects (optional for GitHub Pages):
  python3 scripts/seo_migration_tools.py --export-file export.json --domain https://yogakiddy.com --out-dir seo_migration_output --html-redirects
- This creates:
  - seo_migration_output/redirects.json
  - seo_migration_output/redirects_netlify.txt (backup for Netlify if needed)
  - seo_migration_output/sitemap.xml
  - seo_migration_output/robots.txt
  - seo_migration_output/redirects_html/... (HTML redirect pages for old URLs)

2) Prepare GitHub Pages deployment
- Copy the generated artifacts to your GitHub Pages repo
  - sitemap.xml → root of gh-pages/docs (or root if using root gh-pages branch)
  - robots.txt → root
  - For redirects:
    • If you used --html-redirects, copy seo_migration_output/redirects_html to a directory in your repo (e.g., redirects/)
    • Each old URL path should map to an index.html with a meta refresh redirect to the new URL
  - Commit and push

3) Optional: quick HTML redirect example (one file)
  For an old URL /old-path/ that redirects to /new-path/:
  Create file: redirects/old-path/index.html
  Content:
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0; url=https://yogakiddy.com/new-path/">
    <link rel="canonical" href="https://yogakiddy.com/new-path/">
  </head>
  <body>
    Redirecting to <a href="https://yogakiddy.com/new-path/">https://yogakiddy.com/new-path/</a>
  </body>
  </html>

4) Validate after deployment
- Use Google Search Console:
  - Submit sitemap.xml
  - Inspect URLs to ensure canonical URL is the one indexed
- Test redirects manually:
  curl -I https://yogakiddy.com/old-path/
- Check that CSS/JS assets are loading (robots.txt does not block important assets)
- Monitor 4xx/5xx in your server logs for the first 48–72h

5) Ongoing maintenance
- Update sitemap.xml on content changes
- Keep canonical tags in all pages
- Maintain clean interlinks to important pages
- If you add multilingual support later, add hreflang and language-specific sitemaps

Notes et conseils
- Sur GitHub Pages, les redirects via HTML sont simples et robustes, mais Google peut prendre un peu de temps pour refléter les redirections; la surveillance dans GSC est clé.
- Evitez les noindex sur des pages clés. Misez sur canonical et redirects 301 pour gérer l’ancien contenu.
- Testez régulièrement les pages critiques (homepage, pages de formations, fiches produit si existantes).

Si tu veux, je peux te générer directement le patch Git (fichiers à ajouter/déployer) prêt à pousser, et te décrire exactement quels fichiers copier dans ta repo GitHub Pages. Cette version est volontairement simple et sans dépendances Jekyll.
