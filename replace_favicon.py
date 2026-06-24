import os
import re

dir_path = "."

pattern = re.compile(r'<link rel="icon" type="image/png" sizes="32x32" href="[^"]*favicon-32x32\.png">\s*<link rel="icon" type="image/png" sizes="16x16" href="[^"]*favicon-16x16\.png">')
replacement = r"<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧘‍♀️</text></svg>\">"

count_total = 0
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content, count = pattern.subn(replacement, content)
            if count > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count_total += 1

print(f"Updated {count_total} files.")
