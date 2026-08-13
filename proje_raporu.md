# 📋 T.C. EDİRNE SYDV — SOSYAL YARDIM DEĞERLENDİRME VE PUANLAMA YÖNERGESİ
## Proje Tanıtım, Teknik Analiz ve Literatür Uyumluluk Raporu

**Rapor Tarihi:** 13 Ağustos 2026  
**Kapsam:** Mimari · Puanlama Kriterleri · Değerlendirme Süreci · Literatür Uyumluluk · Tespit ve Öneriler

---

## 1. PROJE GENEL TANIMI

### 1.1 Sistemin Amacı

Bu sistem; **T.C. Edirne İli Sosyal Yardımlaşma ve Dayanışma Vakfı (SYDV)** için geliştirilmiş,
**3294 Sayılı Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu** çerçevesinde nakdi ve ayni sosyal
yardım başvurularını **standartlaştırılmış, puanlama tabanlı ve şeffaf** bir metodoloji ile
değerlendirmek üzere tasarlanmış **web tabanlı bir inceleme ve karar destek yazılımıdır**.

### 1.2 Yasal Dayanak

| Mevzuat | İçerik |
|---------|--------|
| 3294 Sayılı Kanun | Sosyal Yardımlaşma ve Dayanışmayı Teşvik Kanunu |
| SYDV Yönetmeliği | Vakıf işleyişi, personel ve mütevelli heyeti esasları |
| SYGM Genelgeleri | Nakdi yardım kriterleri ve puanlama yönergeleri |

### 1.3 Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|---------|
| **Müdür (manager)** | Toplantı yönetimi, tüm kayıtları görüntüleme, onaylama/red, bütçe belirleme, Excel/PDF raporu, personel yönetimi, sistem ayarları |
| **Personel (personnel)** | Saha incelemesi ekleme (kendi toplantısına), kendi kayıtlarını görüntüleme, puanlar saha gizliliği kapsamında gizli |

---

## 2. TEKNİK MİMARİ

### 2.1 Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | **Next.js 14** (App Router) |
| Dil | **TypeScript** |
| Stil | **Tailwind CSS** |
| Animasyonlar | **Framer Motion** |
| Veritabanı | **IndexedDB** (tarayıcı tarafı, çevrimdışı çalışır) |
| Raporlama | **ExcelJS** (.xlsx), Tarayıcı Print API (PDF/A4) |
| Mobil | **PWA** – uygulama mağazası gerekmez |

### 2.2 Önemli Mimari Kararlar

- **İstemci Taraflı Depolama (IndexedDB):** Veriler kullanıcının tarayıcısında saklanır. Bu tasarım internet bağlantısı gerektirmeden saha ziyaretlerinde veri girişini mümkün kılar (offline-first).
- **Yerel Kimlik Doğrulama:** `localStorage` tabanlı oturum yönetimi, kurumsal SSO entegrasyonu yoktur.
- **Puanlama Hesaplaması:** Tüm puan hesaplamaları istemci tarafında `useMemo` ile anlık yapılır.

### 2.3 Veri Modeli

```
Assessment (Değerlendirme Kaydı)
├── id, date, meetingId
├── personnelId, personnelName, managerName
├── applicantName, applicantTc, applicantAddress
├── householdSize, phoneNumber, householdNo
├── status: 'pending' | 'approved'
├── customOrder (özel sıra no)
├── data (ham form state – tüm işaretlenen seçenekler)
└── result: AssessmentResult
    ├── scoreA..scoreG, totalScore
    ├── assistance: { text, amount }
    ├── priorities[]
    └── isRejected: boolean

Meeting (Toplantı Dosyası)
├── id, meetingNo, date, createdAt
├── managerName, description
├── budgetTL (harcanabilir bütçe)
└── isClosed, forceOpen
```

---

## 3. DEĞERLENDİRME SÜRECİ

### 3.1 Süreç Akışı

