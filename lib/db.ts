export interface AssessmentResult {
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  scoreE: number;
  scoreF: number;
  scoreG?: number;
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
  { id: 'tier-1', minScore: 136, maxScore: 150, text: '10.000 TL Nakdi Yardım', amount: 10000, description: 'Yüksek Derecede Muhtaçlık Kademesi' },
  { id: 'tier-2', minScore: 116, maxScore: 135, text: '7.500 TL Nakdi Yardım', amount: 7500, description: '2. Derece Muhtaçlık Kademesi' },
  { id: 'tier-3', minScore: 91, maxScore: 115, text: '5.000 TL Nakdi Yardım', amount: 5000, description: '3. Derece Muhtaçlık Kademesi' },
  { id: 'tier-4', minScore: 51, maxScore: 90, text: '2.500 TL Nakdi Yardım', amount: 2500, description: '4. Derece Muhtaçlık Kademesi' },
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
  settings?: SystemSettings
): { text: string; amount: number } => {
  if (isRejected) {
    return { text: 'REDDEDİLDİ', amount: 0 };
  }

  const activeSettings = settings || getSystemSettings();
  const sortedTiers = [...activeSettings.assistanceTiers].sort((a, b) => b.minScore - a.minScore);

  for (const tier of sortedTiers) {
    if (totalScore >= tier.minScore && totalScore <= tier.maxScore) {
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

export const getAssessmentsByPersonnel = async (personnelId: string, page = 1, limit = 50): Promise<PaginatedAssessments> => {
  const res = await fetch(`/api/assessments?personnelId=${encodeURIComponent(personnelId)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  return res.json();
};

export const getAllAssessments = async (page = 1, limit = 50): Promise<PaginatedAssessments> => {
  const res = await fetch(`/api/assessments?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch assessments');
  return res.json();
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
