process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const images = {
  'coxinha.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIJYHqqeDy__kceZT6wlehzTPbw1kFuaA2Co5wWPu7G9TiYnu9H7MKXVlXSEtv9ILiCFTRgSsW-eZBy9eyat4IUnwqEJOyy8W-4Sc33g&s=10',
  'hamburguer.jpg': 'https://i.ytimg.com/vi/KMWn8PfBWbE/hq720.jpg',
  'strogonoff.jpg': 'https://www.receiteria.com.br/wp-content/uploads/strogonoff-de-frango-simples-e-rapido.jpeg',
  'pf.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREaqZzZWqQLXMHEN4Q7dhRbj11p01hDhVBhg&s',
  'brigadeiro.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe0Ae5U3RgEfG7xOMhbWGZi9GG1taLjBCd8w&s',
  'brownie.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThH-OCQG06tid0ZSsYwUaDT2Y59ubmDZPdsQ&s',
  'cookies.jpg': 'https://i.ytimg.com/vi/XjIdqAdzGoE/maxresdefault.jpg',
  'quindim.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm2VacFBeL44uWOOTDs5zqubevS29pjoemyQ&s',
  'beijinho.jpg': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSwE9RfaEFk2Ejtk6LrXFGSYkcH6fe0nqNzQ&s',
  'arroz_doce.jpg': 'https://www.receitasnestle.com.br/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/a3ea1be90cbae91368a1775275c293c8.jpeg',
  'suco_laranja.jpg': 'https://padariasantacruz.loji.com.br/storage/uploads/3lxHLWQkcJYRJcc1XNQ026DwgJwKXrVh6gjaX3o3.jpeg',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

(async () => {
  for (const [name, url] of Object.entries(images)) {
    const dest = path.join(dir, name);
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`OK: ${name} (${(size/1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log(`FALHOU: ${name} - ${e.message}`);
    }
  }
  console.log('\nDownload concluído!');
})();