```
1. TOPLANTI OLUŞTURMA (Müdür)
   Toplantı No + Tarih + Bütçe belirleme

2. SAHA ZİYARETİ VE FORM DOLDURMA (Personel – 10 Adımlı Sihirbaz)
   Adım 0: Kimlik ve Hane Bilgileri
   Adım 1: A – Ekonomik Durum       (Maks. 40 Puan)
   Adım 2: B – Dezavantajlı Bireyler (Maks. 30 Puan)
   Adım 3: C – Çocuk ve Eğitim      (Maks. 10 Puan)
   Adım 4: D – Barınma Durumu        (Maks. 10 Puan)
   Adım 5: E – Ev Eşyaları           (Maks. 10 Puan)
   Adım 6: F – Sosyal Kırılganlık    (Maks. 30 Puan)
   Adım 7: G – İnceleme Kanaati      (Maks. 20 Puan)
   Adım 8: Sistem Kontrolleri (SGK/Tapu/Araç Sorgusu Onayı)
   Adım 9: Kaydet ve Onaya Gönder

3. MÜDÜR ONAYI
   Tekli veya toplu onay
   Bütçe aşımı uyarısı (varsa)
   Onay kilitleme

4. RAPORLAMA
   A4 Detaylı Rapor (PDF/Print)
   Özet Liste (Landscape PDF)
   Excel (.xlsx) dışa aktarım
   Grafik Gösterimli İstatistik Raporu (Müdür)
```

### 3.2 Toplantı Kilitleme Mantığı

- Tarihi geçmiş toplantılar personel için otomatik kilitlenir
- Müdür toplantıyı "Sonlandır" veya "Yeniden Aç" yapabilir
- Onaylanan kayıtlar silinemez

---

## 4. PUANLAMA KRİTERLERİ DETAYLI ANALİZİ

### 4.1 Kategori Özeti

| Bölüm | Başlık | Maks. Puan |
|-------|--------|-----------|
| **A** | Ekonomik Durum | **40** |
| **B** | Dezavantajlı Bireyler | **30** |
| **C** | Çocuk ve Eğitim | **10** |
| **D** | Barınma Durumu | **10** |
| **E** | Ev Eşyaları | **10** |
| **F** | Sosyal Kırılganlık | **30** |
| **G** | İnceleme Kanaati (Öznel) | **20** |
| | **GENEL TOPLAM** | **≈ 150** |

### 4.2 Bölüm A – Ekonomik Durum (Maks. 40 Puan)

| Kriter | Puan |
|--------|------|
| Kişi başı gelir muhtaçlık sınırının %25 altında | +40 |
| Muhtaçlık sınırının %25–50'si | +35 |
| Muhtaçlık sınırının %50–75'i | +25 |
| Muhtaçlık sınırının %75–100'ü | +15 |
| Muhtaçlık sınırı üzerinde | 0 |
| Hanede çalışan yok | +10 |
| Düzenli gelir yok | +5 |
| SGK kaydı yok | +5 |

### 4.3 Bölüm B – Dezavantajlı Bireyler (Maks. 30 Puan)

| Kriter | Puan |
|--------|------|
| Ağır engelli (%70+) | +15 |
| Engelli (%40–69) | +10 |
| Evde bakım hastası | +10 |
| Kanser tedavisi gören | +10 |
| Kronik hastalık | +6 |
| 65 yaş üstü yalnız yaşayan | +8 |
| Şehit yakını | +8 |
| Gazi | +8 |
| Yetim/öksüz çocuk | +5 |
| Koruyucu aile | +5 |
| Yabancı uyruklu/Sığınmacı | +3 |
| Birden fazla özel durumlu birey (bonus) | +5 |
| Özel sebep (seçilebilir) | +10/15/20/25 |

### 4.4 Bölüm C – Çocuk ve Eğitim (Maks. 10 Puan)

| Kademe | Puan/Kişi |
|--------|----------|
| 0–6 yaş, İlkokul, Ortaokul, Lise, Açık Lise, Mesleki Eğitim, Üniversite | +3 (hepsi eşit) |

### 4.5 Bölüm D – Barınma Durumu (Maks. 10 Puan)

| Kriter | Puan |
|--------|------|
| Evsiz/Barınaksız | +10 |
| Afetzede | +10 |
| Konut ağır hasarlı | +8 |
| Sağlıksız konut / Bodrum-Dere yatağı | +6 |
| Kiracı (zorlanan) / Tahliye baskısı | +5 |
| Isınma sorunu / Gecekondu / Asansörsüz yüksek kat / Banyo-Tuvalet yetersiz | +4 |

