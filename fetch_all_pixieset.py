import urllib.request
import json
import re
import os

base_url = 'https://studionvf.pixieset.com'
collections = [
    'boda',
    'marcapersonal',
    'parejas',
    'parejasplaya',
    'embarazo',
    'familia',
    'revelaciondegenero',
    'cumpleanos',
    'navidad',
    'gastronomia',
    'eventos'
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

all_data = {}

for col in collections:
    page_url = f'{base_url}/{col}/'
    print(f'Fetching collection page for {col}...')
    try:
        req = urllib.request.Request(page_url, headers={'User-Agent': headers['User-Agent']})
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        
        # Extract collectionId and currentGallery or allGalleries
        cid_match = re.search(r"'collectionId':\s*([0-9]+)", html)
        cname_match = re.search(r"'collectionName':\s*'([^']+)'", html)
        cover_match = re.search(r'//images\.pixieset\.com/[0-9a-zA-Z_\-\/]+\-cover[a-zA-Z0-9_\-\.]*\.jpg', html)
        if not cover_match:
            cover_match = re.search(r'//images\.pixieset\.com/[0-9a-zA-Z_\-\/]+\-(?:large|xlarge|cover)\.jpg', html)
            
        cur_gallery = 'destacados'
        slug_match = re.search(r"'currentGallery':\s*'([^']+)'", html)
        if slug_match:
            cur_gallery = slug_match.group(1)
            
        if not cid_match:
            print(f'  Could not find collectionId for {col}')
            continue
            
        cid = cid_match.group(1)
        cname = cname_match.group(1) if cname_match else col.capitalize()
        cover_url = ('https:' + cover_match.group(0)) if cover_match else None
        
        print(f'  Found {col} (ID: {cid}, Name: {cname}, Gallery: {cur_gallery})')
        
        # Now fetch photos via API
        api_url = f'{base_url}/client/loadphotos/?cuk={col}&cid={cid}&gs={cur_gallery}&page=0&all=1'
        req_api = urllib.request.Request(api_url, headers={**headers, 'Referer': page_url})
        resp = urllib.request.urlopen(req_api, timeout=15)
        res_json = json.loads(resp.read().decode('utf-8'))
        
        photos_list = []
        if res_json.get('status') == 'success' and res_json.get('content'):
            raw_photos = json.loads(res_json['content'])
            for p in raw_photos:
                large = p.get('pathLarge', '')
                if large and not large.startswith('http'):
                    large = 'https:' + large
                xlarge = p.get('pathXlarge', '')
                if xlarge and not xlarge.startswith('http'):
                    xlarge = 'https:' + xlarge
                medium = p.get('pathMedium', '')
                if medium and not medium.startswith('http'):
                    medium = 'https:' + medium
                thumb = p.get('pathThumb', '')
                if thumb and not thumb.startswith('http'):
                    thumb = 'https:' + thumb
                
                photos_list.append({
                    'id': p.get('id'),
                    'name': p.get('name'),
                    'width': p.get('width'),
                    'height': p.get('height'),
                    'large': large,
                    'xlarge': xlarge,
                    'medium': medium,
                    'thumb': thumb
                })
        
        all_data[col] = {
            'slug': col,
            'title': cname,
            'collectionId': cid,
            'cover': cover_url if cover_url else (photos_list[0]['large'] if photos_list else ''),
            'photoCount': len(photos_list),
            'photos': photos_list
        }
        print(f'  Loaded {len(photos_list)} photos for {col}')
    except Exception as e:
        print(f'  Error loading {col}: {e}')

with open('studionvf_all_photos.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=2, ensure_ascii=False)

print('\nSuccessfully saved studionvf_all_photos.json!')
for slug, data in all_data.items():
    print(f"- {data['title']} ({slug}): {data['photoCount']} photos, cover: {data['cover']}")
