const fs = require('fs');
const { PNG } = require('pngjs');

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });
  
  // Create a simple blue background with a white center
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      
      const isMargin = x < size * 0.1 || x > size * 0.9 || y < size * 0.1 || y > size * 0.9;
      
      // Blue background #2563eb
      png.data[idx] = 37;      // R
      png.data[idx + 1] = 99;  // G
      png.data[idx + 2] = 235; // B
      png.data[idx + 3] = 255; // A (opaque)

      // Inner white square
      if (!isMargin) {
        png.data[idx] = 255;
        png.data[idx + 1] = 255;
        png.data[idx + 2] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync('public/' + filename, buffer);
  console.log('Created ' + filename);
}

createIcon(192, 'icon-192.png');
createIcon(192, 'icon.png');
createIcon(512, 'icon-512.png');
createIcon(180, 'apple-touch-icon.png');
createIcon(32, 'favicon.ico'); // Just renaming a 32x32 png to ico works well enough for modern browsers
