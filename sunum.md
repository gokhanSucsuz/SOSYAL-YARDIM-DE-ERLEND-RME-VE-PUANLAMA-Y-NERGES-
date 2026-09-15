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
    font-size: 2.5em;
  }
  h2 {
    color: #1565c0;
    border-bottom: 3px solid #1565c0;
    padding-bottom: 8px;
    font-size: 1.8em;
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
    margin-bottom: 10px;
    font-size: 0.95em;
  }
---

# 🤝 T.C. Edirne SYDV
## Sosyal Yardım Değerlendirme ve Puanlama Sistemi

**Şeffaf, Adil ve Bilimsel Karar Destek Yazılımı**

*Kurumsal Çözüm ve Analiz Sunumu*

---

## 🎯 Bu Sisteme Neden İhtiyacımız Var?

Sınırlı devlet bütçesi ile yüzlerce başvuru arasında adaletli dağıtım yapmak en büyük zorluktur.

**Kimin daha çok ihtiyacı var?**
- Ahmet Bey'in geliri yok ama kendi evi var.
- Ayşe Hanım asgari ücretli ama 2 ağır engelli çocuğuna bakıyor.
- Fatma Teyze 70 yaşında, yalnız yaşıyor ve kirada.

**Çözüm:** İnsan hissiyatından arındırılmış, **Dünya Bankası ve OECD standartlarına uygun matematiksel bir puanlama formülü** ile ölçülebilir karar vermek.

---

## ⚙️ Sistem Nasıl Çalışıyor?

1. Görevli personel, ailenin evine gider ve mobil cihazından detaylı bir anket doldurur (Çevrimdışı çalışabilir).
2. Sistem arka planda bu verileri analiz eder ve anında **100 üzerinden bir "Muhtaçlık Puanı"** üretir.
3. Puan ne kadar yüksekse, aile o kadar acil yardıma muhtaçtır.
4. Sistem aileyi sınıflandırır (Örn: 1. Derece Ağır Muhtaç) ve bütçeye göre sistem otomatik yardım tutarı önerir.
5. Vakıf Müdürü sistemi tek ekranda inceler, bütçe aşımını görür ve onaylar.

---

## 🧮 100 Puanlık Algoritmanın Bilimsel Temeli

Sistem 6 ana kriter üzerinden (Maks 100 Puan) ve Ceza Puanları ile değerlendirme yapar:

1. **Ekonomik Durum** (Maks 25 Puan)
2. **Dezavantajlı Bireyler** (Maks 25 Puan)
3. **Sosyal Kırılganlık ve Nüfus** (Maks 15 Puan)
4. **Çocuk ve Eğitim** (Maks 15 Puan)
5. **Barınma Şartları ve Temel Eşya** (Maks 10 Puan)
6. **Görevli İnceleme Kanaati** (Maks 10 Puan)

---

## 🔍 Kriter 1 & 2: Ekonomi ve Dezavantaj

**A. Ekonomik Durum (25 Puan):** 
Hanenin resmi geliri muhtaçlık sınırının ne kadar altındaysa o kadar puan alır. Düzenli gelir ve sigorta yokluğu ile evde çalışan kimse olmaması puanı en üst düzeye taşır.

**B. Dezavantajlı Bireyler (25 Puan):** 
*En yüksek ek puanlar bu bölümdedir.* Ağır engelli birey bakımı (+12), evde bakım hastası (+8), kanser/kronik hastalıklar (+8), yaşlı ve yalnız yaşamak (+6) ailenin muhtaçlık puanını bilimsel bir yaklaşımla (Çoklu Kırılganlık İlkesi) zirveye taşır.

---

## 🔍 Kriter 3 & 4: Sosyal Yapı ve Eğitim

**C. Sosyal Kırılganlık (15 Puan):** 
Aile içi şiddet (+5), evi geçindiren yalnız kadın olmak (+4), eşin cezaevinde olması (+4). Ayrıca OECD standartlarına göre hane nüfusu kalabalıklaştıkça masraf artacağı için (Örn: 7 kişi +4 puan) puan yükselir.

**D. Eğitim ve Çocuk (15 Puan):** 
Okuyan çocukların masrafı eğitim kademesine göre artar. İlkokul öğrencisi (+2) iken, lise (+3) ve üniversite öğrencisine (+4) puan verilerek adaletsiz eşitlik ortadan kaldırılmıştır.

---

## 🔍 Kriter 5 & 6: Barınma ve Personel Kanaati

**E. Barınma ve Eşya (10 Puan):** 
Evsiz veya afetzede olmak (+8), rutubetli sağlıksız ev (+4), kiracı olmak (+3). Lüks olmayan ve hayati olan Buzdolabı/Çamaşır makinesi yokluğu puana (+1.5) dönüşür.

**F. Personel Kanaati (10 Puan):** 
Matematiğin göremediği aciliyeti, koku, hijyen ve psikolojik çöküntüyü sahaya giden personel 0-10 puan arasında (Professional Judgment) değerlendirir.

---

## 🚫 Güvenlik ve Varlık Testi (Ceza Puanları)

Sistem sadece puan vermez, kaynakları korumak için adaletsizliği cezalandırır:

- **Araç Sahibi:** Toplam puandan **-15 Puan** düşer.
- **Birden Fazla Gayrimenkul:** **-20 Puan** düşer.
- **Aktif SGK Kaydı:** **-5 Puan** düşer.
- **Mükerrer Yardım (Son 3 Ay):** Kişi başı **-5 Puan** düşülerek yardımın tabana yayılması sağlanır.
- **Yalan Beyan:** Gelir saklama tespit edilirse sistem muhtaçlık puanını **SIFIRLAR (0)** ve reddeder.

---

## 📊 Örnek Karar ve Derecelendirme Çıktısı

| Derece | Durum | Yardım Tutarı (Örnek) |
|--------|-------|-----------------------|
| **1. Derece** | Aşırı Muhtaç (90-100 Puan) | **10.000 TL** |
| **2. Derece** | Ağır Muhtaç (70-89 Puan) | **7.500 TL** |
| **3. Derece** | Orta Muhtaç (50-69 Puan) | **5.000 TL** |
| **4. Derece** | Temel Destek (30-49 Puan) | **2.500 TL** |
| **RED** | Kapsam Dışı (0-29 Puan) | **0 TL** |

*(Not: Puan aralıkları ve tutarlar Vakıf yönetimi tarafından bütçeye göre esnekçe değiştirilebilir.)*

---

## 💡 Kurumsal Kazanımlarımız

✅ **Şeffaflık ve Hesap Verilebilirlik:** Her karar detaylı formüllerle ispatlanabilir.
✅ **Kayırmacılığın Önlenmesi:** Objektif algoritma sayesinde sübjektif yargılar engellenir.
✅ **Hızlı Operasyon:** Manuel hesaplama ve toplantı tartışmaları yerini saniyeler süren dijital analize bırakır.
✅ **Güvenlik ve KVKK:** Çevrimdışı çalışabilen şifreli veritabanı ile vatandaşın verisi korunur.

**Sonuç:** Devletin kısıtlı kaynakları, gerçekten *en çok ihtiyacı olana* ulaşır.

---

# 🤝 Teşekkürler
**T.C. Edirne SYDV - Modern Karar Destek Sistemi**