### 4.6 Bölüm E – Ev Eşyaları (Maks. 10 Puan)

| Eşya | Yok | Eski |
|------|-----|------|
| Buzdolabı | +3 | +1.5 |
| Çamaşır Makinesi | +3 | +1.5 |
| Fırın/Ocak | +2 | +1 |
| Bulaşık Makinesi | +1 | +0.5 |
| TV / Telefon / Klima / Diğer | +1 her biri | +0.5 |

### 4.7 Bölüm F – Sosyal Kırılganlık (Maks. 30 Puan)

| Kriter | Puan |
|--------|------|
| Aile içi şiddet mağduru | +6 |
| Kadın hane reisi / Eşi cezaevinde / Afet gelir kaybı / Madde bağımlılığı / Sosyal güvencesiz | +5 |
| Borç/icra baskısı / Bakıma muhtaç bebek-gebelik | +4 |
| Boşanmış / Dul / Eski hükümlü | +3 |
| Kalabalık hane (≥5 kişi) | +3 |
| Standart hane (<5 kişi) | +1 |

### 4.8 Bölüm G – İnceleme Kanaati (Maks. 20 Puan)

| Alt Kriter | Puan Aralığı |
|------------|-------------|
| Yaşam Koşulları | 0–5 |
| Aciliyet Durumu | 0–5 |
| Sosyal Destek Yetersizliği | 0–5 |
| Risk Değerlendirmesi | 0–5 |

### 4.9 Yardım Seviyeleri (Varsayılan, Müdür Tarafından Özelleştirilebilir)

| Kademe | Puan Aralığı | Yardım Miktarı |
|--------|-------------|----------------|
| 1. Derece | 136–150 | 10.000 TL |
| 2. Derece | 116–135 | 7.500 TL |
| 3. Derece | 91–115 | 5.000 TL |
| 4. Derece | 51–90 | 2.500 TL |
| Kapsam Dışı | 0–50 | Red veya Ayni |

---

## 5. LİTERATÜRE UYUMLULUK ANALİZİ

Bu bölüm, sistemin kriterlerini Türkiye'de sosyal yardım değerlendirme sistemleri literatürüne —
özellikle **SYGM, Dünya Bankası sosyal koruma endeksleri, OECD muhtaçlık ölçüm kriterleri ve
akademik çalışmalar** — kıyaslamaktadır.

---

### 5.1 GÜÇLÜ VE DOĞRU YÖNLER

**Çok Boyutlu Yaklaşım (Multidimensional Poverty Assessment)**  
Sistem salt gelir bazlı değil; barınma, sağlık, eğitim, sosyal sermaye ve kırılganlık gibi çok
boyutlu faktörleri birleştirmektedir. Bu yaklaşım Alkire-Foster Metodolojisi ve UNDP'nin Çok
Boyutlu Yoksulluk Endeksi (MPI) ile uyumludur.

**Ağır Engellilik Önceliği**  
Ağır engellilere (≥%70) 15 puan, diğer engellilere (%40–69) 10 puan verilmesi; 2022/8 Sayılı
Cumhurbaşkanlığı Genelgesi ve 5378 Sayılı Engelliler Kanunu ile uyumludur.

**Saha Kanaati Bölümü (G Bölümü)**  
Görevlinin yerinde gözlemine dayalı subjektif değerlendirme dahil edilmesi; literatürde "professional
judgment" olarak bilinen ve İsveç/Hollanda sosyal hizmet modelleriyle örtüşen bir yaklaşımdır.

**Kademeli (Progressive) Yardım Skalası**  
Daha muhtaç olanlara daha fazla yardım yapan kademeli yapı, hedefleme etkinliği (targeting
efficiency) açısından doğrudur.

**Bütçe Aşım Uyarısı**  
Toplantı bazlı bütçe takibi ve anlık aşım uyarısı kurumsal yönetişim açısından iyi bir uygulamadır.

---

### 5.2 EKSİK VEYA GELİŞTİRİLMESİ GEREKEN ALANLAR

> [!CAUTION]
> Aşağıdaki 10 tespit, literatür ve yasal çerçeveyle karşılaştırılarak oluşturulmuştur. Kırmızı
> etiketli maddeler öncelikli işlem gerektirir.

