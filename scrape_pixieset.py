import urllib.request
import re
import json

base_url = 'https://studionvf.pixieset.com'
collections = [
    'parejasplaya', 'marcapersonal', 'familia', 'revelaciondegenero',
    'cumpleanos', 'navidad', 'boda', 'parejas', 'embarazo', 'gastronomia', 'eventos'
]

results = {}

for col in collections:
    url = f'{base_url}/{col}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        
        # Pixieset embeds photos in HTML or JSON
        # Find all images.pixieset.com URLs
        imgs = re.findall(r'//images\.pixieset\.com/[0-9a-zA-Z_\-\/\.]+', html)
        clean_imgs = []
        for img in imgs:
            full = 'https:' + img
            # filter out icons or tiny thumbnails if any
            if any(k in full for k in ['-large.jpg', '-xlarge.jpg', '-xxlarge.jpg', '-medium.jpg']):
                clean_imgs.append(full)
        
        clean_imgs = list(dict.fromkeys(clean_imgs))
        results[col] = clean_imgs
        print(f'{col}: {len(clean_imgs)} photos found')
        for img in clean_imgs[:3]:
            print(f'   {img}')
    except Exception as e:
        print(f'{col}: error {e}')

with open('pixieset_photos.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print('Saved to pixieset_photos.json')
