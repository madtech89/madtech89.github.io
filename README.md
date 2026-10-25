# 🚀 MadTech Studio - Modern Portfolyo & Proje Tanıtım Vitrini

Bu proje, **GitHub Pages** üzerinde ücretsiz, yüksek hızlı ve sunucusuz olarak çalışmak üzere tasarlanmış; modern, estetik (Dark Luxury & Glassmorphism) ve **dahili yönetim paneline (Admin Panel)** sahip bir kişisel portfolyo ve proje tanıtım web sitesidir.

Canlı Site Adresi: **[https://madtechstudio.github.io](https://madtechstudio.github.io)**  
Yönetim Paneli Adresi: **[https://madtechstudio.github.io/admin.html](https://madtechstudio.github.io/admin.html)**

---

## ✨ Öne Çıkan Özellikler

1. **Ultra Lüks & Modern Cyber-Glass Tasarım:**
   - Koyu tema (Dark Obsidian), neon gradyanlar, cam efekti (Glassmorphism), akıcı mikro animasyonlar.
   - Hero alanında interaktif daktilo (typing) unvan efekti.
   - 3D derinlikli profil kartı ve yüzen başarı rozetleri.

2. **Dinamik Proje & Web Siteleri Vitrini:**
   - Kategori filtreleme (*Web Siteleri, E-Ticaret, Kurumsal, Mobil, Yapay Zeka*).
   - Canlı Site Ziyaret Butonları (`Canlı Demo ↗`) ve GitHub Kod Bağlantıları.
   - Kartlara tıklandığında açılan **Proje Detay Modalı** (Açıklama, teknolojiler, canlı linkler).

3. **Gelişmiş İletişim Kanalları:**
   - Doğrudan telefon araması (`tel:`).
   - **Doğrudan WhatsApp İletişim:** Form doldurulduğunda veya butonlara basıldığında mesajı otomatik hazırlayıp WhatsApp Web/Mobil uygulamasını başlatır.
   - E-posta bağlantısı (`mailto:`) ve sosyal medya profilleri.
   - Sayfada sabit duran nabız efektli hızlı WhatsApp butonu.

4. **Kullanıcı Dostu Dahili Admin Paneli (`admin.html`):**
   - **PIN Kodu Korumalı Giriş** (Varsayılan PIN: `1234`, panelden kolayca değiştirilebilir).
   - Profil, biyografi, telefon numarası, WhatsApp numarası ve profil fotoğrafını görsel önizlemeli düzenleme.
   - **Projeler Yönetimi (Tam CRUD):** Yeni proje ekleme, var olanları düzenleme, silme, öne çıkarma.
   - **Yetenekler & İstatistikler:** Yüzdelik oranlar, ikonlar ve başarı sayaçları.
   - **Tek Tıkla GitHub'a Kaydetme:** GitHub Personal Access Token ile panelden tek butonla sitenizi canlıda güncelleyin! (Sunucu veya kodlama gerekmez).
   - Alternatif olarak `content.json` indirme ve yedek yükleme.

5. **Tam SEO & Arama Motoru Uyumluluğu:**
   - Google ve Bing için otomatik oluşturulmuş `sitemap.xml`.
   - Arama motoru robotları için `robots.txt`.
   - Open Graph ve Twitter Card zengin önizleme meta etiketleri.

---

## 📁 Proje Dosya Yapısı

```text
madtechstudio.github.io/
├── index.html            <- Ana vitrin ve portfolyo sayfası
├── admin.html            <- Yönetim Paneli (PIN korumalı)
├── sitemap.xml           <- Arama motoru site haritası
├── robots.txt            <- Robot yönlendirmeleri
├── data/
│   └── content.json      <- Tüm site içeriği, profil, projeler ve ayarlar
├── css/
│   ├── style.css         <- Ana site modern stilleri (Glassmorphism & Dark theme)
│   └── admin.css         <- Admin paneli dashboard stilleri
├── js/
│   ├── main.js           <- Ana sayfa veri yükleyici, filtreleme, animasyonlar
│   └── admin.js          <- Admin paneli motoru, CRUD ve GitHub REST API
└── README.md             <- Bu kılavuz
```

---

## 🛠️ GitHub Pages'te Canlıya Alma

1. Değişiklikleri GitHub deponuza gönderin:
   ```bash
   git add .
   git commit -m "Update branding to madtechstudio"
   git push origin main
   ```

2. GitHub deponuzun ayarlarına gidin:
   - **GitHub.com** -> `madtechstudio/madtechstudio.github.io`
   - **Settings** (Ayarlar) sekmesine tıklayın.
   - Sol menüden **Pages** seçeneğine tıklayın.
   - **Build and deployment** altında:
     - **Source:** `Deploy from a branch`
     - **Branch:** `main` / `/(root)` seçili olsun ve **Save** butonuna tıklayın.

3. Siteniz **`https://madtechstudio.github.io`** adresinde tüm dünyadan erişilebilir olacaktır! 🎉

---

## 🔐 Admin Paneli Kullanımı

1. Tarayıcınızdan **`https://madtechstudio.github.io/admin.html`** adresini açın.
2. PIN kodunuzu girin:
   - **Varsayılan PIN:** `1234`
3. Profilinizi, telefon numaranızı, WhatsApp'ınızı veya projelerinizi dilediğiniz gibi düzenleyin.

### Değişiklikleri Canlı Yayına Aktarma Yöntemleri:

#### Yöntem 1: Tek Tıkla Canlı Yayın (Önerilen 🚀)
1. Admin panelinde **"GitHub'a Yayınla"** sekmesine gelin.
2. GitHub hesabınızdan bir Personal Access Token oluşturun:
   - *GitHub -> Settings -> Developer Settings -> Personal access tokens (classic) -> Generate new token*
   - Token yetkisi olarak **"repo"** kutucuğunu işaretleyin.
3. Token'ı panele yapıştırıp **"Token'ı Kaydet"** butonuna basın.
4. İstediğiniz zaman **"Değişiklikleri GitHub'a Kaydet ve Yayınla"** butonuna basarak tek tıkla canlı siteyi güncelleyebilirsiniz.

#### Yöntem 2: Manuel Güncelleme
1. Admin panelindeki **"content.json İndir"** butonuna basın.
2. İndirilen `content.json` dosyasını projenizdeki `data/` klasörüne atıp terminalden `git push` yapın.