---

#### EKSİK 1 — Tekrar Müracaat Kontrolü / Yardım Yığılması 🔴

**Mevcut Durum:** Sistem, aynı hanenin önceki yardımlarını otomatik olarak puana yansıtmamaktadır.
`a_son3AyYardimKisi` alanı kaynak kodda (`page.tsx` satır 2340) referans verilmesine rağmen
**hesaplama fonksiyonuna dahil edilmemiştir.**

**Literatür Gerekçesi:** SYGM Genelgeleri ve SYDV Muhtaçlık Tespiti Yönetmeliği; aynı hanede
3 ay içinde yardım alınmışsa yardım miktarının azaltılmasını ya da puandan düşülmesini öngörmektedir.
Sosyal yardım mükerrerliliği (benefit duplication) Dünya Bankası raporlarında temel bir hedefleme
başarısızlığı olarak tanımlanmaktadır.

**Öneri:** `a_son3AyYardimKisi` alanını forma aktif biçimde ekleyin; her son 3 ayda yardım alan
kişi başı **-5 puan** düşülmesini sağlayan hesaplama mantığını devreye alın.

---

#### EKSİK 2 — Varlık/Mülk Sorgulaması (Asset Test) Puanlamaya Yansımıyor 🔴

**Mevcut Durum:** "Sistem Kontrolleri" adımında görevli "Tapu/Araç sorgusu yaptım" onay
kutusunu işaretliyor; ancak bu sorgulama sonucu puan hesaplamasına hiçbir şekilde dahil edilmiyor.

**Literatür Gerekçesi:** Sosyal koruma sistemlerinde Means Testing (varlık testi) zorunlu bir
unsurdur. SYGM, 2013'ten itibaren tapu, araç ve SGK sorgulamalarının sonuçlarını puanlama sürecine
entegre etmektedir. Taşıt sahibi ya da ikinci evi olan başvurucunun puana yansıtılması gerekmektedir.

**Öneri:** Sistem Kontrolleri adımına sorgulama sonucu seçenekleri eklenmelidir:

| Durum | Etki |
|-------|------|
| Araç sahibi | -15 puan veya otomatik red |
| Birden fazla taşınmaz | -20 puan veya otomatik red |
| Aktif SGK prim ödemesi | A bölümünde 0 puan |

---

#### EKSİK 3 — Çocuk Eğitim Kademe Ağırlıklandırması Yok 🟡

**Mevcut Durum:** Tüm eğitim kademeleri eşit **+3 puan/öğrenci** olarak tanımlanmıştır. 0–6
yaş çocuk ile üniversite öğrencisi aynı puanı almaktadır.

**Literatür Gerekçesi:** Türkiye'nin Şartlı Eğitim Yardımı sisteminde eğitim kademesi arttıkça
destekler artırılmaktadır. UNICEF ve Dünya Bankası raporları, eğitim desteğinin özellikle lise ve
yükseköğretimde daha yüksek maliyetleri yansıtması gerektiğini vurgulamaktadır.

**Öneri:**

| Kademe | Önerilen Puan |
|--------|--------------|
| 0–6 yaş (bakım yükü) | +2/çocuk |
| İlkokul / Ortaokul | +2/öğrenci |
| Lise / Mesleki / Açık Lise | +3/öğrenci |
| Üniversite | +4/öğrenci |

C bölümü tavan puanı 10'dan 15'e yükseltilmelidir.

---

#### EKSİK 4 — Hane Büyüklüğü Etkisi Yetersiz 🟡

**Mevcut Durum:** Hane büyüklüğü yalnızca F bölümünde "≥5 kişi: +3, <5 kişi: +1" olarak
son derece sınırlı biçimde uygulanmaktadır.

**Literatür Gerekçesi:** OECD Modified Equivalence Scale ve Türkiye muhtaçlık sınırı hesabı,
hanedeki her ek bireyin giderleri artırdığını kabul eder. Mevcut yapı bu etkiyi yeterince
yansıtmamaktadır.

**Öneri:**

