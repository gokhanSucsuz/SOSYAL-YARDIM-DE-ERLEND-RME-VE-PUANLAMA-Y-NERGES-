export interface AssessmentResult {
  scoreA: number;
  scoreB: number;
  scoreC: number;
  scoreD: number;
  scoreE: number;
  scoreF: number;
  scoreG?: number;
  totalScore: number;
  assistance: { text: string; amount: number };
  priorities: string[];
  isRejected: boolean;
}

export interface Meeting {
  id: string; // Unique ID
  meetingNo: string; // Toplantı No (e.g. 2026/01)
  date: string; // Tarih
  createdAt: string; // Oluşturulma tarihi
  managerName: string; // Oluşturan Müdür
  description?: string; // Toplantı açıklaması
}

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
  data: any; // Raw state data
  result: AssessmentResult;
}

const DB_NAME = 'SocialAssistanceDB';
const STORE_NAME = 'assessments';
const MEETING_STORE_NAME = 'meetings';
const DB_VERSION = 2;

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
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(assessment);
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
    request.onsuccess = () => resolve(request.result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    request.onerror = () => reject(request.error);
  });
};

export const getAllAssessments = async (): Promise<Assessment[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    request.onerror = () => reject(request.error);
  });
};

export const getAssessmentById = async (id: string): Promise<Assessment> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
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
