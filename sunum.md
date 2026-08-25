---
marp: true
theme: default
class: lead
paginate: true
backgroundColor: '#f8f9fa'
color: '#212529'
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #b71c1c;
    font-size: 2.8em;
  }
  h2 {
    color: #1565c0;
    border-bottom: 3px solid #1565c0;
    padding-bottom: 10px;
  }
  h3 {
    color: #2e7d32;
  }
  strong {
    color: #d32f2f;
  }
  .highlight {
    background-color: #ffe082;
    padding: 2px 6px;
    border-radius: 4px;
  }
  ul li {
    margin-bottom: 12px;
  }
---

# 🤝 T.C. Edirne SYDV
## Sosyal Yardım Değerlendirme ve Puanlama Sistemi

**Şeffaf, Adil ve Bilimsel Karar Destek Yazılımı**

*Doküman No: SYD-NDS-2026-SUNUM*

---

## 🎯 Bu Sistem Neden Geliştirildi?

Sınırlı bütçe, sınırsız ihtiyaç... Kimin **daha çok** yardıma ihtiyacı olduğunu nasıl belirleriz?

- Ahmet Bey'in geliri yok ama evi var.
- Ayşe Hanım'ın geliri var ama 2 ağır engelli çocuğu var.
- Fatma Teyze 70 yaşında, yalnız ve evi ısınmıyor.

**Çözüm:** Subjektif gözlemler yerine, **matematiksel bir formül** ile adil ve dünya standartlarına uygun ölçülebilir bir değerlendirme.

---

## ⚙️ Sistem Nasıl Çalışıyor?

1. Görevli sahada tabletinden/telefonundan basit soruları cevaplar.
2. Arka planda **matematiksel formül** çalışır (Anlık Puanlama).
3. Hane için bir **Muhtaçlık Puanı** (Örn: 140 Puan) üretilir.
4. Sistem haneyi sınıflandırır ve **yardım miktarı** (1-4. Derece) önerir.
5. Müdür Yetkilisi formu inceler, onaylar veya reddeder.

*Puan ne kadar yüksekse, ihtiyaç o kadar "acil ve büyüktür"!*

---

## 📱 PWA Mobil Uygulama Desteği

Sistem herhangi bir uygulama mağazasına ihtiyaç duymadan doğrudan telefona kurulabilir (**PWA**):

- **Android:** Chrome → 3 Nokta Menüsü → "Uygulamayı Yükle" / "Ana Ekrana Ekle"
- **iOS/iPhone:** Safari → Paylaş (⬆) → "Ana Ekrana Ekle" → "Ekle"
- Tam ekran, yerel uygulama deneyimi sunar
- Saha görevlileri internet bağlantısı olmadan da formları doldurabilir

---

## 🏗️ Temel Özellikler

- **📱 PWA Mobil:** Mağazasız telefona yüklenip kullanılabilir, çevrimdışı çalışma desteği.
- **🔒 Gizlilik Modu:** Personel panelinde puan ve kararlar gizlenebilir (Saha mahremiyet koruması).
- **🛡️ Mükerrer Kontrolü:** T.C. Kimlik No ile anında sorgulama, yığılma engellenir.
- **📊 Grafik İstatistik:** Müdür panelinde görsel grafiklerle bütçe ve karar analizi; PDF/Excel çıktı.
- **🖨️ Tek Tıkla Rapor:** Toplantı sonrası anında Excel (.xlsx) veya PDF çıktı imkânı.
- **🔐 2FA Güvenlik:** Süper Admin için Google Authenticator iki aşamalı doğrulama.
- **🔑 KVKK Uyumu:** AES-256 şifreleme ile tüm kişisel veriler koruma altında.

---

## 🧮 Puanlama Mantığı (Dünya Standartları)

Dünya Bankası, OECD ve BM yoksulluk endeksleri temel alınarak 7 ana başlıkta değerlendirme yapılır. Toplam **Maksimum 150 Puan** üzerinden hesaplanır.

1. **Ekonomik Durum** (Maks **40 Puan**)
2. **Dezavantajlı Bireyler** (Maks **30 Puan**)
3. **Çocuk ve Eğitim** (Maks **10 Puan**)
4. **Barınma Şartları** (Maks **10 Puan**)
5. **Temel Eşya Eksikliği** (Maks **10 Puan**)
6. **Sosyal Kırılganlık ve Nüfus** (Maks **30 Puan**)
7. **Personel İnceleme Kanaati** (Maks **20 Puan**)

---

## 📊 Yardım Dereceleri ve Nakdi Tutarlar

