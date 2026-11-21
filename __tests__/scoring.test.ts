import { calculateAssistanceFromScore } from '../lib/db';
import { calculateNewSystemScore, isValidTcKimlik, isRejectedRecord } from '../lib/scoring';

describe('100-Point Scoring & Assistance Algorithm (Literature Standard)', () => {
  describe('calculateAssistanceFromScore (6-Tier 100-Point System)', () => {
    it('should return REDDEDİLDİ and 0 amount when isRejected is true', () => {
      const result = calculateAssistanceFromScore(95, true);
      expect(result.text).toBe('REDDEDİLDİ');
      expect(result.amount).toBe(0);
    });

    it('should return Tier 1 (10.000 TL) for score between 86 and 100', () => {
      const result = calculateAssistanceFromScore(92, false);
      expect(result.text).toBe('10.000 TL Nakdi Yardım');
      expect(result.amount).toBe(10000);
    });

    it('should return Tier 2 (7.500 TL) for score between 71 and 85', () => {
      const result = calculateAssistanceFromScore(78, false);
      expect(result.text).toBe('7.500 TL Nakdi Yardım');
      expect(result.amount).toBe(7500);
    });

    it('should return Tier 3 (5.000 TL) for score between 56 and 70', () => {
      const result = calculateAssistanceFromScore(62, false);
      expect(result.text).toBe('5.000 TL Nakdi Yardım');
      expect(result.amount).toBe(5000);
    });

    it('should return Tier 4 (4.000 TL) for score between 41 and 55', () => {
      const result = calculateAssistanceFromScore(48, false);
      expect(result.text).toBe('4.000 TL Nakdi Yardım');
      expect(result.amount).toBe(4000);
    });

    it('should return Tier 5 (3.000 TL) for score between 26 and 40', () => {
      const result = calculateAssistanceFromScore(32, false);
      expect(result.text).toBe('3.000 TL Nakdi Yardım');
      expect(result.amount).toBe(3000);
    });

    it('should return Tier 6 (2.000 TL) for score between 10 and 25', () => {
      const result = calculateAssistanceFromScore(15, false);
      expect(result.text).toBe('2.000 TL Nakdi Yardım');
      expect(result.amount).toBe(2000);
    });

    it('should return rejection text for scores below 10 (0-9)', () => {
      const result = calculateAssistanceFromScore(8, false);
      expect(result.text).toBe('Yardım uygun görülmez (veya Ayni)');
      expect(result.amount).toBe(0);
    });

    it('should handle boundary scores correctly (e.g. 86, 85, 10, 9)', () => {
      expect(calculateAssistanceFromScore(86, false).amount).toBe(10000);
      expect(calculateAssistanceFromScore(85, false).amount).toBe(7500);
      expect(calculateAssistanceFromScore(10, false).amount).toBe(2000);
      expect(calculateAssistanceFromScore(9, false).amount).toBe(0);
    });
  });

  describe('calculateNewSystemScore (6 Modules: A=25, B=25, C=15, D=15, E=10, F=10 => Max 100)', () => {
    it('should cap each module to its exact literature maximum and sum up to 100', () => {
      const maxState = {
        // A: max 25
        income: 20,
        noWorker: true,
        noRegularIncome: true,
        noSgk: true,
        // B: max 25
        b_agirEngelli: true,
        b_engelli: true,
        b_evdeBakim: true,
        b_kanser: true,
        // C: max 15
        householdSize: 8,
        e_siddetMagduru: true,
        e_kadinReis: true,
        e_esiCezaevinde: true,
        // D: max 15
        c_uni: 4,
        c_lise: 2,
        // E: max 10
        d_evsiz: true,
        d_afetzede: true,
        appliance_buzdolabi: 'yok',
        appliance_camasir: 'yok',
        // F: max 10
        f_yasamKosullari: 5,
        f_aciliyet: 5,
        f_sosyalDestek: 5,
        f_risk: 5,
      };

      const res = calculateNewSystemScore(maxState);
      expect(res.scoreA).toBe(25);
      expect(res.scoreB).toBe(25);
      expect(res.scoreC).toBe(15);
      expect(res.scoreD).toBe(15);
      expect(res.scoreE).toBe(10);
      expect(res.scoreF).toBe(10);
      expect(res.totalScore).toBe(100);
      expect(res.isRejected).toBe(false);
      expect(res.assistance.amount).toBe(10000);
    });

    it('should apply asset test penalties (-15 vehicle, -20 properties, -5 SGK, -5 per person duplicate aid)', () => {
      const stateWithPenalties = {
        income: 20,
        noWorker: true, // A = 23
        b_agirEngelli: true, // B = 12
        householdSize: 3, // C = 2
        a_aracSahibi: true, // -15
        a_birdenFazlaTasinmaz: true, // -20
      };

      const res = calculateNewSystemScore(stateWithPenalties);
      expect(res.scorePenalty).toBe(35);
      // raw = 23 + 12 + 2 = 37; 37 - 35 = 2 (< 10 => rejected!)
      expect(res.totalScore).toBe(2);
      expect(res.isRejected).toBe(true);
      expect(res.assistance.amount).toBe(0);
    });

    it('should immediately zero score and reject on false statement (Gerçeğe Aykırı Beyan)', () => {
      const fraudState = {
        income: 20,
        b_agirEngelli: true,
        e_siddetMagduru: true,
        falseStatement: true,
      };

      const res = calculateNewSystemScore(fraudState);
      expect(res.totalScore).toBe(0);
      expect(res.isRejected).toBe(true);
      expect(res.assistance.text).toBe('REDDEDİLDİ');
      expect(res.assistance.amount).toBe(0);
    });

    it('should award half points for old/damaged appliances and full points for missing appliances up to +3 cap', () => {
      const stateE = {
        d_kiraci: true, // +3
        appliance_buzdolabi: 'eski', // +0.75
        appliance_camasir: 'eski', // +0.75
        appliance_firin: 'yok', // +1.0
        appliance_tv: 'yok', // +0.5 -> total appliances = 3.0
      };
      const res = calculateNewSystemScore(stateE);
      expect(res.scoreE).toBe(6); // 3 (kiracı) + 3 (eşya) = 6
    });
  });

  describe('isValidTcKimlik', () => {
    it('should validate algorithmic Turkish Identity Numbers accurately', () => {
      expect(isValidTcKimlik('10000000146')).toBe(true);
      expect(isValidTcKimlik('10000000147')).toBe(false);
      expect(isValidTcKimlik('01234567890')).toBe(false);
      expect(isValidTcKimlik('12345')).toBe(false);
    });
  });
});

