const https = require('https');
const fs = require('fs');
const path = require('path');

const posts = [
  { url: 'https://www.instagram.com/nicolevaleriofotografia/p/DE3YbHSyP8q/', file: 'ig_post_1.jpg' },
  { url: 'https://www.instagram.com/nicolevaleriofotografia/p/DfdCp9nm-j8/', file: 'ig_post_2.jpg' },
  { url: 'https://www.instagram.com/nicolevaleriofotografia/p/DZOWAQHCe8E/', file: 'ig_post_3.jpg' },
  { url: 'https://www.instagram.com/nicolevaleriofotografia/p/DN1rYQU0ksm/', file: 'ig_post_4.jpg' },
  { url: 'https://www.instagram.com/nicolevaleriofotografia/p/DGlRz09Rqog/', file: 'ig_post_5.jpg' }
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const destDir = path.join(__dirname, 'assets', 'images', 'studionvf');
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    console.log(`[${i+1}/${posts.length}] Obteniendo: ${p.url}`);
    try {
      const html = await fetchHtml(p.url);
      const match = html.match(/property="og:image"\s+content="([^"]+)"/i) || html.match(/content="([^"]+)"\s+property="og:image"/i);
      if (match) {
        let imgUrl = match[1].replace(/&amp;/g, '&');
        console.log(`  -> URL Imagen encontrada: ${imgUrl.substring(0, 60)}...`);
        const destPath = path.join(destDir, p.file);
        await downloadImage(imgUrl, destPath);
        const stats = fs.statSync(destPath);
        console.log(`  -> Guardada en ${p.file} (${stats.size} bytes)`);
      } else {
        console.log(`  -> No se encontró og:image`);
      }
    } catch (err) {
      console.error(`  -> Error:`, err.message);
    }
  }
  console.log('¡Proceso finalizado!');
}

run();
