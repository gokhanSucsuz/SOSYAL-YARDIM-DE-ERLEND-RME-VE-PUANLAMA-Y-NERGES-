import { calculateAssistanceFromScore, DEFAULT_ASSISTANCE_TIERS } from '../lib/db';

describe('Scoring Algorithm (calculateAssistanceFromScore)', () => {
  it('should return REDDEDİLDİ and 0 amount when isRejected is true', () => {
    const result = calculateAssistanceFromScore(150, true);
    expect(result.text).toBe('REDDEDİLDİ');
    expect(result.amount).toBe(0);
  });

  it('should return Tier 1 (10.000 TL) for score between 136 and 150', () => {
    const result = calculateAssistanceFromScore(140, false);
    expect(result.text).toBe('10.000 TL Nakdi Yardım');
    expect(result.amount).toBe(10000);
  });

  it('should return Tier 2 (7.500 TL) for score between 116 and 135', () => {
    const result = calculateAssistanceFromScore(120, false);
    expect(result.text).toBe('7.500 TL Nakdi Yardım');
    expect(result.amount).toBe(7500);
  });

  it('should return Tier 3 (5.000 TL) for score between 91 and 115', () => {
    const result = calculateAssistanceFromScore(100, false);
    expect(result.text).toBe('5.000 TL Nakdi Yardım');
    expect(result.amount).toBe(5000);
  });

  it('should return Tier 4 (2.500 TL) for score between 51 and 90', () => {
    const result = calculateAssistanceFromScore(75, false);
    expect(result.text).toBe('2.500 TL Nakdi Yardım');
    expect(result.amount).toBe(2500);
  });

  it('should return rejection text for scores below 51', () => {
    const result = calculateAssistanceFromScore(40, false);
    expect(result.text).toBe('Yardım uygun görülmez (veya Ayni)');
    expect(result.amount).toBe(0);
  });

  it('should handle boundary scores correctly (e.g. exactly 136)', () => {
    const result136 = calculateAssistanceFromScore(136, false);
    expect(result136.text).toBe('10.000 TL Nakdi Yardım');
    
    const result135 = calculateAssistanceFromScore(135, false);
    expect(result135.text).toBe('7.500 TL Nakdi Yardım');
  });
});
