# ☕ Kopi Senja Surabaya — Proyek UTS Pemrograman Antarmuka Web (PAW)

> **Website Ruang Singgah & Pemesanan Mandiri Kedai Kopi Senja Surabaya**  
> Tugas Proyek Ujian Tengah Semester (UTS) Semester Gasal 2026/2027  
> Program Studi Informatika — Institut Teknologi Adhi Tama Surabaya (ITATS)  
> **Dosen Pengampu:** Septiyawan Rosetya Wardhana, S.Kom., M.Kom.

---

## 👥 Informasi Kelompok & Pembagian Tugas

| No | Nama Anggota | NIM | Peran Utama | Halaman / Tanggung Jawab |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **[Nama Mahasiswa 1]** *(Ketua)* | `[NIM 1]` | **Branding, Halaman Utama & Dokumentasi** | `index.html`, `tentang.html`, Desain Tipografi Editorial, Penyusunan Laporan UTS (`docs/laporan-uts.md`), dan README. |
| **2** | **[Nama Mahasiswa 2]** | `[NIM 2]` | **Katalog Menu & Sistem Interaksi Pemesanan** | `menu.html`, `script.js`, Filter Kategori Menu, Keranjang Belanja, dan Modal Pembayaran (QRIS, Tunai, Debit). |
| **3** | **[Nama Mahasiswa 3]** | `[NIM 3]` | **Formulir Kontak, Responsivitas & Quality/Audit** | `kontak.html`, `terima-kasih.html`, `css/style.css`, Aksesibilitas (Lighthouse $\ge 90$), dan Validasi W3C (0 Error). |

---

## 📖 Deskripsi & Konsep Proyek

**Kopi Senja Surabaya** adalah website kedai kopi lokal bernuansa hangat dan humanis (*third place*) yang berlokasi di Jl. Dharmawangsa No. 24, Gubeng, Surabaya. Website ini dirancang dengan gaya visual **Editorial Newspaper / Retro Warm Journal**:
- **Tipografi:** Kombinasi *Permanent Marker* (judul tulisan tangan yang bersahaja) dan *Courier Prime* (body text monospace mesin tik surat kabar).
- **Palet Warna (Opsi 2: Autentik Nusantara & Gula Aren):** Latar oatmeal koran sore (`#F4EFE6`), teks tinta koran (`#221C18`), aksen jingga gula aren bakar (`#C45A1A`), kartu krem gading (`#FFFDF9`), dan aksen hijau daun pandan (`#2C5E43`). Dilengkapi dukungan mode gelap (`@media (prefers-color-scheme: dark)`).
- **Tujuan Pengguna:** Menyediakan ruang eksplorasi semesta kedai, cerita asal usul biji kopi lokal Jawa Timur, katalog menu interaktif, hingga kasir pemesanan mandiri cepat.

---

## 📁 Struktur Direktori Proyek

Sesuai dengan ketentuan Slide 2 Rubrik UTS:

```text
projek baru/
├── css/
│   └── style.css            # Berkas CSS eksternal terpadu (variabel :root, grid, dark mode)
├── docs/
│   └── laporan-uts.md       # Laporan resmi proyek UTS kelompok
├── images/                  # Aset gambar menu, banner etalase, dan peta semesta senja
│   ├── banner-kawan-senja.jpg
│   ├── semesta-senja-map.jpg
│   ├── kopi-susu-aren.jpg
│   ├── cloud-pandan.jpg
│   └── ... (aset foto menu lainnya)
├── index.html               # Halaman Beranda & Semesta Senja
├── tentang.html             # Halaman Cerita, 3 Pilar Nilai & Tabel Biji Kopi
├── menu.html                # Halaman Katalog Menu & Kasir Pemesanan
├── kontak.html              # Halaman Form Pemesanan & Lokasi Kedai
├── terima-kasih.html        # Halaman Konfirmasi Pesanan Selesai
├── script.js                # Interaktivitas pemesanan, filter, & modal pembayaran
├── README.md                # Dokumentasi utama proyek
└── style.css                # Salinan mirror stylesheet
```

