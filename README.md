# T.C. Edirne SYDV - Sosyal Yardım Değerlendirme ve Puanlama Yönergesi Sistemi 🤝

Bu sistem, **Sosyal Yardımlaşma ve Dayanışma Vakfı (SYDV)** çalışanlarının, maddi veya ayni yardıma muhtaç olan vatandaşların başvurularını değerlendirirken kullanmaları için geliştirilmiş **şeffaf, adil ve bilimsel** bir karar destek yazılımıdır. 

Geleneksel "kağıt-kalem" veya tamamen "gözleme dayalı" (subjektif) sistemlerin yerine; adil, ölçülebilir ve literatüre (dünya standartlarına) uygun bir matematiksel puanlama modeli kullanır.

---

## 🎯 Bu Sistem Neden Geliştirildi? (Hiç Bilmeyenler İçin)

Düşünün ki vakfa bir gün içinde 50 farklı aile başvurdu ve vakfın elinde dağıtabileceği sınırlı bir bütçe var. Kimin **daha çok** yardıma ihtiyacı olduğunu nasıl belirleriz? 
- Ahmet Bey'in geliri yok ama evi var.
- Ayşe Hanım'ın geliri var ama evinde bakıma muhtaç 2 ağır engelli çocuğu var.
- Fatma Teyze 70 yaşında, yalnız yaşıyor ve evi kışın ısınmıyor.

İşte bu yazılım, görevlinin sahada (vatandaşın evinde) tablet veya telefonundan doldurduğu basit sorulara (Evi kira mı? Engelli var mı? Kaç çocuğu var?) verdiği cevapları alır. Arka planda **matematiksel bir formül** çalıştırır ve o hane için bir **Muhtaçlık Puanı (Örn: 135 Puan)** üretir. Puan ne kadar yüksekse, o hanenin yardıma ihtiyacı o kadar "acil ve büyük" demektir.

Sistem daha sonra bu puana göre haneyi sınıflandırır (Örn: "1. Derece Aşırı Muhtaç") ve adaletli bir yardım miktarı (Örn: 10.000 TL) önerir.

---

## 🏗️ Temel Özellikler

- **📱 Saha Uyumlu (PWA / Çevrimdışı Çalışma):** Görevliler internetin çekmediği ücra köylerde bile formu doldurabilir, veriler cihazda saklanır, internet geldiğinde sisteme kaydedilir.
- **🔒 Gizlilik ve Güvenlik:** Görevli sahada formu doldururken ekranda puanı göremez (Saha Gizlilik Modu). Bu sayede hanedeki vatandaşlar "Bana kaç puan verdiniz, az verdiniz" diyerek görevliyi baskı altına alamaz.
- **🛡️ Mükerrer (Yığılma) Kontrolü:** T.C. Kimlik No girildiği an sistem uyarır: "Bu kişi son 3 ayda yardım almış." Adaletsizliğin önüne geçilir.
- **📊 Bütçe Takibi:** Vakıf müdürü toplantı öncesi bütçeyi girer (Örn: 100.000 TL). Onaylanan yardımlar arttıkça kalan bütçe anlık olarak ekranda güncellenir.
- **🖨️ Tek Tıkla Excel/PDF:** Toplantı bittiğinde kimlere ne kadar yardım çıkacağı tek tuşla listelenir ve yazıcıdan çıktı alınabilir.

---

## 🧮 Puanlama Mantığı ve Dünya Standartlarına (Literatüre) Uyumu

Sistemin kalbi olan "Puanlama Formülü", Dünya Bankası (World Bank), OECD ve Birleşmiş Milletler (UNDP) yoksulluk endeksleri temel alınarak, A'dan G'ye kadar 7 ana başlıkta toplanmıştır. Toplam ulaşılabilecek teorik puan **150** civarındadır.

### A. Ekonomik Durum (Maksimum 40 Puan)
Kişinin geliri, resmi "Muhtaçlık Sınırı"na göre oranlanır. Sınırın çok altındaysa en yüksek puanı (+40) alır. Hanede çalışan yoksa veya düzenli geliri yoksa ek puanlar verilir.
- **Literatür Uyumu:** Gelir bazlı "Hedefleme (Targeting)" tüm dünyada temel standarttır. SGK kaydı olup aktif prim ödeyenlerin bu bölümden puan alması engellenir.

