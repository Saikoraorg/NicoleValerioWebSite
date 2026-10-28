import json

with open('studionvf_all_photos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Format for browser consumption
catalog_clean = {}
for slug, col in data.items():
    catalog_clean[slug] = {
        'slug': slug,
        'title': col['title'].replace('\\x20', ' ').replace('\\u00F1', 'ñ'),
        'cover': f'assets/images/studionvf/cover_{slug}.jpg',
        'cdnCover': col.get('cover', ''),
        'photoCount': col['photoCount'],
        'photos': col['photos'][:24] # top 24 photos per collection for smooth fast loading
    }

js_content = f"window.STUDIO_NVF_CATALOG = {json.dumps(catalog_clean, indent=2, ensure_ascii=False)};"

with open('js/catalog-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Generated js/catalog-data.js successfully!')