| Hane Büyüklüğü | Önerilen Puan |
|----------------|--------------|
| 1–2 kişi | +1 |
| 3–4 kişi | +2 |
| 5–6 kişi | +4 |
| 7+ kişi | +6 |

---

#### EKSİK 5 — Bulaşık Makinesi Puanlandırması Hatalı 🟡

**Mevcut Durum:** Bulaşık makinesi olmadığında +1 puan verilmektedir.

**Literatür Gerekçesi:** TÜİK yoksulluk göstergelerine göre bulaşık makinesi Türkiye'de bir
refah göstergesidir; yokluğu muhtaçlık anlamına gelmez. Temel ev eşyaları literatürde şöyle
sınıflandırılır:

| Kategori | Örnekler |
|----------|---------|
| Zorunlu | Buzdolabı, ocak/fırın, ısıtma sistemi |
| Önemli | Çamaşır makinesi, TV |
| Konfor | **Bulaşık makinesi**, klima, akıllı telefon |

**Öneri:** Bulaşık makinesini puanlamadan çıkarın veya puanını düşürün (0.5/0). Buna karşılık
yatak/yorgan, temel mobilya gibi gerçek zorunlu ihtiyaçlar listeye eklenebilir.

---

#### EKSİK 6 — Özel Sebep Alanı Denetimsiz ve Riske Açık 🔴

**Mevcut Durum:** Görevli, B bölümünde istediği metni yazarak ve açılır menüden +10, +15, +20
veya +25 puan seçerek sisteme ekleyebilmektedir. Kısıtlama veya denetim mekanizması yoktur.

**Literatür Gerekçesi:** Sosyal yardım sistemlerinde takdir yetkisinin sınırlandırılması
(discretion control) haksız yardım ve kayırmacılığı önlemek için temel ilkedir. Avrupa Sosyal
Şartı öznel eklentilerin yönetici onayıyla sınırlandırılmasını öngörmektedir.

**Öneri:**
1. Özel sebep puanı yalnızca müdür tarafından girilebilir olmalıdır.
2. Alternatif: Personel giriş yapabilir ama puan "Beklemede" olarak işaretlenir ve müdür onayıyla aktif hale gelir.
3. Maksimum özel sebep puanı sınırlandırılmalıdır (örn. maks. +10).

---

#### EKSİK 7 — Geçmiş Yardım Geçmişi Uyarısı 🟡

**Mevcut Durum:** Hane Arama özelliği mevcut; ancak yeni form doldurulurken aynı hanenin
önceki yardım geçmişi otomatik olarak görevliye uyarı olarak sunulmuyor.

**Öneri:** TC kimlik girildiğinde sistemin otomatik arama yapması ve varsa önceki kayıtları
"Bu hane daha önce yardım almış" uyarısıyla ekrana getirmesi sağlanmalıdır.

---

#### EKSİK 8 — UI ile Kod Puan Tavan Tutarsızlığı 🔴

**Mevcut Durum:** Form arayüzünde bazı bölümlerin max puanları kod tavanlarıyla uyuşmuyor:

| Bölüm | Koddaki Tavan | UI'da Gösterilen |
|-------|--------------|-----------------|
| B – Dezavantajlı | `Math.min(scoreB, 30)` | `maxScore={35}` |
| C – Çocuk/Eğitim | `Math.min(scoreC, 10)` | `maxScore={15}` |
| D – Barınma | `Math.min(scoreD, 10)` | `maxScore={15}` |

Print raporu satırı 2407'de de "130/150" gibi çelişkili toplam puan ifadesi bulunmaktadır.

**Öneri:** Tüm bölümlerde UI'da gösterilen `maxScore` değerleri hesaplama tavanlarıyla
eşleştirilmeli; kılavuz ve print raporu aynı değerleri göstermelidir.

---

#### EKSİK 9 — Düşük Engel Oranı (%20–39) Kriteri Yok 🟢

**Mevcut Durum:** Sistem engellileri iki kademede değerlendiriyor: %70+ ve %40–69. %40 altı
engel raporuna sahip bireyler için kategori yok.

**Literatür Gerekçesi:** 5378 Sayılı Kanun, %20–39 engel oranına sahip kişiler için de bazı
haklara atıfta bulunmakta; bu grup sosyal yardım bağlamında risk grubuna dahil edilebilir.

