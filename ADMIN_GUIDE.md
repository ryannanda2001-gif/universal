# 📊 Admin Dashboard - Panduan Penggunaan

## Akses Admin Dashboard

Ketik URL berikut di browser Anda:
```
http://localhost:3000/admin
```

atau jika sudah production:
```
https://yourdomain.com/admin
```

---

## Fitur-Fitur Admin

### 1. **Tambah Produk Baru**
- Klik tombol **"Tambah Produk Baru"** (tombol hijau)
- Isi form dengan data produk:
  - **Nama Produk**: Nama lengkap produk
  - **Harga**: Format bebas (contoh: Rp 2.5jt, Rp 1.500.000)
  - **Kategori**: Pilih dari dropdown (Laptop, PC, Printer, Storage, RAM & CPU, Aksesoris)
  - **Foto Produk**: Upload gambar produk (JPG, PNG, dll)
  - **Deskripsi**: Penjelasan detail tentang produk
- Klik **"Simpan Produk"**

### 2. **Edit Produk**
- Cari produk di tabel daftar produk
- Klik tombol **"Edit"** (warna biru)
- Ubah data yang ingin diubah
- Klik **"Update Produk"** untuk menyimpan

### 3. **Hapus Produk**
- Cari produk di tabel daftar produk
- Klik tombol **"Hapus"** (warna merah)
- Konfirmasi penghapusan

### 4. **Lihat Produk di Website**
- Produk akan otomatis muncul di halaman homepage (`/`)
- Pengunjung dapat memfilter produk berdasarkan kategori
- Mereka bisa langsung menghubungi Anda via WhatsApp

---

## Struktur Data Produk

Setiap produk menyimpan data berikut:

```javascript
{
  id: 1234567890,                    // ID unik (auto-generated)
  name: "Laptop HP Pavilion",        // Nama produk
  price: "Rp 2.5jt",                 // Harga
  category: "Laptop",                // Kategori
  description: "Laptop berkualitas dari brand terpercaya",
  image: "data:image/jpeg;base64..." // Gambar (format base64)
}
```

---

## 💾 Penyimpanan Data

- Semua data produk disimpan di **localStorage** browser
- Data akan tersimpan permanen hingga Anda menghapus browser cache
- **Untuk production**, Anda bisa ubah ke database (MongoDB, PostgreSQL, dll)

---

## 🎨 Kategori Yang Tersedia

| Kategori | Contoh Produk |
|----------|---------------|
| **Laptop** | Laptop Second, Gaming Laptop |
| **PC** | PC Rakitan, Gaming PC |
| **Printer** | Printer Inkjet, Thermal Printer |
| **Storage** | SSD, HDD, USB Drive |
| **RAM & CPU** | Ram DDR4, Processor Intel |
| **Aksesoris** | Mouse, Keyboard, Monitor |

---

## 🎯 Tips Penggunaan

1. **Nama Produk**: Buat nama yang deskriptif dan menarik
2. **Harga**: Tulis sesuai format yang biasa Anda gunakan
3. **Foto**: Gunakan foto berkualitas tinggi, background clean
4. **Deskripsi**: Jelaskan spesifikasi dan keunggulan produk
5. **Kategori**: Pilih kategori yang paling sesuai untuk kemudahan pencarian

---

## 📱 Integrasi WhatsApp

Ketika pengunjung klik "Chat via WhatsApp", mereka akan:
1. Diarahkan ke WhatsApp dengan chat bubble otomatis
2. Pesan otomatis berisi: nama produk + harga
3. Nomor WhatsApp: **0812 8968 9799**

Anda bisa ubah nomor ini di file `app/page.tsx` (cari `wa.me/6281289689799`)

---

## 🔧 Customization (Opsional)

### Menambah Kategori Baru
Edit file `app/admin/page.tsx` dan `app/page.tsx`, cari array `categories`:

```javascript
const categories = ['Laptop', 'PC', 'Printer', 'Storage', 'RAM & CPU', 'Aksesoris', 'KATEGORI_BARU'];
```

### Mengubah Nomor WhatsApp
Di file `app/page.tsx`, cari:
```
wa.me/6281289689799
```
Ubah dengan nomor WhatsApp Anda.

---

## ⚠️ Catatan Penting

- Admin page **TIDAK** dilindungi password saat ini
- Untuk production, tambahkan authentication/login
- Data disimpan di browser lokal, bukan cloud
- Jika clear browser cache, semua data akan hilang

---

## 📧 Bantuan Lebih Lanjut

Jika ada pertanyaan atau ingin menambah fitur lebih lanjut, silakan hubungi developer.

---

**Happy Selling! 🚀**
