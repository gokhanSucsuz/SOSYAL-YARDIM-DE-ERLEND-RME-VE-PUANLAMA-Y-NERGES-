import fs from 'fs';

const files = [
  'app/assessment/new/page.tsx',
  'app/assessment/[id]/edit/page.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix scoreC max logic and education weights
  content = content.replace(/scoreC \+= \(state\.c_lise \|\| 0\) \* 3;/g, 'scoreC += (state.c_lise || 0) * 3;');
  // Wait, let's just replace the whole scoreC block.
  const scoreCRegex = /let scoreC = 0;[\s\S]*?scoreC = Math\.min\(scoreC, 15\);/g;
  const newScoreC = `let scoreC = 0;
    scoreC += (state.c_0_6yas || 0) * 2;
    scoreC += (state.c_ilkokul || 0) * 2;
    scoreC += (state.c_ortaokul || 0) * 2;
    scoreC += (state.c_lise || 0) * 3;
    scoreC += (state.c_meslekiEgitim || 0) * 3;
    scoreC += (state.c_acikLise || 0) * 3;
    scoreC += (state.c_uni || 0) * 4;
    scoreC = Math.min(scoreC, 15);`;
  content = content.replace(scoreCRegex, newScoreC);
  
  // Actually, wait, scoreC max was 10 in the code? Let me check the regex again. If it was Math.min(scoreC, 10), then:
  content = content.replace(/scoreC = Math\.min\(scoreC, 10\);/g, 'scoreC = Math.min(scoreC, 15);');

  // Fix scoreF hhSize logic
  const scoreFRegex = /const hhSize = state\.householdSize \|\| 1;\s*if \(hhSize >= 7\) scoreF \+= 6;\s*else if \(hhSize >= 5\) scoreF \+= 4;\s*else if \(hhSize >= 3\) scoreF \+= 2;\s*else scoreF \+= 1;/g;
  const newScoreF = `const hhSize = state.householdSize || 1;
    if (hhSize >= 7) scoreF += 6;
    else if (hhSize >= 5) scoreF += 4;
    else if (hhSize >= 3) scoreF += 2;
    else scoreF += 1;`;
  content = content.replace(scoreFRegex, newScoreF); // this actually is already the same? Wait, EKSİK 4 said "Mevcut Durum: Hane büyüklüğü yalnızca F bölümünde ">=5 kişi: +3, <5 kişi: +1" olarak..."
  // BUT the code I dumped earlier had: 
  // if (hhSize >= 7) scoreF += 6; else if (hhSize >= 5) scoreF += 4; else if (hhSize >= 3) scoreF += 2; else scoreF += 1;
  // This means the previous AI ALREADY FIXED EKSİK 4!
  
  // Let me check if bulaşık makinesi is already removed from rawScoreE in calc!
  // "if (state.appliance_bulasik === 'yok') rawScoreE += 1; else if (state.appliance_bulasik === 'eski') rawScoreE += 0.5;"
  // If it was already removed, we don't need to change `calc` for E!
  // In the dump: "// Bulaşık makinesi: 0 puan (lüks eşya - çıkarıldı)" - Yes! The previous AI already fixed the code logic for E!
  
  // What about C? The dump said:
  // let scoreC = 0; scoreC += (state.c_0_6yas || 0) * 2; ... scoreC += (state.c_uni || 0) * 4; scoreC = Math.min(scoreC, 15);
  // It was ALREADY FIXED! EKSİK 3 is done!
  
  // What about b_dusukEngelli? The dump said: `if (state.b_dusukEngelli) scoreB += 3;`
  // EKSİK 9 is done!

  // What about EKSİK 2: Varlık testi (Tapu/Araç). The dump said:
  // if (state.a_aracSahibi) scorePenalty += 15;
  // if (state.a_birdenFazlaTasinmaz) scorePenalty += 20;
  // And `const scoreA = state.a_aktifSgkPrim ? 0 : ...`
  // IT WAS ALREADY FIXED!

  // So all of those calc logic issues were ALREADY FIXED by the previous AI before it died!
  
  fs.writeFileSync(file, content, 'utf8');
}
