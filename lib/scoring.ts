import { calculateAssistanceFromScore, getSystemSettings, DEFAULT_SETTINGS } from './db';

/**
 * T.C. Kimlik Numarası resmi 11 hane algoritmik doğrulama fonksiyonu
 */
export function isValidTcKimlik(tc: string): boolean {
  if (!tc || typeof tc !== 'string' || tc.length !== 11 || !/^[1-9][0-9]{10}$/.test(tc)) {
    return false;
  }
  const digits = tc.split('').map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  const tenthDigit = ((oddSum * 7) - evenSum) % 10;
  const correctedTenth = tenthDigit < 0 ? tenthDigit + 10 : tenthDigit;
  if (digits[9] !== correctedTenth) return false;

  const firstTenSum = digits.slice(0, 10).reduce((acc, val) => acc + val, 0);
  if (digits[10] !== firstTenSum % 10) return false;

  return true;
}

export function isOldSystemRecord(result: any) {
  return result && result.scoreG !== undefined;
}

export function isRejectedRecord(result: any) {
  if (!result) return false;
  if (result.isRejected) return true;
  const threshold = isOldSystemRecord(result) ? 50 : 10;
  return result.totalScore < threshold;
}

/**
 * Literatür Tabanlı 100 Puanlık Değerlendirme Algoritması
 * Modül A: Ekonomik Durum (Maks 25 Puan) - Means Testing
 * Modül B: Dezavantajlı Bireyler (Maks 25 Puan) - BM Çoklu Kırılganlık İlkesi
 * Modül C: Sosyal Kırılganlık ve Hane Nüfusu (Maks 15 Puan) - OECD Modifiye Eşdeğerlik Ölçeği
 * Modül D: Eğitim ve Çocuk (Maks 15 Puan) - Şartlı Eğitim Yardımı (ŞEY)
 * Modül E: Barınma ve Temel Eşya (Maks 10 Puan) - UNDP Barınma Endeksi
 * Modül F: Görevli İnceleme Kanaati (Maks 10 Puan) - Sosyal Hizmet Uzman Kanaati (Professional Judgment)
 * Toplam: 100 Puan
 */
