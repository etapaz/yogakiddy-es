import csv
import datetime
import json
import re
import unicodedata
from pathlib import Path
from string import Template

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = Path("/Users/nils/Downloads/Directorio Alumnas YogaKiddy Academy_Submissions_2026-03-14.csv")
DATA_FILE = ROOT / "data-profesores.json"
COUNTRY_PAGE_PATTERN = "profesores-yoga-ninos-{}.html"


def clean_text(value: str) -> str:
    if not value:
        return ''
    text = value.replace('\r', ' ').replace('\n', ' ')
    text = re.sub(r"\s+", ' ', text)
    return text.strip()


def normalize_social(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ''
    instagram = re.search(r'instagram\.com/([^/?\s]+)', text, re.IGNORECASE)
    if instagram:
        return f"@{instagram.group(1).rstrip('/')}"
    at = re.search(r'@([A-Za-z0-9._]+)', text)
    if at:
        return f"@{at.group(1)}"
    return text


def sanitize_photo(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ''
    match = re.match(r'(https?://[^?]+)', text)
    if not match:
        return ''
    url = match.group(1)
    if re.search(r'\.(jpe?g|png|webp|gif)$', url, re.IGNORECASE):
        return text
    return ''


def normalize_age(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ''
    text = text.replace('-', ' a ')
    text = re.sub(r'\bde\b', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'\b0+(\d+)\b', r'\1', text)
    text = re.sub(r'\d+', lambda m: str(int(m.group())), text)
    match = re.match(r'^(\d{1,2})(?: a (\d{1,2}))?$', text)
    if match:
        if match.group(2):
            return f"{match.group(1)} a {match.group(2)} años"
        return f"{match.group(1)} años"
    return text


def normalize_country(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ''
    return ' '.join(word.capitalize() for word in text.split())


def normalize_city(value: str) -> str:
    text = clean_text(value)
    if not text:
        return ''
    text = text.replace(' - ', ', ')
    segments = [seg.strip() for seg in text.split(',') if seg.strip()]
    normalized = []
    for seg in segments:
        words = seg.split()
        normalized_words = []
        for word in words:
            if word.isupper() and len(word) <= 4:
                normalized_words.append(word)
            else:
                normalized_words.append(word.capitalize())
        normalized.append(' '.join(normalized_words))
    return ', '.join(normalized)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize('NFKD', value)
    ascii_text = normalized.encode('ascii', 'ignore').decode('ascii')
    slug = re.sub(r'[^a-z0-9]+', '-', ascii_text.lower()).strip('-')
    return slug or 'pais'


def build_profesores() -> list[dict]:
    rows = []
    with CSV_PATH.open('r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            submitted_at = row.get('Submitted at', '').strip()
            try:
                timestamp = datetime.datetime.strptime(submitted_at, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                timestamp = datetime.datetime.min
            rows.append((timestamp, row))
    rows.sort()

    keepers = {}
    for timestamp, row in rows:
        whatsapp = clean_text(row.get('Número de WhatsApp o Teléfono', ''))
        nombre = clean_text(row.get('Nombre y Apellido', ''))
        key = whatsapp or nombre.lower()
        existing = keepers.get(key)
        if not existing or timestamp >= existing['timestamp']:
            keepers[key] = {'timestamp': timestamp, 'row': row}

    data = []
    for entry in keepers.values():
        row = entry['row']
        data.append({
            'submissionId': clean_text(row.get('Submission ID', '')),
            'nombre': clean_text(row.get('Nombre y Apellido', '')),
            'whatsapp': clean_text(row.get('Número de WhatsApp o Teléfono', '')),
            'bio': clean_text(row.get('Una breve descripción de ti', '')),
            'foto': sanitize_photo(row.get('Sube una foto de ti para que te conozcan', '')),
            'redes': normalize_social(row.get('Página Facebook o Instagram', '')),
            'pais': normalize_country(row.get('País', '')),
            'ciudad': normalize_city(row.get('Comuna y Ciudad de tus clases', '')),
            'edades': normalize_age(row.get('Para que edades son tus clases', ''))
        })
    data.sort(key=lambda x: (x['pais'].lower(), x['ciudad'].lower(), x['nombre'].lower()))
    return data


PAGE_TEMPLATE = Template("""<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <title>Profesores de yoga para niños en $country | YogaKiddy Academy</title>
    <meta name="description" content="Encuentra instructores certificados de YogaKiddy Academy en $country y conéctate con profesores locales de yoga infantil.">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/directorio.css">
    <script src="components/header.js" defer></script>
    <script src="components/footer.js" defer></script>
    <script src="js/main.js" defer></script>
</head>

<body>
    <yk-header></yk-header>

    <main>
        <section class="directorio-hero">
            <div class="container">
                <span class="pill-badge" style="background: var(--color-white); color: var(--color-sage);">Comunidad $country</span>
                <h1 class="mb-4">Profesores de yoga para niños en $country</h1>
                <p class="text-large" style="max-width: 800px; margin: 0 auto; color: var(--color-text-light);">
                    Descubre la red de instructores certificados que impulsan el bienestar, la imaginación y la conciencia corporal de las primeras infancias en $country.
                </p>
                <p class="text-large" style="max-width: 800px; margin: 0 auto; color: var(--color-text-light);">
                    Comparamos las regiones y comunas para que encuentres al profesor adecuado sin importar dónde estés, y cada opción respeta el foco en la infancia que distingue a YogaKiddy Academy.
                </p>
            </div>
        </section>

        <section class="section" style="padding-top: 0;">
            <div class="container">
                <div class="profesores-grid" id="profesores-grid">
                    <!-- Lista de profesores por país -->
                </div>
                <div class="empty-state" id="empty-state">
                    <h3 class="mb-4">Todavía no hay profesores registrados en $country</h3>
                    <p>Estamos expandiendo nuestra comunidad en $country; vuelve pronto o contáctanos para sumar tu clase.</p>
                </div>
            </div>
        </section>
    </main>

    <yk-footer></yk-footer>

    <script type="module">
        import { initProfesores } from './js/render-profesores.js';
        document.addEventListener('DOMContentLoaded', () => {
            initProfesores({
                gridId: 'profesores-grid',
                emptyStateId: 'empty-state',
                filterCountry: '$country',
                filtersEnabled: false
            });
        });
    </script>
</body>

</html>
""")


def update_directorio_data_block(data_json: str):
    html_path = ROOT / 'directorio-profesores.html'
    text = html_path.read_text(encoding='utf-8')
    start_marker = '<script id="profesores-data" type="application/json">'
    start = text.index(start_marker) + len(start_marker)
    end = text.index('</script>', start)
    block = '\n' + '\n'.join('        ' + line for line in data_json.splitlines()) + '\n    '
    new_text = text[:start] + block + text[end:]
    html_path.write_text(new_text, encoding='utf-8')


def generate_country_pages(data: list[dict]):
    countries = sorted({entry['pais'] for entry in data if entry['pais']})
    generated = set()

    for country in countries:
        slug = slugify(country)
        filename = COUNTRY_PAGE_PATTERN.format(slug)
        page_path = ROOT / filename
        generated.add(page_path)
        page_html = PAGE_TEMPLATE.substitute(country=country)
        page_path.write_text(page_html, encoding='utf-8')

    existing = set(ROOT.glob('profesores-yoga-ninos-*.html'))
    for path in existing - generated:
        path.unlink()


def main():
    data = build_profesores()
    json_text = json.dumps(data, ensure_ascii=False, indent=4)
    DATA_FILE.write_text(json_text, encoding='utf-8')
    update_directorio_data_block(json_text)
    generate_country_pages(data)


if __name__ == '__main__':
    main()
