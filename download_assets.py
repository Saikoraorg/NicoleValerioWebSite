import os
import urllib.request
import json

os.makedirs('assets/images/studionvf', exist_ok=True)

with open('studionvf_all_photos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

headers = {'User-Agent': 'Mozilla/5.0'}

# Download covers for each collection
for slug, col in data.items():
    cover_url = col.get('cover')
    if not cover_url and col.get('photos'):
        cover_url = col['photos'][0]['large']
    
    if cover_url:
        local_path = f'assets/images/studionvf/cover_{slug}.jpg'
        if not os.path.exists(local_path):
            try:
                print(f'Downloading cover for {slug}: {cover_url}')
                req = urllib.request.Request(cover_url, headers=headers)
                with urllib.request.urlopen(req, timeout=15) as resp:
                    with open(local_path, 'wb') as out_f:
                        out_f.write(resp.read())
            except Exception as e:
                print(f'Failed {slug}: {e}')

# Download featured photos for hero, work, and follow
featured = [
    # Hero portrait (from marcapersonal)
    ('hero_nicole.jpg', data['marcapersonal']['photos'][0]['large']),
    # Work 1: Marca personal
    ('work_1.jpg', data['marcapersonal']['photos'][1]['large']),
    # Work 2: Boda
    ('work_2.jpg', data['boda']['photos'][0]['large']),
    # Work 3: Parejas Playa
    ('work_3.jpg', data['parejasplaya']['photos'][0]['large']),
    # Press 1 to 6
    ('press_1.jpg', data['boda']['photos'][1]['large']),
    ('press_2.jpg', data['marcapersonal']['photos'][2]['large']),
    ('press_3.jpg', data['parejas']['photos'][0]['large']),
    ('press_4.jpg', data['embarazo']['photos'][0]['large']),
    ('press_5.jpg', data['familia']['photos'][0]['large']),
    ('press_6.jpg', data['gastronomia']['photos'][0]['large']),
    # Follow @_studionvf strip (6 photos)
    ('follow_1.jpg', data['parejasplaya']['photos'][1]['large']),
    ('follow_2.jpg', data['marcapersonal']['photos'][3]['large']),
    ('follow_3.jpg', data['boda']['photos'][2]['large']),
    ('follow_4.jpg', data['embarazo']['photos'][1]['large']),
    ('follow_5.jpg', data['familia']['photos'][1]['large']),
    ('follow_6.jpg', data['gastronomia']['photos'][1]['large']),
]

for filename, url in featured:
    target = f'assets/images/studionvf/{filename}'
    if not os.path.exists(target):
        try:
            print(f'Downloading {filename}...')
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                with open(target, 'wb') as out_f:
                    out_f.write(resp.read())
        except Exception as e:
            print(f'Failed {filename}: {e}')

print('Finished downloading Studio NVF assets!')
