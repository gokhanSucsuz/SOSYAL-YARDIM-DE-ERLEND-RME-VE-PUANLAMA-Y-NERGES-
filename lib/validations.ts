import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email("Geçersiz e-posta adresi"),
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  role: z.enum(['superadmin', 'manager', 'personnel']),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional()
});

export const AssessmentSchema = z.object({
  id: z.string().min(1, "ID gereklidir"),
  meetingId: z.string().optional(),
  date: z.string(),
  personnelId: z.string().min(1, "Personel ID gereklidir"),
  personnelName: z.string().min(1, "Personel Adı gereklidir"),
  managerName: z.string().optional(),
  applicantName: z.string().min(2, "Başvuru sahibi adı en az 2 karakter olmalıdır"),
  applicantTc: z.string().length(11, "T.C. Kimlik Numarası 11 haneli olmalıdır").regex(/^[0-9]+$/, "Sadece rakam içermelidir"),
  applicantAddress: z.string().optional(),
  householdSize: z.number().min(1, "Hane halkı sayısı en az 1 olmalıdır").optional(),
  phoneNumber: z.string().optional(),
  householdNo: z.string().optional(),
  status: z.enum(['pending', 'approved']).optional(),
  customOrder: z.number().optional(),
  data: z.record(z.string(), z.any()), // Form data
  result: z.object({
    scoreA: z.number(),
    scoreB: z.number(),
    scoreC: z.number(),
    scoreD: z.number(),
    scoreE: z.number(),
    scoreF: z.number(),
    scorePenalty: z.number().optional(),
    totalScore: z.number(),
    assistance: z.object({
      text: z.string(),
      amount: z.number()
    }),
    priorities: z.array(z.string()),
    isRejected: z.boolean()
  })
});
