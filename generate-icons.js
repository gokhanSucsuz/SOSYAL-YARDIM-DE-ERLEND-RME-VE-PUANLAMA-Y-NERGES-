const fs = require('fs');
const { PNG } = require('pngjs');

function createIcon(size, filename) {
  const png = new PNG({ width: size, height: size });
  
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) << 2;
      
      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Squircle/rounded rect for icon
      const cornerRadius = size * 0.22;
      const rx = Math.max(0, Math.abs(dx) - (cx - cornerRadius));
      const ry = Math.max(0, Math.abs(dy) - (cy - cornerRadius));
      const boxDist = Math.sqrt(rx * rx + ry * ry);

      if (boxDist <= cornerRadius) {
        // Inside rounded rect badge
        // Gradient background: #1e293b (slate 800) to #0f172a (slate 900)
        const t = y / size;
        const r = Math.round(30 * (1 - t) + 15 * t);
        const g = Math.round(41 * (1 - t) + 23 * t);
        const b = Math.round(59 * (1 - t) + 42 * t);

        // Gold/blue emblem in center: Heart & Hands emblem shape or shield
        const innerRadius = size * 0.22;
        const isEmblemCircle = dist <= innerRadius && dist >= innerRadius * 0.65;
        const isCenterDot = dist <= innerRadius * 0.35;
        
        // Horizontal bar (hands holding/supporting)
        const isBar = Math.abs(dy - size * 0.05) < size * 0.035 && Math.abs(dx) < innerRadius * 1.1;

        if (isEmblemCircle || isCenterDot || isBar) {
          // Amber / Gold accent (#f59e0b)
          png.data[idx] = 245;     // R
          png.data[idx + 1] = 158; // G
          png.data[idx + 2] = 11;  // B
          png.data[idx + 3] = 255;
        } else {
          png.data[idx] = r;
          png.data[idx + 1] = g;
          png.data[idx + 2] = b;
          png.data[idx + 3] = 255;
        }
      } else {
        // Transparent background outside squircle (for maskable/any)
        // Note: For maskable, safe zone is inner 80% circle
        png.data[idx] = 15;      // slate 900
        png.data[idx + 1] = 23;
        png.data[idx + 2] = 42;
        png.data[idx + 3] = 255; // Always opaque background for PWA icons
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync('public/' + filename, buffer);
  console.log(`Generated ${filename} (${size}x${size}, ${buffer.length} bytes)`);
}

createIcon(192, 'icon-192.png');
createIcon(192, 'icon.png');
createIcon(512, 'icon-512.png');
createIcon(180, 'apple-touch-icon.png');
createIcon(512, 'logo.png');

console.log('All icons generated successfully with valid PNG headers!');
