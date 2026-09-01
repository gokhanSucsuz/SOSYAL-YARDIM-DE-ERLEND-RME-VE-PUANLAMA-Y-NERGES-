export interface AssessmentResult {
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  scoreE: number;
  scoreF: number;
  scorePenalty?: number;
  totalScore: number;
  assistance: { text: string; amount: number };
  priorities: string[];
  isRejected: boolean;
}

export interface AssistanceTier {
  id: string;
  minScore: number;
  maxScore: number;
  text: string;
  amount: number;
  description?: string;
}

export interface SystemSettings {
  assistanceTiers: AssistanceTier[];
  rejectionText?: string;
}

export const DEFAULT_ASSISTANCE_TIERS: AssistanceTier[] = [
  { id: 'tier-1', minScore: 86, maxScore: 100, text: '10.000 TL Nakdi Yardım', amount: 10000, description: 'Kritik / Çok Yüksek İhtiyaç (1. Kademe)' },
  { id: 'tier-2', minScore: 71, maxScore: 85, text: '7.500 TL Nakdi Yardım', amount: 7500, description: 'Yüksek İhtiyaç (2. Kademe)' },
  { id: 'tier-3', minScore: 56, maxScore: 70, text: '5.000 TL Nakdi Yardım', amount: 5000, description: 'Orta Düzey İhtiyaç (3. Kademe)' },
  { id: 'tier-4', minScore: 41, maxScore: 55, text: '4.000 TL Nakdi Yardım', amount: 4000, description: 'Düşük-Orta İhtiyaç (4. Kademe)' },
  { id: 'tier-5', minScore: 26, maxScore: 40, text: '3.000 TL Nakdi Yardım', amount: 3000, description: 'Temel İhtiyaç (5. Kademe)' },
  { id: 'tier-6', minScore: 10, maxScore: 25, text: '2.000 TL Nakdi Yardım', amount: 2000, description: 'Dönemsel/Sınır İhtiyaç (6. Kademe)' },
];

export const DEFAULT_SETTINGS: SystemSettings = {
  assistanceTiers: DEFAULT_ASSISTANCE_TIERS,
  rejectionText: 'Yardım uygun görülmez (veya Ayni)',
};

export const getSystemSettings = (): SystemSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem('socialAssistance_systemSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.assistanceTiers) && parsed.assistanceTiers.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSystemSettings = (settings: SystemSettings): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('socialAssistance_systemSettings', JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
};

export const calculateAssistanceFromScore = (
  totalScore: number,
  isRejected: boolean,
  settings?: SystemSettings,
  hasIncomeVulnerability?: boolean
): { text: string; amount: number } => {
  if (isRejected) {
    return { text: 'REDDEDİLDİ', amount: 0 };
  }

  // Muhtaçlık Sınırı Garantisi: Geliri muhtaçlık sınırı altındaysa (gelir puanı > 0)
  // ve toplam puanı çok düşükse (10'un altındaysa bile), otomatik olarak en alt kademeye alınır.
  let effectiveScore = totalScore;
  if (hasIncomeVulnerability && effectiveScore < 10) {
    effectiveScore = 10;
  }

  const activeSettings = settings || getSystemSettings();
  const sortedTiers = [...activeSettings.assistanceTiers].sort((a, b) => b.minScore - a.minScore);

  for (const tier of sortedTiers) {
    if (effectiveScore >= tier.minScore && effectiveScore <= tier.maxScore) {
      return { text: tier.text, amount: tier.amount };
    }
  }

  return { 
    text: activeSettings.rejectionText || 'Yardım uygun görülmez (veya Ayni)', 
    amount: 0 
  };
};

export interface Meeting {
  id: string; 
  meetingNo: string; 
  date: string; 
  createdAt: string; 
  managerName: string; 
  description?: string; 
  isClosed?: boolean; 
  forceOpen?: boolean; 
  budgetTL?: number; 
}

