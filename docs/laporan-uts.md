# LAPORAN TUGAS PROYEK UJIAN TENGAH SEMESTER (UTS)
## MATA KULIAH PEMROGRAMAN ANTARMUKA WEB (PAW)
### PENGEMBANGAN WEBSITE EDITORIAL DAN SISTEM PEMESANAN MANDIRI "KOPI SENJA SURABAYA"

---

**Disusun Oleh Kelompok [Nomor Kelompok]:**

| No | Nama Lengkap Mahasiswa | Nomor Induk Mahasiswa (NIM) | Peran & Kontribusi Utama |
| :---: | :--- | :---: | :--- |
| 1 | **[Nama Mahasiswa 1]** *(Ketua)* | `[NIM Mahasiswa 1]` | Branding, Desain Tipografi, `index.html`, `tentang.html`, & Penyusunan Laporan UTS |
| 2 | **[Nama Mahasiswa 2]** | `[NIM Mahasiswa 2]` | Katalog Produk, `menu.html`, `script.js`, Filter Kategori, & Sistem Multi-Payment |
| 3 | **[Nama Mahasiswa 3]** | `[NIM Mahasiswa 3]` | Formulir Kontak `kontak.html`, `terima-kasih.html`, `css/style.css`, & Quality Audit W3C/Lighthouse |

**PROGRAM STUDI INFORMATIKA**  
**FAKULTAS TEKNOLOGI ELEKTRO DAN INFORMATIKA CERDAS**  
**INSTITUT TEKNOLOGI ADHI TAMA SURABAYA (ITATS)**  
**2026**

---

## 1. PENDAHULUAN & LATAR BELAKANG

### 1.1 Latar Belakang Pemilihan Tema
Kota Surabaya sebagai kota metropolitan terbesar kedua di Indonesia memiliki dinamika aktivitas yang sangat padat. Mahasiswa, pekerja kantor, dan para perantau kerap membutuhkan sebuah ruang ketiga (*third place*) untuk beristirahat, berdiskusi santai, atau menikmati waktu senja setelah seharian beraktivitas.

Berdasarkan sub-tema yang disediakan pada silabus UTS PAW, kelompok kami memilih sub-tema **"Kedai Kopi / Warung Makan"** dengan brand fiktif **"Kopi Senja Surabaya"**. Konsep yang diangkat adalah kedai kopi bernuansa hangat, bersahaja, dan menghargai nilai lokalitas Jawa Timur (*honest brew*).

### 1.2 Tujuan Pengembangan Website
1. **Representasi Identitas & Branding:** Memperkenalkan filosofi Kopi Senja, tiga pilar nilai, dan ekosistem Semesta Senja melalui desain visual editorial koran/jurnal retro.
2. **Katalog Produk Terstruktur:** Menyediakan etalase menu yang jelas, informatif, dan mudah dieksplorasi berdasarkan kategori (Paket Promo, Senja Signature, Espresso, Non-Kopi, dan Kudapan).
3. **Pemesanan Mandiri yang Cepat:** Menyediakan alur kasir mandiri digital di mana pelanggan dapat memilih menu dan menentukan metode pembayaran (QRIS, Tunai, atau Debit).
4. **Kepatuhan Standar Aksesibilitas Web:** Membangun antarmuka yang ramah pengguna dengan memenuhi kriteria aksesibilitas WCAG (kontras warna yang baik, navigasi keyboard via *skip-link*, dan skor Lighthouse $\ge 90$).

---

## 2. SKENARIO PENGGUNA & PETA SITUS

### 2.1 Persona & Skenario Pengguna (User Journey)
* **Persona:** Rian (21 tahun), mahasiswa Teknik Informatika di Surabaya yang ingin mencari tempat nugas santai dan menikmati kopi susu gula aren di sore hari.
* **Skenario:**
  1. Rian membuka website `Kopi Senja Surabaya` melalui ponsel pintarnya.
  2. Di halaman beranda (`index.html`), Rian disambut ilustrasi etalase hangat kedai dan peta ekosistem semesta senja.
  3. Rian ingin mengetahui asal usul kopi yang diseduh, lalu membuka halaman `tentang.html` untuk membaca cerita kedai dan tabel transparansi pasokan biji kopi lokal (Ijen, Dampit, Argopuro).
  4. Rian membuka `menu.html`, memfilter kategori *Senja Signature*, lalu menambahkan menu *Kopi Susu Senja Aren* dan *Roti Toast Kaya* ke keranjang.
  5. Rian mengecek ringkasan harga dan memilih pembayaran via **QRIS**, memindai kode QR yang tampil, dan menyelesaikan transaksi.

### 2.2 Struktur Hierarki Halaman (Sitemap)