**Öneri:** "%20–39 arası engeli olan birey" için +3 puan kriteri eklenebilir.

---

#### EKSİK 10 — KVKK Uyumluluğu ve Veri Güvenliği 🔴

**Mevcut Durum:** TC kimlik, adres, sağlık bilgisi, ceza durumu gibi hassas kişisel veriler
şifrelenmeksizin tarayıcının IndexedDB'sinde saklanmaktadır.

**Yasal Gerekçe:** 6698 Sayılı KVKK kapsamında sağlık bilgileri ve ceza durumu "özel nitelikli
kişisel veri" statüsündedir; şifreli biçimde saklanmaları zorunludur.

**Öneri:**
1. Veriler şifreli bir backend veritabanına taşınmalıdır (PostgreSQL + encrypted at rest).
2. Rol bazlı erişim kontrolü sunucu katmanında uygulanmalıdır.
3. Veri saklama ve silme politikaları belgelenmelidir.

---

## 6. ÖZET DEĞERLENDİRME TABLOSU

| Konu | Durum | Öncelik |
|------|-------|---------|
| Çok boyutlu puanlama yaklaşımı | Doğru | — |
| Ağır engellilik önceliği | Doğru | — |
| Saha kanaati bölümü (G) | Doğru | — |
| Kademeli yardım skalası | Doğru | — |
| Bütçe takibi ve aşım uyarısı | Doğru | — |
| Tekrar müracaat / yardım yığılması kontrolü | Eksik | Yüksek |
| Varlık/Mülk sorgulaması puana yansıtma | Eksik | Yüksek |
| Özel sebep alanı denetimi | Riske Açık | Yüksek |
| UI ile Kod puan tavan tutarsızlığı | Hata | Yüksek |
| KVKK / Veri Güvenliği | Eksik | Yüksek |
| Çocuk eğitim kademe ağırlıklandırması | Yetersiz | Orta |
| Hane büyüklüğü etkisi | Yetersiz | Orta |
| Bulaşık makinesi puanlandırması | Hatalı | Orta |
| Geçmiş yardım geçmişi uyarısı | Eksik | Orta |
| Düşük engel oranı (%20–39) kriteri | Eksik | Düşük |

---

## 7. SONUÇ VE ÖNERİLER

### 7.1 Sistemin Güçlü Yönleri

Bu sistem; SYDV'lerin büyük çoğunluğunda hâlâ kullanılan kağıt-kalem ve sezgisel değerlendirme
yöntemlerine kıyasla önemli bir dijital dönüşümü temsil etmektedir. Çok boyutlu puanlama, şeffaf
kayıt tutma, hiyerarşik onay akışı, bütçe takibi ve resmi raporlama gibi özellikler kurumsal
yönetişim açısından büyük katkı sağlamaktadır.

### 7.2 Öncelikli İyileştirme Alanları (Kısa Vadeli)

1. **Varlık testi sonuçlarını (Tapu/Araç) puanlama formülüne entegre edin.** Bu en kritik eksikliktir.
2. **UI ile kod arasındaki puan tavan tutarsızlıklarını giderin** (B=30, C=10, D=10).
3. **Özel sebep puanını yönetici kontrolüne alın.**
4. **KVKK uyumluluğu için sunucu taraflı şifreli depolama planı yapın.**
5. **Tekrar müracaat için otomatik TC sorgusu uyarısı ekleyin.**
6. **Yardım yığılması hesaplamasını** (`a_son3AyYardimKisi`) aktif hale getirin.

### 7.3 Orta Vadeli İyileştirmeler

- Çocuk eğitim bölümünde kademe bazlı ağırlıklandırma
- Hane büyüklüğü etkisinin kademeli genişletilmesi
- E bölümünde lüks eşyaların (bulaşık makinesi) puandan çıkarılması
- Muhtaçlık sınırı değerinin sisteme yönetilebilir parametre olarak eklenmesi

---

*Bu rapor, projenin kaynak kodunun (Next.js / TypeScript / IndexedDB) detaylı incelenmesi
ve Türkiye sosyal yardım mevzuatı ile uluslararası sosyal koruma literatürüyle karşılaştırılması
sonucunda hazırlanmıştır.*
