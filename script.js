/**
 * KOPI SENJA SURABAYA - SCRIPT UTAMA
 * Modul fungsional untuk Kasir Mandiri, Filter Rekomendasi Menu, Pembayaran (QRIS, Tunai, Debit),
 * Tab Cerita Aksesibel, Formulir Kontak, dan Aksesibilitas Keyboard.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Cabut no-transition setelah paint pertama selesai agar transisi berikutnya normal
    requestAnimationFrame(() => requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
    }));

    initThemeToggle();
    initHeroParallaxTuku();
    initMenuFilter();
    initKasirMandiri();
    initTentangTabs();
    initKontakForm();
    initEscapeKeyListener();
});

/* ==========================================================================
   1. FILTER KATEGORI & REKOMENDASI MENU DINAMIS (menu.html)
   ========================================================================== */
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    if (filterButtons.length === 0 || menuCards.length === 0) return;

    // Data Rekomendasi Barista berdasarkan Kategori yang dipilih
    const dataRekomendasi = {
        'semua': {
            icon: '☕✨',
            judul: 'Semua Seduhan & Kudapan Kopi Senja',
            isi: 'Jelajahi seluruh 14 menu pilihan kami. Klik tombol <strong>+ Pesan</strong> pada kartu mana pun untuk langsung memasukkannya ke kasir mandiri!'
        },
        'promo': {
            icon: '🔥',
            judul: 'Rekomendasi Hemat Kawan Senja',
            isi: 'Paket bundling paling pas untuk dinikmati berdua atau bareng kawan, hemat hingga 25%! Beli 2 Gratis 1 Americano juga tersedia untuk teman nugas.'
        },
        'signature': {
            icon: '⭐',
            judul: 'Rekomendasi Menu Ikonik Senja',
            isi: 'Racikan espresso gula aren murni nusantara dan kreasi segar Senja Cloud Pandan dengan cold foam lembut — paling dirindukan kawan di Surabaya.'
        },
        'klasik': {
            icon: '☕',
            judul: 'Rekomendasi Espresso Bold & Mantap',
            isi: 'Bagi penikmat kopi sejati: espresso double shot, Americano segar, dan Caramel Macchiato legit dari biji kopi lokal Jawa Timur pilihan.'
        },
        'non-kopi': {
            icon: '🍵',
            judul: 'Rekomendasi Segar & Tenang (Non-Kafein)',
            isi: 'Nikmati Matcha Latte Uji Jepang otentik, Belgian Dark Chocolate pekat kental, atau Earl Grey Lemon Tea yang menyejukkan dahaga.'
        },
        'toast': {
            icon: '🍞',
            judul: 'Rekomendasi Kudapan Hangat Panggang',
            isi: 'Roti tawar tebal panggang garing dengan selai srikaya wangi dan lelehan mentega gurih dingin, atau Artisan Butter Croissant berongga sempurna.'
        }
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const kategori = this.getAttribute('data-filter');

            // 1. Update status aktif tombol
            filterButtons.forEach(b => {
                b.classList.remove('aktif');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('aktif');
            this.setAttribute('aria-pressed', 'true');

            // 2. Filter kartu menu
            menuCards.forEach(card => {
                const cardKategori = card.getAttribute('data-kategori');
                if (kategori === 'semua' || cardKategori === kategori) {
                    card.classList.remove('tersembunyi');
                    card.classList.remove('anim-fade');
                    // Trigger reflow untuk animasi fade-in halus
                    void card.offsetWidth;
                    card.classList.add('anim-fade');
                } else {
                    card.classList.add('tersembunyi');
                }
            });

            // 3. Update Kotak Rekomendasi Barista
            const iconEl = document.getElementById('rekomendasiIcon');
            const judulEl = document.getElementById('rekomendasiJudul');
            const isiEl = document.getElementById('rekomendasiIsi');
            const boxEl = document.getElementById('boxRekomendasi');

            if (dataRekomendasi[kategori]) {
                const info = dataRekomendasi[kategori];
                if (iconEl) iconEl.textContent = info.icon;
                if (judulEl) judulEl.textContent = info.judul;
                if (isiEl) isiEl.innerHTML = info.isi;

                if (boxEl) {
                    boxEl.style.transform = 'scale(1.01)';
                    setTimeout(() => { boxEl.style.transform = 'scale(1)'; }, 200);
                }
            }
        });
    });
}

/* ==========================================================================
   2. KASIR MANDIRI, PEMBAYARAN (QRIS, TUNAI, DEBIT) & STRUK DIGITAL (menu.html)
   ========================================================================== */
