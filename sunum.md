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

---

## 🎯 Bu Sistem Neden Geliştirildi?

Sınırlı bütçe, sınırsız ihtiyaç... Kimin **daha çok** yardıma ihtiyacı olduğunu nasıl belirleriz?

- Ahmet Bey'in geliri yok ama evi var.
- Ayşe Hanım'ın geliri var ama 2 ağır engelli çocuğu var.
- Fatma Teyze 70 yaşında, yalnız ve evi ısınmıyor.

**Çözüm:** Subjektif gözlemler yerine, **matematiksel bir formül** ile adil ve dünya standartlarına uygun ölçülebilir bir değerlendirme.

---

## ⚙️ Sistem Nasıl Çalışıyor?

1. Görevli sahada tabletinden basit soruları cevaplar.
2. Arka planda **matematiksel formül** çalışır.
3. Hane için bir **Muhtaçlık Puanı** (Örn: 135 Puan) üretilir.
4. Sistem haneyi sınıflandırır ve **yardım miktarı** önerir.

*Puan ne kadar yüksekse, ihtiyaç o kadar "acil ve büyüktür"!*

---

## 🏗️ Temel Özellikler

- **📱 Saha Uyumlu:** Çevrimdışı çalışma ve otomatik veri senkronizasyonu.
- **🔒 Gizlilik:** Saha gizlilik modu ile ekranda puan gizlenir, baskı önlenir.
- **🛡️ Mükerrer Kontrolü:** T.C. Kimlik No ile anında sorgulama, yığılma engellenir.
- **📊 Bütçe Takibi:** Onaylanan yardımlarla otomatik düşen anlık bütçe takibi.
- **🖨️ Tek Tıkla Rapor:** Toplantı sonrası anında Excel veya PDF çıktı imkanı.

---

## 🧮 Puanlama Mantığı (Dünya Standartları)

Dünya Bankası, OECD ve BM yoksulluk endeksleri temel alınarak 7 ana başlıkta değerlendirme yapılır. Toplam teorik puan **150** civarındadır.

1. **Ekonomik Durum** (Maks 40 Puan)
2. **Dezavantajlı Bireyler** (Maks 30 Puan)
3. **Çocuk ve Eğitim** (Maks 15 Puan)
4. **Barınma Şartları** (Maks 10 Puan)
5. **Temel Eşya Eksikliği** (Maks 10 Puan)
6. **Sosyal Kırılganlık ve Nüfus** (Maks 30 Puan)
7. **İnceleme Kanaati** (Maks 20 Puan)

---

## 🔍 Kategorilerin Literatür Uyumu

- **Ekonomik:** Gelir bazlı hedefleme temel standarttır (Sınır altı gelire +40 puan).
- **Dezavantajlı:** 5378 Sayılı Kanun ve BM normlarınca "Çoklu Kırılganlık" ağırlıklandırılır.
- **Sosyal Nüfus:** *OECD Modifiye Edilmiş Eşdeğerlik Ölçeği* kullanılır; evdeki kişi arttıkça masraf artışı bilimsel hesaba katılır.
- **Kanaat:** Avrupa sosyal hizmet modelindeki "Professional Judgment" (Uzman Kanaati) ile personel görüşü sayısallaştırılır.

---

## 🚫 Güvenlik Filtreleri ve Varlık Testi

Sistem sadece puan vermez, literatürdeki **"Means Testing"** ile puan siler veya başvuruyu reddeder:

1. **Araç Kaydı:** -15 Puan
2. **Birden Fazla Ev (Taşınmaz):** -20 Puan
3. **Mükerrer Yardım (Son 3 Ay):** Kişi başı -5 Puan
4. **Gerçeğe Aykırı Beyan:** Puan anında **Sıfırlanır (0)** ve reddedilir.

---

## 💡 Sonuç ve Kazanımlar

- *“Neden Ahmet'e değil de Mehmet'e verdiniz?”*
- **“Çünkü Mehmet'in literatüre dayalı çok boyutlu puanı 115, Ahmet'in ise 65.”**

✅ **Kurumsal Şeffaflık Artışı**
✅ **Kayırmacılığın Önlenmesi**
✅ **Kaynakların Gerçekten En Muhtaç Olanlara Ulaşması**

---

# Teşekkürler 🙏
**T.C. Edirne SYDV - Sosyal Yardım Değerlendirme Sistemi**
