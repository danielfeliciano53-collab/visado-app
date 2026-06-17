const sharp = require('sharp');
const path = require('path');

async function optimize() {
  // Logo mark — used small in sidebar/header, needs to be crisp but light
  await sharp(path.join(__dirname, '../public/Visado_logo.png'))
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(path.join(__dirname, '../public/visado-logo.png'));

  // Hero image — larger but still web-optimized
  await sharp(path.join(__dirname, '../public/Visado_hero.png'))
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(path.join(__dirname, '../public/visado-hero.png'));

  console.log('Optimization complete.');
}

optimize().catch(console.error);