function initKasirMandiri() {
    const tbody = document.getElementById('badanTabelPesanan');
    if (!tbody) return; // Bukan di halaman menu

    let daftarPesanan = [];

    // Helper Format Mata Uang Rupiah
    function formatRupiah(angka) {
        return 'Rp ' + Number(angka).toLocaleString('id-ID');
    }

    // Generator SVG QRIS Asli (Vector Murni Offline)
    function generateQrisSvg() {
        return `
            <svg viewBox="0 0 100 100" width="130" height="130" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#FFFFFF"/>
                <!-- Corner Top-Left -->
                <rect x="8" y="8" width="26" height="26" fill="#1C120C" rx="3"/>
                <rect x="12" y="12" width="18" height="18" fill="#FFFFFF" rx="2"/>
                <rect x="16" y="16" width="10" height="10" fill="#1C120C" rx="1"/>
                <!-- Corner Top-Right -->
                <rect x="66" y="8" width="26" height="26" fill="#1C120C" rx="3"/>
                <rect x="70" y="12" width="18" height="18" fill="#FFFFFF" rx="2"/>
                <rect x="74" y="16" width="10" height="10" fill="#1C120C" rx="1"/>
                <!-- Corner Bottom-Left -->
                <rect x="8" y="66" width="26" height="26" fill="#1C120C" rx="3"/>
                <rect x="12" y="70" width="18" height="18" fill="#FFFFFF" rx="2"/>
                <rect x="16" y="74" width="10" height="10" fill="#1C120C" rx="1"/>
                <!-- Matrix Dots -->
                <rect x="40" y="10" width="6" height="6" fill="#1C120C"/>
                <rect x="52" y="10" width="6" height="6" fill="#1C120C"/>
                <rect x="40" y="22" width="6" height="6" fill="#1C120C"/>
                <rect x="52" y="22" width="6" height="6" fill="#1C120C"/>
                <rect x="10" y="40" width="6" height="6" fill="#1C120C"/>
                <rect x="22" y="40" width="6" height="6" fill="#1C120C"/>
                <rect x="10" y="52" width="6" height="6" fill="#1C120C"/>
                <rect x="22" y="52" width="6" height="6" fill="#1C120C"/>
                <rect x="68" y="40" width="6" height="6" fill="#1C120C"/>
                <rect x="80" y="40" width="6" height="6" fill="#1C120C"/>
                <rect x="40" y="68" width="6" height="6" fill="#1C120C"/>
                <rect x="52" y="80" width="6" height="6" fill="#1C120C"/>
                <rect x="68" y="68" width="8" height="8" fill="#1C120C"/>
                <rect x="80" y="80" width="8" height="8" fill="#1C120C"/>
                <!-- Center Badge -->
                <rect x="36" y="36" width="28" height="28" fill="#A34A22" rx="4"/>
                <text x="50" y="55" font-size="14" text-anchor="middle" fill="#FFFDF9">☕</text>
            </svg>
            <span>SCAN QRIS KOPI SENJA</span>
        `;
    }

    // Hitung Total Pesanan
    function hitungTotal() {
        let totalNominal = 0;
        let totalItem = 0;

        daftarPesanan.forEach(item => {
            totalNominal += item.harga * item.qty;
            totalItem += item.qty;
        });

        const displayTotal = document.getElementById('displayTotalBayar');
        const badgeItem = document.getElementById('badgeTotalItem');
        const badgeNominal = document.getElementById('badgeTotalNominal');

        if (displayTotal) displayTotal.textContent = formatRupiah(totalNominal);
        if (badgeItem) badgeItem.textContent = totalItem + ' Item';
        if (badgeNominal) badgeNominal.textContent = formatRupiah(totalNominal);

        return { totalNominal, totalItem };
    }

    // Render Tabel Keranjang Pesanan
    function renderTabelPesanan() {
        tbody.innerHTML = '';

        if (daftarPesanan.length === 0) {
            tbody.innerHTML = `
                <tr id="barisKosong">
                    <td colspan="5" class="pesanan-kosong">
                        Belum ada menu yang dipilih. Klik tombol <strong>+ Pesan</strong> pada kartu menu di atas!
                    </td>
                </tr>
            `;
            hitungTotal();
            return;
        }

        daftarPesanan.forEach((item, index) => {
            const subtotal = item.harga * item.qty;
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td><strong>${item.nama}</strong></td>
                <td class="col-harga">${formatRupiah(item.harga)}</td>
                <td class="text-center">
                    <div class="qty-control">
                        <button type="button" class="btn-qty" data-action="minus" data-index="${index}" aria-label="Kurangi ${item.nama}">&minus;</button>
                        <span class="qty-angka">${item.qty}</span>
                        <button type="button" class="btn-qty" data-action="plus" data-index="${index}" aria-label="Tambah ${item.nama}">&#43;</button>
                    </div>
                </td>
                <td class="col-subtotal"><strong>${formatRupiah(subtotal)}</strong></td>
                <td class="text-center">
                    <button type="button" class="btn-hapus-item" data-index="${index}" title="Hapus menu" aria-label="Hapus ${item.nama}">&times;</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event listener tombol Qty & Hapus
        tbody.querySelectorAll('.btn-qty').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                const aksi = this.getAttribute('data-action');

                if (aksi === 'plus') {
                    daftarPesanan[idx].qty += 1;
                } else if (aksi === 'minus') {
                    if (daftarPesanan[idx].qty > 1) {
                        daftarPesanan[idx].qty -= 1;
                    } else {
                        daftarPesanan.splice(idx, 1);
                    }
                }
                renderTabelPesanan();
            });
        });

        tbody.querySelectorAll('.btn-hapus-item').forEach(btn => {
            btn.addEventListener('click', function () {
                const idx = parseInt(this.getAttribute('data-index'), 10);
                daftarPesanan.splice(idx, 1);
                renderTabelPesanan();
            });
        });

        hitungTotal();
    }

    // Tambah Item ke Keranjang
    function tambahItem(nama, harga, qty = 1) {
        const existingIndex = daftarPesanan.findIndex(item => item.nama === nama);
        if (existingIndex > -1) {
            daftarPesanan[existingIndex].qty += qty;
        } else {
            daftarPesanan.push({ nama, harga: parseInt(harga, 10), qty });
        }
        renderTabelPesanan();

        // Animasi halus pada Floating Cart
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart) {
            floatingCart.style.transform = 'scale(1.08)';
            setTimeout(() => { floatingCart.style.transform = 'scale(1)'; }, 200);
        }
    }

    // Tombol "+ Pesan" pada kartu produk dengan visual feedback instan
    document.querySelectorAll('.btn-tambah').forEach(btn => {
        btn.addEventListener('click', function () {
            const nama = this.getAttribute('data-nama');
            const harga = this.getAttribute('data-harga');
            tambahItem(nama, harga, 1);

            // Feedback visual pada tombol
            const teksAsli = this.textContent;
            this.classList.add('sukses-tambah');
            this.textContent = '✓ Masuk Keranjang';
            setTimeout(() => {
                this.classList.remove('sukses-tambah');
                this.textContent = teksAsli;
            }, 750);
        });
    });

    // Input manual dari dropdown customer
    const btnTambahManual = document.getElementById('btnTambahManual');
    if (btnTambahManual) {
        btnTambahManual.addEventListener('click', function () {
            const select = document.getElementById('pilihMenuManual');
            const qtyInput = document.getElementById('qtyManual');
            const val = select ? select.value : '';
            const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;

            if (!val) {
                alert('Silakan pilih menu terlebih dahulu!');
                return;
            }

            const [nama, harga] = val.split('|');
            tambahItem(nama, parseInt(harga, 10), qty);
            if (qtyInput) qtyInput.value = 1;
        });
    }

    // Pilihan Metode Bayar Interaktif (QRIS, Tunai, Kartu Debit)
    const radioMetode = document.querySelectorAll('input[name="metodeBayar"]');
    const previewIcon = document.getElementById('previewBayarIcon');
    const previewJudul = document.getElementById('previewBayarJudul');
    const previewPesan = document.getElementById('previewBayarPesan');

    function updateMetodePreview(metode) {
        if (!previewJudul || !previewPesan) return;

        if (metode === 'QRIS') {
            if (previewIcon) previewIcon.textContent = '📱';
            previewJudul.textContent = 'Pembayaran Instan QRIS';
            previewPesan.textContent = 'Scan kode QRIS yang tersedia di layar kasir menggunakan aplikasi GoPay, OVO, Dana, BCA Mobile, ShopeePay, atau m-Banking Anda.';
        } else if (metode === 'Tunai') {
            if (previewIcon) previewIcon.textContent = '💵';
            previewJudul.textContent = 'Pembayaran Tunai (Cash)';
            previewPesan.textContent = 'Siapkan uang pas sesuai total tagihan dan bayar langsung di meja kasir Kopi Senja saat mengambil pesanan Anda.';
        } else if (metode === 'Kartu Debit') {
            if (previewIcon) previewIcon.textContent = '💳';
            previewJudul.textContent = 'Pembayaran Kartu Debit / EDC';
            previewPesan.textContent = 'Silakan gesek atau tap kartu debit chip Anda (BCA, Mandiri, BRI, BNI) di mesin EDC meja kasir Kopi Senja.';
        }
    }

    radioMetode.forEach(radio => {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.metode-chip').forEach(c => c.classList.remove('aktif'));
            this.closest('.metode-chip').classList.add('aktif');
            updateMetodePreview(this.value);
        });
    });

    // Inisialisasi awal preview metode
    const radioAwal = document.querySelector('input[name="metodeBayar"]:checked');
    if (radioAwal) updateMetodePreview(radioAwal.value);

    // Variabel penyimpan data pesanan terakhir untuk simulasi barista
    let pesananTerakhir = {
        noPesanan: '#KS-8821',
        nama: 'Pelanggan Senja',
        meja: 'Meja 01'
    };

    // PROSES & STRUK PEMBAYARAN
    const modalBackdrop = document.getElementById('modalStrukBackdrop');
    const btnProses = document.getElementById('btnProsesPesanan');

    if (btnProses && modalBackdrop) {
        btnProses.addEventListener('click', function () {
            if (daftarPesanan.length === 0) {
                alert('Keranjang pesanan masih kosong! Silakan klik tombol + Pesan pada menu favoritmu terlebih dahulu.');
                return;
            }

            const namaInput = document.getElementById('namaCustomer');
            const nama = (namaInput && namaInput.value.trim()) ? namaInput.value.trim() : 'Pelanggan Senja';
            const mejaInput = document.getElementById('nomorMeja');
            const meja = mejaInput ? mejaInput.value : 'Meja 01';
            const catatanInput = document.getElementById('catatanCustomer');
            const catatan = (catatanInput && catatanInput.value.trim()) ? catatanInput.value.trim() : '';
            const radioTerpilih = document.querySelector('input[name="metodeBayar"]:checked');
            const metode = radioTerpilih ? radioTerpilih.value : 'QRIS';
            const { totalNominal } = hitungTotal();

            // Generate Nomor Struk
            const noPesanan = '#KS-' + Math.floor(1000 + Math.random() * 9000);
            const sekarang = new Date();
            const waktuStr = sekarang.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' +
                             sekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

            // Isi data struk
            const tglEl = document.getElementById('strukTanggalJam');
            const noPesananEl = document.getElementById('strukNoPesanan');
            const namaEl = document.getElementById('strukNama');
            const mejaEl = document.getElementById('strukMeja');
            const catatanRow = document.getElementById('strukCatatanRow');
            const catatanEl = document.getElementById('strukCatatan');

            if (tglEl) tglEl.textContent = waktuStr;
            if (noPesananEl) noPesananEl.textContent = noPesanan;
            if (namaEl) namaEl.textContent = nama;
            if (mejaEl) mejaEl.textContent = meja;

            if (catatanRow && catatanEl) {
                if (catatan) {
                    catatanRow.style.display = 'flex';
                    catatanEl.textContent = catatan;
                } else {
                    catatanRow.style.display = 'none';
                }
            }

            // Render tabel item struk
            const strukTable = document.getElementById('strukTableItems');
            if (strukTable) {
                strukTable.innerHTML = '';
                daftarPesanan.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.nama} &times; ${item.qty}</td>
                        <td class="text-right"><strong>${formatRupiah(item.harga * item.qty)}</strong></td>
                    `;
                    strukTable.appendChild(row);
                });
            }

            const totalBayarEl = document.getElementById('strukTotalBayar');
            const metodeEl = document.getElementById('strukMetode');
            const instruksiEl = document.getElementById('strukInstruksi');
            const qrBoxEl = document.getElementById('strukQrBox');

            if (totalBayarEl) totalBayarEl.textContent = formatRupiah(totalNominal);
            if (metodeEl) metodeEl.textContent = metode;

            if (instruksiEl) {
                if (metode === 'QRIS') {
                    instruksiEl.textContent = 'Silakan scan kode QRIS di bawah ini dengan m-Banking atau e-Wallet (BCA, GoPay, OVO, Dana).';
                    if (qrBoxEl) {
                        qrBoxEl.style.display = 'flex';
                        qrBoxEl.innerHTML = generateQrisSvg();
                    }
                } else if (metode === 'Tunai') {
                    instruksiEl.textContent = 'Silakan siapkan uang pas sebesar ' + formatRupiah(totalNominal) + ' dan bayar langsung di meja kasir.';
                    if (qrBoxEl) {
                        qrBoxEl.style.display = 'none';
                        qrBoxEl.innerHTML = '';
                    }
                } else if (metode === 'Kartu Debit') {
                    instruksiEl.textContent = 'Silakan serahkan / tap kartu debit chip Anda (BCA, Mandiri, BRI, BNI) di mesin EDC meja kasir.';
                    if (qrBoxEl) {
                        qrBoxEl.style.display = 'none';
                        qrBoxEl.innerHTML = '';
                    }
                }
            }

            // Simpan data untuk notifikasi barista
            pesananTerakhir = { noPesanan, nama, meja };

            // Buka modal struk
            modalBackdrop.classList.add('tampil');
        });
    }

    // Suara Notifikasi Web Audio API
    function mainkanSuaraNotifikasi() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(587.33, now); // D5
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.5);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now + 0.18); // A5
            gain2.gain.setValueAtTime(0.35, now + 0.18);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.18);
            osc2.stop(now + 0.9);
        } catch (e) {
            console.log('Audio chime info:', e);
        }
    }

    // Simulasi Barista Seduh (8-10 Detik)
    let timerInterval = null;

    function mulaiSimulasiBarista(infoPesanan) {
        const notifBox = document.getElementById('notifPesananBox');
        const notifIcon = document.getElementById('notifIcon');
        const notifJudul = document.getElementById('notifJudul');
        const notifPesan = document.getElementById('notifPesan');
        const progressBar = document.getElementById('notifProgressBar');
        const timerTextWrap = document.getElementById('notifTimerText');
        const countdownEl = document.getElementById('notifCountdown');
        const btnTutupNotif = document.getElementById('btnTutupNotif');

        if (!notifBox || !progressBar || !countdownEl) return;

        if (timerInterval) clearInterval(timerInterval);

        notifBox.className = 'notif-pesanan-box sedang-proses';
        notifBox.style.display = 'block';
        if (notifIcon) notifIcon.textContent = '☕⏳';
        if (notifJudul) notifJudul.textContent = 'Barista Sedang Meracik...';
        if (notifPesan) notifPesan.innerHTML = `Pesanan <strong>${infoPesanan.noPesanan}</strong> untuk <strong>${infoPesanan.nama}</strong> (${infoPesanan.meja}) sedang diseduh dengan cermat.`;
        if (timerTextWrap) timerTextWrap.style.display = 'flex';
        if (btnTutupNotif) btnTutupNotif.style.display = 'none';

        const totalWaktuDetik = 10;
        let waktuTersisa = totalWaktuDetik;
        let progressPercent = 0;

        progressBar.style.width = '0%';
        countdownEl.textContent = totalWaktuDetik + ' detik';

        const intervalMs = 100;
        const stepPercent = (intervalMs / (totalWaktuDetik * 1000)) * 100;

        timerInterval = setInterval(function () {
            waktuTersisa -= (intervalMs / 1000);
            progressPercent += stepPercent;

            if (progressPercent > 100) progressPercent = 100;
            progressBar.style.width = progressPercent + '%';

            if (waktuTersisa > 0) {
                countdownEl.textContent = Math.ceil(waktuTersisa) + ' detik';
            } else {
                clearInterval(timerInterval);
                timerInterval = null;

                mainkanSuaraNotifikasi();

                notifBox.className = 'notif-pesanan-box selesai';
                if (notifIcon) notifIcon.textContent = '🔔✨';
                if (notifJudul) notifJudul.textContent = 'Pesanan Selesai! 🎉';
                if (notifPesan) notifPesan.innerHTML = `Pesanan <strong>${infoPesanan.noPesanan}</strong> atas nama <strong>${infoPesanan.nama}</strong> (${infoPesanan.meja}) sudah selesai diseduh dan siap diambil di meja bar/kasir. Selamat menikmati!`;
                if (timerTextWrap) timerTextWrap.style.display = 'none';
                if (btnTutupNotif) {
                    btnTutupNotif.style.display = 'block';
                    btnTutupNotif.onclick = function () {
                        notifBox.style.display = 'none';
                    };
                }
            }
        }, intervalMs);
    }

    // Tombol Tutup Modal Struk
    const btnTutupModal = document.getElementById('btnTutupModal');
    if (btnTutupModal && modalBackdrop) {
        btnTutupModal.addEventListener('click', function () {
            modalBackdrop.classList.remove('tampil');

            const infoSaatIni = { ...pesananTerakhir };

            // Reset keranjang
            daftarPesanan = [];
            const namaInput = document.getElementById('namaCustomer');
            const catatanInput = document.getElementById('catatanCustomer');
            if (namaInput) namaInput.value = '';
            if (catatanInput) catatanInput.value = '';
            renderTabelPesanan();

            mulaiSimulasiBarista(infoSaatIni);
        });
    }

    // Klik di luar area struk
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function (e) {
            if (e.target === modalBackdrop) {
                modalBackdrop.classList.remove('tampil');
            }
        });
    }

    // Render awal keranjang
    renderTabelPesanan();
}

/* ==========================================================================
   3. TAB FILTER CERITA AKSESIBEL (tentang.html)
   ========================================================================== */
function initTentangTabs() {
    const tabList = document.querySelector('.tentang-kategori-tabs');
    const tabs = document.querySelectorAll('.tab-tentang-btn');
    const sections = document.querySelectorAll('.section-cerita');

    if (tabs.length === 0 || sections.length === 0) return;

    if (tabList) {
        tabList.setAttribute('role', 'tablist');
        tabList.setAttribute('aria-label', 'Kategori Cerita Kopi Senja');
    }

    tabs.forEach(tab => {
        const kat = tab.getAttribute('data-kategori');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('id', `tab-${kat}`);
        if (kat === 'semua') {
            tab.removeAttribute('aria-controls');
        } else {
            tab.setAttribute('aria-controls', kat);
        }
        tab.setAttribute('aria-selected', tab.classList.contains('aktif') ? 'true' : 'false');
    });

    sections.forEach(sec => {
        const kat = sec.getAttribute('data-kategori');
        sec.setAttribute('role', 'tabpanel');
        sec.setAttribute('id', kat);
        sec.setAttribute('aria-labelledby', `tab-${kat}`);
    });

    function terapkanKategori(kategoriTerpilih) {
        tabs.forEach(btn => {
            const match = btn.getAttribute('data-kategori') === kategoriTerpilih;
            if (match) {
                btn.classList.add('aktif');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('aktif');
                btn.setAttribute('aria-selected', 'false');
            }
        });

        sections.forEach(sec => {
            const kategoriSec = sec.getAttribute('data-kategori');
            if (kategoriTerpilih === 'semua' || kategoriSec === kategoriTerpilih) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
        });
    }

    tabs.forEach(btn => {
        btn.addEventListener('click', function () {
            const kategori = this.getAttribute('data-kategori');
            terapkanKategori(kategori);

            const url = new URL(window.location);
            if (kategori === 'semua') {
                url.searchParams.delete('kategori');
            } else {
                url.searchParams.set('kategori', kategori);
            }
            window.history.replaceState({}, '', url);
        });
    });

    const params = new URLSearchParams(window.location.search);
    const kategoriAwal = params.get('kategori');
    if (kategoriAwal && document.querySelector(`.tab-tentang-btn[data-kategori="${kategoriAwal}"]`)) {
        terapkanKategori(kategoriAwal);
    }
}

/* ==========================================================================
   4. FORMULIR KONTAK & FEEDBACK RAMAH (kontak.html)
   ========================================================================== */
function initKontakForm() {
    const formKontak = document.getElementById('formKontak');
    const feedbackBox = document.getElementById('formFeedback');

    if (!formKontak) return;

    // Jika form diarahkan ke terima-kasih.html (Metode GET standar UTS), biarkan submit alami ke halaman terima-kasih.html
    if (formKontak.getAttribute('action') === 'terima-kasih.html') {
        return;
    }

    formKontak.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputNama = document.getElementById('nama');
        const nama = (inputNama && inputNama.value.trim()) ? inputNama.value.trim() : 'Kawan Senja';

        if (feedbackBox) {
            feedbackBox.innerHTML = `
                <div class="feedback-sukses">
                    <strong>✓ Matur Nuwun, ${nama}!</strong><br>
                    Pesanmu sudah kami terima. Barista Kopi Senja Surabaya akan membalas ceritamu lewat email sesegera mungkin.
                </div>
            `;
            feedbackBox.style.display = 'block';
            feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert(`Matur nuwun, ${nama}! Pesanmu telah diterima oleh barista Kopi Senja.`);
        }

        formKontak.reset();
    });
}

/* ==========================================================================
   5. AKSESIBILITAS KEYBOARD: ESCAPE KEY CLOSER
   ========================================================================== */
function initEscapeKeyListener() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const modalBackdrop = document.getElementById('modalStrukBackdrop');
            if (modalBackdrop && modalBackdrop.classList.contains('tampil')) {
                modalBackdrop.classList.remove('tampil');
            }
        }
    });
}

/* ==========================================================================
   6. INTERAKSI HERO GAYA TUKU: BARISTA BERGERAK (MEJA & LATAR DIAM)
   - Karakter barista kartun hidup & berjalan di sepanjang meja bar
   - Mengikuti kursor mouse secara cerdas dengan animasi langkah kaki (bobbing & tilt)
   - Balik hadap arah (flip scaleX) saat melangkah ke kiri atau ke kanan
   - Teks balon sapaan berganti otomatis sesuai stasiun kerja (kudapan, kasir, espresso)
   - Mode Patroli Santai: barista berjalan otomatis antar-stasiun saat kursor diam
   - Latar belakang & meja depan TETAP DIAM (tanpa pergeseran)
   - 0 style inline massal pada elemen lain, tidak ada selector #id
   - Mendukung beranda (index.html) dan katalog menu (menu.html)
   ========================================================================== */
function initHeroParallaxTuku() {
    const heroSections = document.querySelectorAll('.hero-parallax-section, .hero-berlapis');
    if (!heroSections || heroSections.length === 0) return;

    // Matikan animasi jika pengguna mengaktifkan prefers-reduced-motion
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (kurangiGerak) return;

    heroSections.forEach(function (heroSection) {
        const baristaEl = heroSection.querySelector('.barista-interaktif');
        const avatarEl = heroSection.querySelector('.barista-avatar');
        const balonEl = heroSection.querySelector('.barista-speech-bubble');
        if (!baristaEl) return;

        // Variabel posisi & pergerakan barista di balik meja
        const POSISI_AWAL_PERSEN = 33; // Posisi default di meja tengah
        let targetBaristaPersen = POSISI_AWAL_PERSEN;
        let currentBaristaPersen = POSISI_AWAL_PERSEN;
        let animPhase = 0;
        let currentIntensity = 0; // 0 = idle santai, 1 = melangkah aktif
        let facing = 1; // 1 = hadap kiri/normal, -1 = hadap kanan
        let userSedangInteraksi = false;
        let timerIdle = null;
        let timerPatroli = null;
        const stasiunPatroli = [20, 33, 52, 75, 48, 26]; // Area kerja: etalase toast (kiri), meja bar (tengah), mesin espresso & meja pick-up (kanan)
        let indexPatroli = 0;
        let rafId = null;
        let lastTime = 0;
        let teksBalonAktif = '';

        // Pembaruan teks balon sapaan berdasarkan stasiun posisi barista (dengan caching agar anti-flicker)
        function updateTeksBalon(persen) {
            if (!balonEl) return;
            let teksBaru = '';
            if (persen < 26) {
                // Sisi Kiri: Etalase Toast & Kudapan (dekat tanda Pesan Di Sini)
                teksBaru = 'Toast &amp; Kudapan hangat! &#129360;';
            } else if (persen > 62) {
                // Sisi Kanan Ujung: Meja Pick-up & Tanaman
                teksBaru = 'Pesanan siap di meja pick-up! &#9749;';
            } else if (persen > 38) {
                // Tengah Kanan: Grinder & Mesin Espresso
                teksBaru = 'Sedang meracik Kopi Susu Aren... &#10024;';
            } else {
                // Tengah: Meja Bar Depan & Menyapa Kawan Senja
                teksBaru = 'Halo Kawan Senja! &#9749;';
            }

            if (teksBaru !== teksBalonAktif) {
                teksBalonAktif = teksBaru;
                balonEl.innerHTML = teksBaru;
            }
        }

        // Loop animasi requestAnimationFrame super halus (Frame-Rate Independent dengan Delta Time)
        function renderLoop(timestamp) {
            if (!lastTime) lastTime = timestamp || performance.now();
            const now = timestamp || performance.now();
            const dt = Math.min((now - lastTime) / 1000, 0.05); // Cap dt di 50ms untuk cegah lompatan frame
            lastTime = now;

            // Interpolasi posisi horizontal berbasis eksponensial (buttery smooth damping)
            const damping = 1 - Math.exp(-5.5 * dt);
            currentBaristaPersen += (targetBaristaPersen - currentBaristaPersen) * damping;

            const deltaX = targetBaristaPersen - currentBaristaPersen;
            const speed = Math.abs(deltaX);

            // Arah hadap barista (flip halus via CSS transition dengan batas threshold anti-jitter)
            if (deltaX > 0.4) {
                facing = -1; // Berjalan ke kanan
            } else if (deltaX < -0.4) {
                facing = 1;  // Berjalan ke kiri
            }

            // Transisi intensitas langkah kaki secara bertahap (bebas sentakan saat mulai/berhenti)
            const targetIntensity = Math.min(1, Math.max(0, (speed - 0.03) / 0.28));
            currentIntensity += (targetIntensity - currentIntensity) * Math.min(1, 9.0 * dt);

            // Frekuensi langkah beradaptasi lembut: cepat saat berjalan brisk, lembut saat bernafas santai
            const strideSpeed = 7.5 * currentIntensity + 2.0 * (1 - currentIntensity);
            animPhase += strideSpeed * dt;

            // Ayunan langkah kaki organik:
            // - Saat melangkah: bobbing langkah kaki naik-turun berkala
            // - Saat berhenti: nafas halus tanpa lompatan fase
            const walkBob = Math.abs(Math.sin(animPhase)) * -6.5 * currentIntensity;
            const idleBob = Math.sin(animPhase) * 2.2 * (1 - currentIntensity);
            const bobY = walkBob + idleBob;

            // Kemiringan langkah kaki alami yang melemah perlahan saat melambat
            const tilt = Math.sin(animPhase) * 2.4 * currentIntensity * facing;

            updateTeksBalon(currentBaristaPersen);

            // Terapkan flip arah hanya pada avatar (dengan CSS transition halus)
            if (avatarEl) {
                avatarEl.style.transform = 'scaleX(' + facing + ')';
            }

            // Terapkan translasi subpixel hardware-accelerated (GPU direct compositing)
            baristaEl.style.left = currentBaristaPersen.toFixed(3) + '%';
            baristaEl.style.transform = 'translate3d(0, ' + bobY.toFixed(2) + 'px, 0) rotate(' + tilt.toFixed(2) + 'deg)';

            // Selalu lanjutkan loop jika ada pergerakan atau dalam mode standby
            if (speed > 0.02 || currentIntensity > 0.02 || !userSedangInteraksi) {
                rafId = requestAnimationFrame(renderLoop);
            } else {
                rafId = null;
                lastTime = 0;
            }
        }

        function startLoop() {
            if (!rafId) {
                lastTime = 0;
                rafId = requestAnimationFrame(renderLoop);
            }
        }

        // Mode Patroli Mandiri: barista berjalan otomatis antar-stasiun saat kursor diam
        function jadwalPatroli() {
            if (timerPatroli) clearInterval(timerPatroli);
            timerPatroli = setInterval(function () {
                if (!userSedangInteraksi) {
                    indexPatroli = (indexPatroli + 1) % stasiunPatroli.length;
                    targetBaristaPersen = stasiunPatroli[indexPatroli];
                    startLoop();
                }
            }, 4000);
        }
        jadwalPatroli();

        // Event pergerakan kursor mouse di area hero (dibatasi dalam koridor area kerja barista)
        heroSection.addEventListener('mousemove', function (e) {
            userSedangInteraksi = true;
            clearTimeout(timerIdle);

            const rect = heroSection.getBoundingClientRect();
            const mousePercent = ((e.clientX - rect.left) / rect.width) * 100;
            // Batasi gerak barista: berhenti di samping etalase roti (min 20%) agar tidak tenggelam di balik etalase, dan bisa sampai ujung kanan meja seduh (max 82%)
            targetBaristaPersen = Math.max(20, Math.min(82, mousePercent));

            startLoop();

            timerIdle = setTimeout(function () {
                userSedangInteraksi = false;
            }, 3000);
        });

        // Sentuhan layar HP / tablet (dukungan touch event)
        heroSection.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches.length > 0) {
                userSedangInteraksi = true;
                clearTimeout(timerIdle);
                const rect = heroSection.getBoundingClientRect();
                const touchPercent = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                targetBaristaPersen = Math.max(20, Math.min(82, touchPercent));
                startLoop();
                timerIdle = setTimeout(function () {
                    userSedangInteraksi = false;
                }, 3000);
            }
        }, { passive: true });

        // Saat kursor meninggalkan hero: kembali ke mode santai / patroli
        heroSection.addEventListener('mouseleave', function () {
            userSedangInteraksi = false;
            startLoop();
        });

        // Interaksi klik / tap pada barista
        baristaEl.addEventListener('click', function () {
            if (balonEl) {
                balonEl.innerHTML = 'Semangat hari ini, Kawan! &#10024;&#9749;';
                balonEl.style.transform = 'translateX(-50%) scale(1.15)';
                setTimeout(function () {
                    balonEl.style.transform = 'translateX(-50%) scale(1)';
                }, 400);
            }
        });

        // Aksesibilitas keyboard (Enter / Spasi)
        baristaEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                baristaEl.click();
            }
        });

        // Jalankan animasi saat halaman dimuat
        renderLoop();
    });
}


/* Pilih tema terang/gelap, ingat pilihan antarhalaman dan kunjungan. */
function initThemeToggle() {
    const roots = document.querySelectorAll('[data-theme-toggle-root]');
    if (!roots.length || !window.React || !window.ReactDOM) return;

    let theme = 'light';
    try {
        theme = localStorage.getItem('kopi-senja-theme') || 'light';
    } catch (error) {
        // Tetap izinkan pergantian tema saat penyimpanan browser tidak tersedia.
    }

    function applyTheme(value, button) {
        theme = value === 'dark' ? 'dark' : 'light';
        const update = () => { document.documentElement.dataset.theme = theme; };
        if (document.startViewTransition && button) {
            const rect = button.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
            document.documentElement.style.setProperty('--theme-x', `${x}px`);
            document.documentElement.style.setProperty('--theme-y', `${y}px`);
            document.documentElement.style.setProperty('--theme-radius', `${radius}px`);
            document.startViewTransition(update);
        } else { update(); }
        try { localStorage.setItem('kopi-senja-theme', theme); } catch (error) { /* Penyimpanan opsional. */ }
    }

    const h = window.React.createElement;
    function ThemeToggle() {
        const [dark, setDark] = window.React.useState(theme === 'dark');
        function toggle(event) {
            const nextDark = !dark;
            applyTheme(nextDark ? 'dark' : 'light', event.currentTarget);
            setDark(nextDark);
        }
        const svgMoon = h('svg', {
            xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24',
            width: '14', height: '14', fill: 'currentColor', 'aria-hidden': 'true'
        }, h('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }));

        const svgSun = h('svg', {
            xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24',
            width: '14', height: '14', fill: 'none', stroke: 'currentColor',
            strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true'
        },
            h('circle', { cx: '12', cy: '12', r: '5' }),
            h('line', { x1: '12', y1: '1', x2: '12', y2: '3' }),
            h('line', { x1: '12', y1: '21', x2: '12', y2: '23' }),
            h('line', { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' }),
            h('line', { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' }),
            h('line', { x1: '1', y1: '12', x2: '3', y2: '12' }),
            h('line', { x1: '21', y1: '12', x2: '23', y2: '12' }),
            h('line', { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' }),
            h('line', { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' })
        );

        return h('button', {
            className: 'theme-switch', type: 'button', role: 'switch',
            'aria-checked': String(dark),
            'aria-label': dark ? 'Tema gelap aktif; alihkan ke cerah' : 'Tema cerah aktif; alihkan ke gelap',
            onClick: toggle
        },
            h('span', { className: 'theme-switch-thumb', 'aria-hidden': 'true' },
                dark ? svgMoon : svgSun
            )
        );
    }
    roots.forEach(root => window.ReactDOM.createRoot(root).render(h(ThemeToggle)));
}
