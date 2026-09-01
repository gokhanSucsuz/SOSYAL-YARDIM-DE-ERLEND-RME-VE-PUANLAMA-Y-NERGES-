import { calculateAssistanceFromScore } from './db';

export function isOldSystemRecord(result: any) {
  return result && result.scoreG !== undefined;
}

export function isRejectedRecord(result: any) {
  if (!result) return false;
  if (result.isRejected) return true;
  const threshold = isOldSystemRecord(result) ? 50 : 10;
  return result.totalScore < threshold;
}

export function calculateNewSystemScore(state: any) {
  let rawScoreA = state.income || 0;
  if (state.noWorker) rawScoreA += 3;
  if (state.noRegularIncome) rawScoreA += 2;
  if (state.noSgk) rawScoreA += 2;
  const scoreA = Math.max(0, Math.min(rawScoreA, 25));

  let scoreB = 0;
  if (state.b_agirEngelli) scoreB += 12;
  if (state.b_engelli) scoreB += 8;
  if (state.b_dusukEngelli) scoreB += 3;
  if (state.b_evdeBakim) scoreB += 8;
  if (state.b_kanser) scoreB += 8;
  if (state.b_kronik) scoreB += 5;
  if (state.b_yasliYalniz) scoreB += 6;
  if (state.b_sehitYakini) scoreB += 6;
  if (state.b_gazi) scoreB += 6;
  if (state.b_yetim) scoreB += 4;
  if (state.b_koruyucuAile) scoreB += 4;
  if (state.b_yabanciUyruklu) scoreB += 2;
  if (!state.b_ozelSebepPuanBekliyor && state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) > 0) {
    scoreB += Number(state.b_ozelSebepPuan);
  }
  if (state.b_cokluOzelDurumluBirey) scoreB += 4;
  scoreB = Math.min(scoreB, 25);

  const disadvantageCount = [
    state.b_agirEngelli, state.b_engelli, state.b_dusukEngelli,
    state.b_evdeBakim, state.b_kanser, state.b_kronik,
    state.b_yasliYalniz, state.b_sehitYakini, state.b_gazi,
    state.b_yetim, state.b_koruyucuAile, state.b_yabanciUyruklu
  ].filter(Boolean).length;

  let scoreC = 0;
  if (state.e_siddetMagduru) scoreC += 5;
  if (state.e_kadinReis) scoreC += 4;
  if (state.e_esiCezaevinde) scoreC += 4;
  if (state.e_afetGelirKaybi) scoreC += 4;
  if (state.e_maddeBagimliligi) scoreC += 4;
  if (state.e_sosyalGuvencesiz) scoreC += 4;
  if (state.e_icraBorcBaskisi) scoreC += 3;
  if (state.e_gebelikBebek) scoreC += 3;
  if (state.e_bosanmis) scoreC += 2;
  if (state.e_dul) scoreC += 2;
  if (state.e_hukumluYakin) scoreC += 2;
  const hhSize = state.householdSize || 1;
  if (hhSize >= 7) scoreC += 4;
  else if (hhSize >= 5) scoreC += 3;
  else if (hhSize >= 3) scoreC += 2;
  else scoreC += 1;
  scoreC = Math.min(scoreC, 15);

  let scoreD = 0;
  scoreD += (state.c_0_6yas || 0) * 2;
  scoreD += (state.c_ilkokul || 0) * 2;
  scoreD += (state.c_ortaokul || 0) * 2;
  scoreD += (state.c_lise || 0) * 3;
  scoreD += (state.c_meslekiEgitim || 0) * 3;
  scoreD += (state.c_acikLise || 0) * 2;
  scoreD += (state.c_uni || 0) * 4;
  scoreD = Math.min(scoreD, 15);

  let scoreE = 0;
  if (state.d_evsiz) scoreE += 8;
  if (state.d_afetzede) scoreE += 8;
  if (state.d_agirHasarli) scoreE += 6;
  if (state.d_sagliksiz) scoreE += 4;
  if (state.d_dereYatagi) scoreE += 4;
  if (state.d_kiraci) scoreE += 3;
  if (state.d_tahliyeBaskisi) scoreE += 3;
  if (state.d_isinmaProblem) scoreE += 2;
  if (state.d_gecekondu) scoreE += 2;
  if (state.d_asansorsuzYuksek) scoreE += 2;
  if (state.d_tuvaletBanyoYetersiz) scoreE += 2;
  
  let rawAppliances = 0;
  if (state.appliance_buzdolabi === 'yok') rawAppliances += 1.5;
  if (state.appliance_camasir === 'yok') rawAppliances += 1.5;
  if (state.appliance_firin === 'yok') rawAppliances += 1;
  if (state.appliance_tv === 'yok') rawAppliances += 0.5;
  scoreE += Math.min(3, rawAppliances);
  scoreE = Math.min(scoreE, 10);

  const scoreF = Math.min(
    (state.f_yasamKosullari || 0) + (state.f_aciliyet || 0) + (state.f_sosyalDestek || 0) + (state.f_risk || 0),
    10
  );

  let scorePenalty = 0;
  if (state.a_aracSahibi) scorePenalty += 15;
  if (state.a_aktifSgkPrim) scorePenalty += 5;
  if (state.a_birdenFazlaTasinmaz) scorePenalty += 20;
  if (state.a_son3AyYardimAldi && (state.a_son3AyYardimKisi || 0) > 0) {
    scorePenalty += (state.a_son3AyYardimKisi || 0) * 5;
  }

  const rawTotal = scoreA + scoreB + scoreC + scoreD + scoreE + scoreF;
  const totalScore = state.falseStatement ? 0 : Math.max(0, Math.round(rawTotal - scorePenalty));
  
  const hasIncomeVulnerability = !!(state.income && state.income > 0);
  const assistance = calculateAssistanceFromScore(totalScore, !!state.falseStatement, undefined, hasIncomeVulnerability);

  const priorities: string[] = [];
  if (state.b_agirEngelli) priorities.push('Ağır engelli bulunan hane');
  if (state.b_cokluOzelDurumluBirey) priorities.push('Hanede Birden Fazla Özel Durumlu Birey');
  if (state.b_yetim) priorities.push('Yetim çocuk bulunan hane');
  if (state.b_sehitYakini || state.b_gazi) priorities.push('Şehit / Gazi Ailesi');
  if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push('Afet Mağduru');
  if (state.b_yasliYalniz) priorities.push('Yaşlı ve Yalnız Yaşayan');
  if (state.e_siddetMagduru) priorities.push('Aile İçi Şiddet Mağduru');
  if (state.a_aracSahibi || state.a_birdenFazlaTasinmaz) priorities.push('Varlık Testi: Ceza Puanı Uygulandı');
  if (state.appliance_buzdolabi === 'yok' || state.appliance_camasir === 'yok') {
    priorities.push('Temel Ev Eşyası Eksikliği (Buzdolabı / Çamaşır M.)');
  }

  return { scoreA, scoreB, scoreC, scoreD, scoreE, scoreF, scorePenalty, totalScore, assistance, priorities, isRejected: !!state.falseStatement, disadvantageCount };
}
