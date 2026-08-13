export interface AssessmentResult {
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  scoreE: number;
  scoreF: number;
  scoreG?: number;
  scorePenalty?: number; // Ceza puanı (araç, taşınmaz, mükerrer yardım vb.)
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
  id: string; // Unique ID
  meetingNo: string; // Toplantı No (e.g. 2026/01)
  date: string; // Tarih
  createdAt: string; // Oluşturulma tarihi
  managerName: string; // Oluşturan Müdür
  description?: string; // Toplantı açıklaması
  isClosed?: boolean; // Toplantı müdür tarafından sonlandırıldı mı?
  forceOpen?: boolean; // Geçmiş tarihli olmasına rağmen müdür tarafından yeniden açıldı mı?
  budgetTL?: number; // Toplantı Vakıf Bütçesi (Harcanabilir Kaynak Tutarı - TL)
}

/**
 * Checks whether a meeting is locked for edits.
 * - If user is manager, they can manage or edit anytime.
 * - For personnel, meeting is locked if explicitly closed (isClosed === true)
 *   or if meeting date is in the past and forceOpen is not true.
 */
export const isMeetingLocked = (meeting?: Meeting, userRole?: string): boolean => {
  if (!meeting) return false;
  if (userRole === 'manager') return false; // Managers can always override

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
  meetingId?: string; // Hangi toplantıya ait olduğu
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
  data: any; // Raw state data (şifreli olabilir)
  result: AssessmentResult;
  _encrypted?: boolean; // KVKK: hassas alanlar AES-GCM ile şifreli mi?
}

const DB_NAME = 'SocialAssistanceDB';
const STORE_NAME = 'assessments';
const MEETING_STORE_NAME = 'meetings';
const DB_VERSION = 2;

// ============================================================
// KVKK UYUMLU ŞİFRELEME KATMANI (AES-GCM 256-bit)
// Web Crypto API — PBKDF2 ile türetilmiş anahtar
// ============================================================
const _APP_KEY_MATERIAL = 'SYDV-EDIRNE-SECURE-ASSESSMENT-KEY-V2';
const _APP_KEY_SALT = new TextEncoder().encode('sydv-edirne-crypto-salt-2024-v1');
let _cachedCryptoKey: CryptoKey | null = null;

const _getEncryptionKey = async (): Promise<CryptoKey> => {
  if (_cachedCryptoKey) return _cachedCryptoKey;
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Web Crypto API kullanılamıyor.');
  }
  const rawKey = new TextEncoder().encode(_APP_KEY_MATERIAL);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', rawKey, 'PBKDF2', false, ['deriveKey']
  );
  _cachedCryptoKey = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: _APP_KEY_SALT, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  return _cachedCryptoKey;
};

export const encryptField = async (value: any): Promise<string> => {
  try {
    const key = await _getEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(value));
    const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);
    return '__ENC__' + btoa(String.fromCharCode(...Array.from(combined)));
  } catch {
    return JSON.stringify(value);
  }
};

export const decryptField = async (encryptedStr: any): Promise<any> => {
  if (typeof encryptedStr !== 'string' || !encryptedStr.startsWith('__ENC__')) {
    // Eski şifresiz veri — doğrudan döndür
    if (typeof encryptedStr === 'string') {
      try { return JSON.parse(encryptedStr); } catch { return encryptedStr; }
    }
    return encryptedStr;
  }
  try {
    const key = await _getEncryptionKey();
    const base64 = encryptedStr.slice(7); // '__ENC__' prefix kaldır
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch {
    return encryptedStr;
  }
};

const _encryptAssessment = async (a: Assessment): Promise<Assessment> => ({
  ...a,
  applicantName: await encryptField(a.applicantName),
  applicantTc: await encryptField(a.applicantTc),
  applicantAddress: a.applicantAddress ? await encryptField(a.applicantAddress) : undefined,
  phoneNumber: a.phoneNumber ? await encryptField(a.phoneNumber) : undefined,
  data: await encryptField(a.data),
  _encrypted: true,
});

const _decryptAssessment = async (a: Assessment): Promise<Assessment> => {
  if (!a._encrypted) return a; // Geriye dönük uyumluluk
  return {
    ...a,
    applicantName: await decryptField(a.applicantName),
    applicantTc: await decryptField(a.applicantTc),
    applicantAddress: a.applicantAddress ? await decryptField(a.applicantAddress) : undefined,
    phoneNumber: a.phoneNumber ? await decryptField(a.phoneNumber) : undefined,
    data: await decryptField(a.data),
  };
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // If not in browser environment
    if (typeof window === 'undefined') {
      return reject(new Error('IndexedDB is not available in server environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('personnelId', 'personnelId', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('meetingId', 'meetingId', { unique: false });
      } else {
        const store = e.currentTarget.transaction.objectStore(STORE_NAME);
        if (!store.indexNames.contains('meetingId')) {
          store.createIndex('meetingId', 'meetingId', { unique: false });
        }
      }
      
      if (!db.objectStoreNames.contains(MEETING_STORE_NAME)) {
        const meetingStore = db.createObjectStore(MEETING_STORE_NAME, { keyPath: 'id' });
        meetingStore.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

export const saveMeeting = async (meeting: Meeting): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEETING_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MEETING_STORE_NAME);
    const request = store.put(meeting);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllMeetings = async (): Promise<Meeting[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEETING_STORE_NAME, 'readonly');
    const store = tx.objectStore(MEETING_STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    request.onerror = () => reject(request.error);
  });
};

export const deleteMeeting = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEETING_STORE_NAME, 'readwrite');
    const store = tx.objectStore(MEETING_STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const saveAssessment = async (assessment: Assessment): Promise<void> => {
  const db = await initDB();
  // KVKK: Hassas alanları şifrele
  const toStore = await _encryptAssessment(assessment);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(toStore);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAssessmentsByPersonnel = async (personnelId: string): Promise<Assessment[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('personnelId');
    const request = index.getAll(personnelId);
    request.onsuccess = async () => {
      const sorted = request.result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const decrypted = await Promise.all(sorted.map(_decryptAssessment));
      resolve(decrypted);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getAllAssessments = async (): Promise<Assessment[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = async () => {
      const sorted = request.result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const decrypted = await Promise.all(sorted.map(_decryptAssessment));
      resolve(decrypted);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getAssessmentById = async (id: string): Promise<Assessment> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = async () => {
      const decrypted = await _decryptAssessment(request.result);
      resolve(decrypted);
    };
    request.onerror = () => reject(request.error);
  });
};

export const migrateAssessmentsToMeeting = async (meetingId: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const records = request.result;
      let count = 0;
      records.forEach(record => {
        if (!record.meetingId) {
          record.meetingId = meetingId;
          store.put(record);
          count++;
        }
      });
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