| Derece | Puan Aralığı | Aralık | Yardım Tutarı |
|--------|-------------|--------|--------------|
| 1. Derece – Aşırı Muhtaç | **136 – 150** | 15 Puan (Dar Tavan) | **10.000 TL** |
| 2. Derece – Ağır Muhtaç | **116 – 135** | 20 Puan | **7.500 TL** |
| 3. Derece – Orta Muhtaç | **91 – 115** | 25 Puan | **5.000 TL** |
| 4. Derece – Temel Destek | **51 – 90** | 40 Puan | **2.500 TL** |
| Uygun Değil / Ayni | **0 – 50** | – | **0 TL** |

**Daraltılmış Tavan:** 1. Derece aralığı kasıtlı dar (15 puan) tutularak en ağır durumdaki sınırlı sayıda hane en yüksek yardıma ulaşır.

---

## 🔍 Kategorilerin Literatür Uyumu

- **Ekonomik (A):** Gelir bazlı hedefleme temel standarttır (Muhtaçlık sınırı altı gelire +40 puan). Son 3 ayda vakıf nakdi yardımı alana kişi başı **-5 puan** düşüm uygulanır.
- **Dezavantajlı (B):** 5378 Sayılı Kanun ve BM normlarınca "Çoklu Kırılganlık" ağırlıklandırılır. Ağır Engelli +15, Özel Sebep Müdür onayıyla +10/+15/+20/+25 puan.
- **Sosyal Nüfus (F):** *OECD Modifiye Edilmiş Eşdeğerlik Ölçeği* kullanılır; kişi sayısı arttıkça masraf artışı bilimsel hesaba katılır.
- **Kanaat (G):** Avrupa sosyal hizmet modelindeki "Professional Judgment" ile personel görüşü sayısallaştırılır (4 alt alan × 0-5 puan = maks 20 puan).

---

## 🚫 Güvenlik Filtreleri ve Varlık Testi

Sistem sadece puan vermez, literatürdeki **"Means Testing"** ile puan siler veya başvuruyu reddeder:

1. **Araç Kaydı Tespiti:** **-15 Puan** otomatik düşüm
2. **Birden Fazla Taşınmaz:** **-20 Puan** otomatik düşüm
3. **Aktif SGK Prim Kaydı:** A kategorisi sıfırlanır
4. **Mükerrer Yardım (Son 3 Ay):** Kişi başı **-5 Puan**
5. **Gerçeğe Aykırı Beyan:** Puan anında **Sıfırlanır (0)** ve başvuru REDDEDİLİR

---

## 🔐 KVKK Uyumluluğu ve Siber Güvenlik

- **AES-256-CBC Şifreleme:** T.C. Kimlik No, Ad Soyad, Adres ve tüm özel nitelikli veriler veritabanında şifreli tutulur.
- **Bcrypt Şifre Hashleme:** Kullanıcı şifreleri geri döndürülemez biçimde saklanır.
- **JWE Token (JSON Web Encryption):** Oturumlar AES-GCM ile şifrelenerek XSS/CSRF saldırıları engellenir.
- **2FA Google Authenticator:** Süper Admin ve müdür yetkilisi hesapları için iki aşamalı doğrulama.
- **MongoDB Transactions:** Toplu onay işlemlerinde veri tutarlılığı (Atomik İşlemler + Rollback).

---

## 📈 Müdür İstatistik ve Analiz Merkezi

- **Grafik Gösterimli PDF:** Bütçe kullanım çubukları, karar dağılım bantları, hane risk puan grafikleri.
- **Toplantı Bazlı / Konsolide Raporlama:** Belirli toplantı dosyası veya tüm Vakıf geneli için analiz.
- **Excel (.xlsx) Dışa Aktarım:** Özet metrikler, kategori kırılımları ve hane detayları çok sekmeli format.
- **Anlık Bütçe Takibi:** Onaylanan yardımlarla güncellenen bütçe kullanım oranları.
- **Personel Bazlı Görünüm:** Her personelin toplantıya katkısı ve onay durumları takibi.

---

## 💡 Sonuç ve Kazanımlar

- *"Neden Ahmet'e değil de Mehmet'e verdiniz?"*
- **"Çünkü Mehmet'in literatüre dayalı çok boyutlu puanı 140, Ahmet'in ise 65."**

✅ **Kurumsal Şeffaflık Artışı** — Her karar matematiksel gerekçeyle belgelenebilir
✅ **Kayırmacılığın Önlenmesi** — İnsan inisiyatifinden bağımsız algoritma
✅ **Kaynakların En Muhtaç Olanlara Ulaşması** — Daraltılmış tavan sistemi
✅ **Hukuki Güvence** — Müfettiş denetiminde 150 puan parametre dökümü
✅ **Operasyonel Verimlilik** — Yaklaşık %60 inceleme süresi tasarrufu

---

# Teşekkürler 🙏
**T.C. Edirne SYDV - Sosyal Yardım Değerlendirme Sistemi**