### B. Dezavantajlı Bireyler (Maksimum 30 Puan)
Hastalık, yaşlılık ve yalnızlık gibi dezavantajlar puanlanır. Örneğin ağır engelli biri için (+15), yalnız yaşayan yaşlı biri için (+8), yetim çocuk için (+5) puan verilir.
- **Literatür Uyumu:** *5378 Sayılı Engelliler Kanunu* ve Birleşmiş Milletler normlarına göre "Çoklu Kırılganlık" ilkesi gereği engelli/hasta bireyler ekstra ağırlıklandırılır.

### C. Çocuk ve Eğitim (Maksimum 15 Puan)
Okuyan çocuklara eğitim kademesine göre artan puanlar verilir. (0-6 yaş/İlkokul: +2 Puan, Lise: +3 Puan, Üniversite: +4 Puan).
- **Literatür Uyumu:** Şartlı Eğitim Yardımı (ŞEY) ve Dünya Bankası raporlarında, eğitim seviyesi arttıkça eğitim masrafının arttığı kabul edilir. (Eskiden her çocuğa eşit puan verilirken bu sistemle adalet sağlanmıştır).

### D. Barınma Şartları (Maksimum 10 Puan)
Kişi evsizse (+10), konutu ağır hasarlıysa (+8), asansörsüz yüksek katta oturuyorsa ve yaşlıysa (+4) puan alır.
- **Literatür Uyumu:** Barınma hakkı, Çok Boyutlu Yoksulluk Endeksi'nin (MPI) yapı taşlarından biridir.

### E. Temel Eşya Eksikliği (Maksimum 10 Puan)
Buzdolabı, çamaşır makinesi, yatak gibi hayati eşyalar eskiyse veya yoksa puan alır.
- **Literatür Uyumu:** TÜİK ve OECD standartlarında bulaşık makinesi, akıllı telefon gibi cihazlar "konfor/lüks eşya" sayıldığından bu sistemde puan kazandırmaz. Yalnızca hayati eşyaların yokluğu puanlanır.

### F. Sosyal Kırılganlık ve Nüfus (Maksimum 30 Puan)
Aile içi şiddet, boşanma, eşin cezaevinde olması gibi durumlar puanlanır. Ayrıca hane kalabalıklaştıkça puan artar. (1-2 kişi: +1 Puan ... 7 ve üzeri kişi: +6 Puan).
- **Literatür Uyumu:** **OECD Modifiye Edilmiş Eşdeğerlik Ölçeği (Modified Equivalence Scale)** kullanılmıştır. Bu ölçek, evdeki kişi sayısı arttıkça masrafların da belirli bir oranda arttığını bilimsel olarak kanıtlar.

### G. İnceleme Kanaati (Maksimum 20 Puan)
Bilgisayar her şeyi bilemez; insan gözlemi şarttır. Eve giden görevli; kokuyu, hijyeni, ailenin aciliyetini ve çevreden (akraba) alabileceği destek ihtimalini 0'dan 5'e kadar puanlar.
- **Literatür Uyumu:** Buna Avrupa sosyal hizmet modelinde "Professional Judgment (Uzman Kanaati)" denir. Sistem robotikleşmekten kurtarılır, uzman personelin görüşü sayısallaştırılır.

---

## 🚫 Güvenlik Filtreleri ve Ceza Puanları (Varlık Testi)

Sistem sadece "puan vererek" çalışmaz, bazı durumlarda puanları siler veya cezalandırır. Buna literatürde **"Means Testing (Varlık Testi)"** denir:

1. **Araç Kaydı Tespit Edilirse:** -15 Puan silinir.
2. **Birden Fazla Evi (Taşınmazı) Varsa:** -20 Puan silinir.
3. **Mükerrer (Yığılma) Yardım:** Son 3 ay içinde yardım almışlarsa kişi başı -5 Puan silinir (Yardım yığılmasının önüne geçmek için).
4. **Gerçeğe Aykırı Beyan:** Evde gizlenen bir gelir tespit edilirse, sistem "DİKKAT" butonuna basılmasına izin verir ve başvuranın puanını anında **Sıfırlar (0)** ve reddeder.

---

## 💡 Özet

Bu sistem sayesinde, Edirne SYDV birimleri yardımları dağıtırken;
- *“Neden Ahmet'e değil de Mehmet'e verdiniz?”* sorusuna **“Çünkü Mehmet'in literatüre dayalı çok boyutlu puanı 115, Ahmet'in ise 65”** diyerek bilimsel ve kanıtlanabilir bir cevap verebilecektir.
- Kurumsal şeffaflık artacak, kayırmacılık ihtimali yazılımsal kısıtlarla ortadan kalkacak ve devletin kaynakları **gerçekten en muhtaç olanlara** gidecektir.
