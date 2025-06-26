# Community Connection System

## Overview
Sistem ini menghubungkan halaman Homepage dengan halaman Community agar ketika komunitas baru ditambahkan, akan otomatis muncul di homepage.

## File yang Dimodifikasi

### 1. `communityData.js` (File Baru)
- **Fungsi**: Mengelola data komunitas secara terpusat
- **Fitur**:
  - Mengelola data komunitas default dan yang baru dibuat
  - Menyimpan data di localStorage
  - Mengelola status join/leave dan favorite komunitas
  - Mengurutkan komunitas berdasarkan prioritas (joined first, member count, date created)
  - Memicu event ketika komunitas baru ditambahkan

### 2. `Homepage.html` (Dimodifikasi)
- **Perubahan**:
  - Menambahkan script `communityData.js`
  - Mengganti kartu komunitas statis dengan loading dinamis
  - Menambahkan horizontal scroll dengan navigation arrows
  - Menambahkan tombol "Buat Komunitas" untuk navigasi cepat
  - Menambahkan event listener untuk update otomatis
  - Menambahkan animasi untuk komunitas baru
  - **FIXED**: Memperbaiki masalah interaksi tombol dengan CSS dan event handling yang lebih baik

### 3. `Community.html` (Dimodifikasi)
- **Perubahan**:
  - Menambahkan script `communityData.js`
  - Mengintegrasikan form pembuatan komunitas dengan CommunityManager
  - Menambahkan notifikasi success ketika komunitas dibuat

## Cara Kerja

### 1. **Inisialisasi**
Saat Homepage.html dimuat:
- `communityData.js` diload dan membuat instance `CommunityManager`
- Data komunitas default diinisialisasi jika belum ada
- Top 5 komunitas ditampilkan berdasarkan prioritas

### 2. **Pembuatan Komunitas Baru**
Saat user membuat komunitas di Community.html:
- Form data dikirim ke `CommunityManager.addCommunity()`
- Data disimpan ke localStorage
- Event `communityAdded` dipicu
- Homepage.html mendengarkan event dan update tampilan

### 3. **Prioritas Tampilan**
Komunitas ditampilkan dengan urutan:
1. Komunitas yang sudah di-join user
2. Berdasarkan jumlah member
3. Berdasarkan tanggal pembuatan (terbaru)
4. **UPDATE**: Sekarang menampilkan semua komunitas dengan horizontal scroll (tidak terbatas pada 5)

### 4. **Interaksi User**
- **Tombol Love (⭐)**: Toggle favorite komunitas
- **Tombol Join (+/✓)**: Join/leave komunitas
- **Data tersimpan**: Semua preferensi user tersimpan di localStorage

## Fitur Tambahan

### 1. **Visual Feedback**
- Animasi slide-in untuk komunitas baru
- Hover effects pada kartu komunitas
- Border highlight untuk komunitas baru
- **NEW**: Horizontal scroll dengan custom scrollbar
- **NEW**: Navigation arrows untuk mudah scroll
- **FIXED**: Tombol interaktif dengan proper hover dan active states

### 2. **Navigasi Mudah**
- Tombol "Buat Komunitas" di homepage
- Back button di halaman Community
- **NEW**: Scroll arrows untuk navigasi horizontal
- **NEW**: Auto-scroll ke komunitas baru

### 3. **Data Persistence**
- Semua data tersimpan di localStorage
- Tetap tersimpan setelah refresh browser
- **NEW**: Posisi scroll tersimpan dan dipulihkan
- **NEW**: Counter jumlah komunitas real-time

## Struktur Data

```javascript
// localStorage keys:
{
  "allCommunities": {
    "community_key": {
      "name": "Nama Komunitas",
      "description": "Deskripsi",
      "image": "URL gambar",
      "events": ["event1", "event2"],
      "members": [{"name": "user", "avatar": "url"}],
      "isDefault": false,
      "dateCreated": "ISO date string"
    }
  },
  "joinedCommunities": ["community_key1", "community_key2"],
  "favoriteCommunities": ["community_key1"],
  "customCommunityLogos": {"community_key": "logo_url"}
}
```

## Testing

Untuk menguji sistem:
1. Buka `Homepage.html`
2. Lihat semua komunitas yang tampil dalam horizontal scroll
3. **TEST**: Klik tombol Love (⭐) dan Join (+) - seharusnya sekarang berfungsi dengan baik
4. Klik "Buat Komunitas" untuk ke halaman Community
5. Buat komunitas baru dengan mengisi form
6. Kembali ke Homepage - komunitas baru akan muncul di posisi atas
7. Test scroll horizontal dan navigation arrows
8. Test bahwa posisi scroll tersimpan setelah refresh

## Troubleshooting

### Masalah Icon Tidak Interaktif (SOLVED):
- **Penyebab**: CSS button tidak memiliki styling yang cukup + event propagation issues
- **Solusi**: 
  - Menambahkan proper button styling dengan hover/active states
  - Menambahkan `pointer-events: none` pada icon dan text
  - Menambahkan debug logging untuk troubleshooting
  - Memperbaiki event handling dengan visual feedback

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Internet Explorer: ❌ Not supported (ES6+ features)