```
[Beranda: index.html]
  ├── [Katalog Menu & Kasir: menu.html]
  │     └── [Modal Pembayaran: QRIS / Tunai / Debit]
  ├── [Tentang Kami: tentang.html]
  │     └── [Tabel Pasokan Biji Kopi Lokal]
  ├── [Lokasi & Kontak: kontak.html]
  │     └── [Form Pemesanan & Reservasi (8 Input)]
  └── [Konfirmasi: terima-kasih.html]
```

---

## 3. KEPUTUSAN DESAIN & TIPOGRAFI

### 3.1 Tipografi Gaya Surat Kabar (Option 3)
Untuk menciptakan kesan hangat, personal, dan jujur layaknya membaca jurnal lokal:
* **Font Judul (`h1`, `h2`, `h3`, `h4`):** *Permanent Marker* (Google Fonts) — memberikan sentuhan tulisan tangan yang khas dan bersahaja.
* **Font Isi & Monospace (`p`, `table`, `form`):** *Courier Prime* (Google Fonts) — memberikan nuansa mesin tik surat kabar klasik dengan keterbacaan yang sangat tinggi.

### 3.2 Palet Warna Resmi (Opsi 2: Autentik Nusantara & Gula Aren)
* **Latar Utama (`--bg`):** `#F4EFE6` (Oatmeal koran sore lembut — hangat dan tidak kusam).
* **Teks & Kontur (`--ink`):** `#221C18` (Tinta cetak koran pekat).
* **Aksen Primer / Tombol (`--terra`):** `#C45A1A` (Jingga gula aren bakar / senja Surabaya).
* **Aksen Sekunder / Pandan (`--green-fresh`):** `#2C5E43` (Hijau daun pandan segar).
* **Kartu Kontainer (`--card`):** `#FFFDF9` (Putih gading bersih).
* **Permukaan Input (`--card-surface`):** `#FFFFFF` (Putih murni).
* **Footer & Gelap (`--dark-espresso`):** `#1C1510` (Espresso sangrai).
* **Dukungan Dark Mode:** Diadaptasi otomatis melalui `@media (prefers-color-scheme: dark)`.

---

## 4. IMPLEMENTASI TEKNIS & PEMENUHAN RUBRIK UTS

| Kriteria Rubrik | Implementasi pada Proyek | Status |
| :--- | :--- | :---: |
| **Teknologi** | HTML5, CSS3 kustom terpadu, Bootstrap 5.3 CDN, JavaScript ES6. | Sesuai |
| **Struktur Berkas** | Terbagi rapi: `css/style.css`, `images/`, `docs/`, dan 5 berkas `.html`. | Sesuai |
| **Satu `<h1>`** | Setiap halaman tepat memiliki 1 tag `<h1>` yang mendeskripsikan konteks utama. | Sesuai |
| **Skip Link** | Disediakan `<a href="#main" class="skip-link">` di awal setiap dokumen. | Sesuai |
| **Figure & Figcaption** | Setiap halaman memiliki minimal 1 pasang `<figure>` dan `<figcaption>`. | Sesuai |
| **Tabel Semantik** | Menggunakan `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`, dan `<th scope="row">`. | Sesuai |
| **Formulir Lengkap** | Minimal 8 input dengan 6 tipe berbeda (`text`, `email`, `tel`, `date`, `number`, `select`, `radio`, `checkbox`, `textarea`) terbungkus `<fieldset>` & `<legend>`. | Sesuai |
| **CSS Variables** | Didefinisikan lebih dari 15 variabel di `:root`. | Sesuai |
| **Zero ID / !important** | 100% selektor styling CSS menggunakan class semantik tanpa ID dan tanpa `!important`. | Sesuai |
| **Grid & Flexbox** | Menggunakan `grid-template-areas` dan `repeat(auto-fit, minmax(...))` serta flexbox. | Sesuai |
| **Mobile-First & Responsif** | Media query `min-width` dalam satuan `rem`, bebas scroll horizontal pada 320px, touch target $\ge 44\text{ px}$. | Sesuai |
| **Dark Mode** | Menggunakan `@media (prefers-color-scheme: dark)` yang mengadaptasi variabel warna. | Sesuai |

---

## 5. PENGUJIAN KUALITAS & AKSESIBILITAS

1. **W3C Markup Validator:**  
   Seluruh halaman (`index.html`, `menu.html`, `tentang.html`, `kontak.html`, `terima-kasih.html`) telah diuji melalui validator W3C dengan status **Valid (0 Error, 0 Warning)**.
2. **Google Chrome Lighthouse:**  
   Pengujian audit aksesibilitas pada Chrome DevTools menghasilkan skor di atas 90 untuk aspek Aksesibilitas, Best Practices, dan SEO.

---

## 6. TAUTAN REPOSITORI & DEMO ONLINE

* **Tautan Repositori GitHub:** `https://github.com/[username-kelompok]/kopi-senja-surabaya`
* **Tautan Live Demo (GitHub Pages / Vercel):** `https://[username-kelompok].github.io/kopi-senja-surabaya/`

