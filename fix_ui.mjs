import fs from 'fs';

const files = [
  'app/assessment/new/page.tsx',
  'app/assessment/[id]/edit/page.tsx',
  'app/page.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // 1. maxScore fixes
  content = content.replace(/maxScore=\{35\}/g, 'maxScore={30}');
  content = content.replace(/maxScore=\{15\}\s+currentScore=\{calc\.scoreD\}/g, 'maxScore={10} currentScore={calc.scoreD}');

  // 2. Ozel Sebep fix: We need to hide/disable b_ozelSebepPuan for personnel, or just change the max to 10.
  // Actually, let's limit max to +10. The UI has <option value="15">, <option value="20">, <option value="25">.
  content = content.replace(/<option value="15">\+15 Puan<\/option>/g, '');
  content = content.replace(/<option value="20">\+20 Puan<\/option>/g, '');
  content = content.replace(/<option value="25">\+25 Puan<\/option>/g, '');
  
  // 3. Bulasik Makinesi fix: change pointsYok={1} pointsEski={0.5} to pointsYok={0} pointsEski={0}
  // Let's find appliance_bulasik
  content = content.replace(/onChange=\{\(v:\s*any\)\s*=>\s*set\('appliance_bulasik',\s*v\)\}\s*pointsYok=\{1\}\s*pointsEski=\{0\.5\}/g, "onChange={(v: any) => set('appliance_bulasik', v)} pointsYok={0} pointsEski={0}");

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