export const isMeetingLocked = (meeting?: Meeting, userRole?: string): boolean => {
  if (!meeting) return false;
  if (userRole === 'manager') return false; 

  if (meeting.isClosed === true) return true;

  if (meeting.date) {
    const meetingDate = new Date(meeting.date);
    meetingDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (meetingDate < today && !meeting.forceOpen) {
      return true;
    }
  }

  return false;
};

export interface Assessment {
  id: string;
  meetingId?: string; 
  date: string;
  personnelId: string;
  personnelName: string;
  managerName?: string;
  applicantName: string;
  applicantTc: string;
  applicantAddress?: string;
  householdSize?: number;
  phoneNumber?: string;
  householdNo?: string;
  status?: 'pending' | 'approved';
  customOrder?: number;
  data: any; 
  result: AssessmentResult;
}

export interface PaginatedAssessments {
  data: Assessment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// SERVER API CALLS

export const saveMeeting = async (meeting: Meeting): Promise<void> => {
  const res = await fetch('/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meeting)
  });
  if (!res.ok) throw new Error('Failed to save meeting');
};

export const getAllMeetings = async (): Promise<Meeting[]> => {
  const res = await fetch('/api/meetings');
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
};

export const deleteMeeting = async (id: string): Promise<void> => {
  const res = await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete meeting');
};

export const saveAssessment = async (assessment: Assessment): Promise<void> => {
  const res = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assessment)
  });
  if (!res.ok) {
    let errMessage = 'Failed to save assessment';
    try {
      const errData = await res.json();
      errMessage = errData.error || errMessage;
      if (errData.details) {
        errMessage += ' - ' + JSON.stringify(errData.details);
      }
    } catch (e) {}
    throw new Error(errMessage);
  }
};

export const batchUpdateAssessments = async (ids: string[], status: 'approved' | 'pending'): Promise<void> => {
  const res = await fetch('/api/assessments/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, status })
  });
  if (!res.ok) throw new Error('Failed to batch update assessments');
};

export const getAssessmentsByPersonnel = async (personnelId: string, page = 1, limit = 1000): Promise<PaginatedAssessments> => {
  const res = await fetch(`/api/assessments?personnelId=${encodeURIComponent(personnelId)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  return res.json();
};

export const getAllAssessments = async (page = 1, limit = 1000): Promise<PaginatedAssessments> => {
  const res = await fetch(`/api/assessments?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  return res.json();
};

/**
 * Tüm kayıtları sayfalayarak çeker (büyük veri setleri için).
 * Önce standart limit ile dener; toplam kayıt sayısı limit'i aşarsa
 * kalan sayfaları da otomatik çeker ve birleştirir.
 */
export const fetchAllAssessments = async (personnelId?: string): Promise<Assessment[]> => {
  const LIMIT = 500;
  const firstPage = personnelId
    ? await getAssessmentsByPersonnel(personnelId, 1, LIMIT)
    : await getAllAssessments(1, LIMIT);

  const allData = [...firstPage.data];
  const totalPages = firstPage.totalPages;

  if (totalPages > 1) {
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        personnelId
          ? getAssessmentsByPersonnel(personnelId, i + 2, LIMIT)
          : getAllAssessments(i + 2, LIMIT)
      )
    );
    remaining.forEach(page => allData.push(...page.data));
  }

  return allData;
};



export const getAssessmentById = async (id: string): Promise<Assessment> => {
  const res = await fetch(`/api/assessments/${id}`);
  if (!res.ok) throw new Error('Failed to fetch assessment');
  return res.json();
};

export const migrateAssessmentsToMeeting = async (meetingId: string): Promise<void> => {
  const assessments = await getAllAssessments(1, 10000);
  const unassigned = assessments.data.filter(a => !a.meetingId);
  for (const a of unassigned) {
    a.meetingId = meetingId;
    await saveAssessment(a);
  }
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete assessment');
};