---

## 🛠️ Pemenuhan Rubrik Penilaian UTS

Website ini dirancang secara ketat memenuhi seluruh kriteria penilaian:

### 1. Struktur Dokumen & HTML Semantik (Slide 4)
- **Tepat 1 `<h1>`** di setiap halaman web.
- **Skip Link Aksesibilitas:** `<a href="#main" class="skip-link">Lewati ke konten utama</a>` di awal dokumen sebelum `<header>`.
- **Navigasi Konsisten:** Menggunakan tag `<nav>` lengkap dengan penanda halaman aktif `aria-current="page"`.
- **Figure & Figcaption:** Minimal satu pasang `<figure>` dan `<figcaption>` di setiap halaman utama.
- **Tabel Semantik Lengkap:** Terletak di `tentang.html` (Tabel Pasokan Biji Kopi Lokal) dan `menu.html` menggunakan `<caption>`, `<thead>`, `<tbody>`, `<th scope="col">`, dan `<th scope="row">`.
- **Formulir Standar (8 Input / 6 Tipe):** Terletak di `kontak.html` dibungkus `<fieldset>` dan `<legend>`, dengan metode `GET` mengarah ke `terima-kasih.html`.

### 2. CSS & Desain Responsif (Slide 5)
- **Eksternal CSS:** Seluruh styling berada di `css/style.css` tanpa satupun inline `style=""`.
- **10+ Custom Properties (`:root`):** Terdefinisi untuk seluruh palet warna, tipografi, dan skala spasi.
- **Bebas ID Selector & Bebas `!important`:** Semua selektor styling murni menggunakan class semantik.
- **Modern Layout:** Menggunakan perpaduan **Flexbox** dan **CSS Grid** (`repeat(auto-fit, minmax(...))` dan `grid-template-areas`).
- **Positioning:** Menggunakan `position: sticky` (navbar & filter bar) serta `position: absolute` di dalam `position: relative`.
- **Media Query Mobile-First:** Berbasis `rem`/`em` (`min-width: 48rem`, `min-width: 64rem`).
- **Aksesibilitas Khusus:**
  - Mode Gelap: `@media (prefers-color-scheme: dark)` yang mengadaptasi palet warna secara otomatis.
  - Pengurangan Gerak: `@media (prefers-reduced-motion: reduce)`.
  - Area sentuh tombol (*touch target*) minimal $44 \times 44\text{ px}$.
  - Tanpa scroll horizontal pada resolusi mobile 320px.

### 3. Interaksi JavaScript & Pembayaran
- Filter instan kategori menu tanpa reload halaman.
- Keranjang pesanan dinamis (*cart*) dengan perhitungan total otomatis.
- Modal pembayaran interaktif dengan 3 pilihan: **QRIS**, **Tunai di Kasir**, dan **Kartu Debit**.

---

## 🚀 Cara Menjalankan Proyek

1. **Menggunakan Laragon / XAMPP:**
   - Salin seluruh folder ke `C:/laragon/www/kopi/` atau `C:/xampp/htdocs/kopi/`.
   - Buka browser dan akses `http://localhost/kopi/`.
2. **Menggunakan Visual Studio Code Live Server:**
   - Buka folder proyek di VS Code.
   - Klik kanan pada `index.html` $\rightarrow$ pilih **"Open with Live Server"**.
3. **Membuka Langsung (Offline):**
   - Cukup klik ganda file `index.html` pada browser apa pun (Google Chrome / Mozilla Firefox / Edge).

---

## 📊 Hasil Pengujian Standar Web
- **W3C Markup Validation Service:** `0 Errors, 0 Warnings` (HTML5 Valid).
- **Google Lighthouse:** Skor Aksesibilitas $\ge 90$.

