# FN STUDIO — Website Toko Online Demo

## Struktur
- `index.html` — struktur halaman
- `css/style.css` — desain, animasi, responsif
- `js/script.js` — produk, pencarian, kategori, favorit, keranjang, checkout WhatsApp
- `images/` — tempat menyimpan gambar produk sendiri (opsional)

## Menjalankan di laptop
1. Ekstrak ZIP.
2. Buka folder `fn_studio_toko_online` di VS Code.
3. Buka `index.html` dengan Live Server, atau klik dua kali file `index.html`.
4. Pastikan koneksi internet aktif untuk memuat gambar contoh dari Unsplash.

## Pengaturan WhatsApp
Buka `js/script.js`, cari:
`const WHATSAPP_NUMBER = "6281234567890";`
Ganti dengan nomor WhatsApp tokomu, format internasional tanpa tanda `+`, spasi, atau tanda hubung. Contoh: `6281234567890`.
Nomor contoh sengaja dipakai sebagai placeholder; tombol pemesanan akan meminta nomor toko diganti sampai kamu mengaturnya.

## Mengubah produk
Di bagian paling atas `js/script.js`, edit array `products`. Setiap produk punya `id`, `name`, `code`, `category`, `price`, `image`, dan `description`.
Gunakan kategori: `Stempel`, `Sablon Pakaian`, `Cetak Custom`, atau `Aksesori`.
Gambar bisa menggunakan URL HTTPS atau file sendiri. Untuk file sendiri, misalnya simpan gambar sebagai `images/kaos.jpg`, lalu ubah nilai `image` menjadi `"images/kaos.jpg"`.

## Catatan penting
Ini adalah demo front-end. Keranjang dan favorit disimpan di localStorage browser. Login, stok real-time, pembayaran, admin panel, dan database belum terhubung. Jangan menerima pembayaran hanya berdasarkan tampilan demo; verifikasi pesanan dan pembayaran secara manual.