export function calculateNewSystemScore(state: any) {
  // A. Ekonomik Durum (Maks 25 Puan)
  let rawScoreA = Number(state.income) || 0;
  if (state.noWorker) rawScoreA += 3;
  if (state.noRegularIncome) rawScoreA += 2;
  if (state.noSgk) rawScoreA += 2;
  const scoreA = Math.max(0, Math.min(rawScoreA, 25));

  // B. Dezavantajlı Bireyler (Maks 25 Puan)
  let rawScoreB = 0;
  if (state.b_agirEngelli) rawScoreB += 12;
  if (state.b_engelli) rawScoreB += 8;
  if (state.b_dusukEngelli) rawScoreB += 3;
  if (state.b_evdeBakim) rawScoreB += 8;
  if (state.b_kanser) rawScoreB += 8;
  if (state.b_kronik) rawScoreB += 5;
  if (state.b_yasliYalniz) rawScoreB += 6;
  if (state.b_sehitYakini) rawScoreB += 6;
  if (state.b_gazi) rawScoreB += 6;
  if (state.b_yetim) rawScoreB += 4;
  if (state.b_koruyucuAile) rawScoreB += 4;
  if (state.b_yabanciUyruklu) rawScoreB += 2;
  if (!state.b_ozelSebepPuanBekliyor && state.b_ozelSebepPuan && Number(state.b_ozelSebepPuan) !== 0) {
    rawScoreB += Number(state.b_ozelSebepPuan);
  }
  if (state.b_cokluOzelDurumluBirey) rawScoreB += 4;
  const scoreB = Math.max(0, Math.min(rawScoreB, 25));

  const disadvantageCount = [
    state.b_agirEngelli, state.b_engelli, state.b_dusukEngelli,
    state.b_evdeBakim, state.b_kanser, state.b_kronik,
    state.b_yasliYalniz, state.b_sehitYakini, state.b_gazi,
    state.b_yetim, state.b_koruyucuAile, state.b_yabanciUyruklu
  ].filter(Boolean).length;

  // C. Sosyal Kırılganlık ve Hane Nüfusu (Maks 15 Puan)
  let rawScoreC = 0;
  if (state.e_siddetMagduru) rawScoreC += 5;
  if (state.e_kadinReis) rawScoreC += 4;
  if (state.e_esiCezaevinde) rawScoreC += 4;
  if (state.e_afetGelirKaybi) rawScoreC += 4;
  if (state.e_maddeBagimliligi) rawScoreC += 4;
  if (state.e_sosyalGuvencesiz) rawScoreC += 4;
  if (state.e_acilHastalik) rawScoreC += 4;
  if (state.e_icraBorcBaskisi) rawScoreC += 3;
  if (state.e_gebelikBebek) rawScoreC += 3;
  if (state.e_bosanmis) rawScoreC += 2;
  if (state.e_dul) rawScoreC += 2;
  if (state.e_hukumluYakin) rawScoreC += 2;
  const hhSize = Number(state.householdSize) || 1;
  if (hhSize >= 7) rawScoreC += 4;
  else if (hhSize >= 5) rawScoreC += 3;
  else if (hhSize >= 3) rawScoreC += 2;
  else rawScoreC += 1;
  const scoreC = Math.max(0, Math.min(rawScoreC, 15));

  // D. Eğitim ve Çocuk (Maks 15 Puan)
  let rawScoreD = 0;
  rawScoreD += (Number(state.c_0_6yas) || 0) * 2;
  rawScoreD += (Number(state.c_ilkokul) || 0) * 2;
  rawScoreD += (Number(state.c_ortaokul) || 0) * 2;
  rawScoreD += (Number(state.c_lise) || 0) * 3;
  rawScoreD += (Number(state.c_meslekiEgitim) || 0) * 3;
  rawScoreD += (Number(state.c_acikLise) || 0) * 2;
  rawScoreD += (Number(state.c_uni) || 0) * 4;
  const scoreD = Math.max(0, Math.min(rawScoreD, 15));

  // E. Barınma ve Temel Eşya (Maks 10 Puan)
  let rawScoreE = 0;
  if (state.d_evsiz) rawScoreE += 8;
  if (state.d_afetzede) rawScoreE += 8;
  if (state.d_agirHasarli) rawScoreE += 6;
  if (state.d_sagliksiz) rawScoreE += 4;
  if (state.d_dereYatagi) rawScoreE += 4;
  if (state.d_kiraci) rawScoreE += 3;
  if (state.d_tahliyeBaskisi) rawScoreE += 3;
  if (state.d_isinmaProblem) rawScoreE += 2;
  if (state.d_gecekondu) rawScoreE += 2;
  if (state.d_asansorsuzYuksek) rawScoreE += 2;
  if (state.d_tuvaletBanyoYetersiz) rawScoreE += 2;

  let rawAppliances = 0;
  const addAppliancePoints = (status: string, ptsYok: number, ptsEski: number) => {
    if (status === 'yok') rawAppliances += ptsYok;
    else if (status === 'eski') rawAppliances += ptsEski;
  };
  addAppliancePoints(state.appliance_buzdolabi, 1.5, 0.75);
  addAppliancePoints(state.appliance_camasir, 1.5, 0.75);
  addAppliancePoints(state.appliance_firin, 1, 0.5);
  addAppliancePoints(state.appliance_tv, 0.5, 0.25);
  addAppliancePoints(state.appliance_telefon, 0.5, 0.25);
  addAppliancePoints(state.appliance_klima, 0.5, 0.25);
  addAppliancePoints(state.appliance_diger, 0.5, 0.25);

  rawScoreE += Math.min(3, rawAppliances);
  const scoreE = Math.max(0, Math.min(Math.round(rawScoreE * 10) / 10, 10));

  // F. Görevli İnceleme Kanaati (Maks 10 Puan)
  const scoreF = Math.max(
    0,
    Math.min(
      (Number(state.f_yasamKosullari) || 0) +
      (Number(state.f_aciliyet) || 0) +
      (Number(state.f_sosyalDestek) || 0) +
      (Number(state.f_risk) || 0),
      10
    )
  );

  // Varlık Testi & Mükerrerlik Ceza Puanları
  let scorePenalty = 0;
  if (state.a_aracSahibi) scorePenalty += 15;
  if (state.a_aktifSgkPrim) scorePenalty += 5;
  if (state.a_birdenFazlaTasinmaz) scorePenalty += 20;
  if (state.a_son3AyYardimAldi && (Number(state.a_son3AyYardimKisi) || 0) > 0) {
    scorePenalty += (Number(state.a_son3AyYardimKisi) || 0) * 5;
  }

  const rawTotal = scoreA + scoreB + scoreC + scoreD + scoreE + scoreF;
  let totalScore = state.falseStatement ? 0 : Math.max(0, Math.min(100, Math.round(rawTotal - scorePenalty)));

  // Muhtaçlık Sınırı Garantisi: Geliri muhtaçlık sınırı altındaysa VE varlık/mükerrerlik cezası yoksa
  // en alt yardım eşiğinin (10 puan) altına düşürülmez. Ceza varsa ceza düşüşü korunur.
  const hasIncomeVulnerability = !!(state.income && Number(state.income) > 0);

  if (hasIncomeVulnerability && !state.falseStatement && scorePenalty === 0) {
    const settings = typeof window !== 'undefined' ? getSystemSettings() : DEFAULT_SETTINGS;
    const sortedTiers = [...settings.assistanceTiers].sort((a, b) => a.minScore - b.minScore);
    const lowestMinScore = sortedTiers.length > 0 ? sortedTiers[0].minScore : 10;
    if (totalScore < lowestMinScore) {
      totalScore = lowestMinScore;
    }
  }

  const isBelowThreshold = totalScore < 10;
  const isRejected = !!state.falseStatement || isBelowThreshold;

  const assistance = calculateAssistanceFromScore(
    totalScore,
    !!state.falseStatement,
    undefined,
    hasIncomeVulnerability && scorePenalty === 0
  );

  const priorities: string[] = [];
  if (state.b_agirEngelli) priorities.push('Ağır engelli bulunan hane');
  if (state.b_cokluOzelDurumluBirey) priorities.push('Hanede Birden Fazla Özel Durumlu Birey');
  if (state.b_yetim) priorities.push('Yetim çocuk bulunan hane');
  if (state.b_sehitYakini || state.b_gazi) priorities.push('Şehit / Gazi Ailesi');
  if (state.d_afetzede || state.e_afetGelirKaybi) priorities.push('Afet Mağduru');
  if (state.b_yasliYalniz) priorities.push('Yaşlı ve Yalnız Yaşayan');
  if (state.e_siddetMagduru) priorities.push('Aile İçi Şiddet Mağduru');
  if (state.e_acilHastalik) priorities.push('Acil Hastalık Durumu');
  if (state.a_aracSahibi || state.a_birdenFazlaTasinmaz) priorities.push('Varlık Testi: Ceza Puanı Uygulandı');
  if (state.appliance_buzdolabi === 'yok' || state.appliance_camasir === 'yok') {
    priorities.push('Temel Ev Eşyası Eksikliği (Buzdolabı / Çamaşır M.)');
  }

  return {
    scoreA,
    scoreB,
    scoreC,
    scoreD,
    scoreE,
    scoreF,
    scorePenalty,
    totalScore,
    assistance,
    priorities,
    isRejected,
    disadvantageCount
  };
}
