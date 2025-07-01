# Dokumentasi Komponen Pages

## 1. Home.jsx

### Deskripsi

Komponen Home berfungsi sebagai landing page aplikasi yang menampilkan gambaran umum tentang fitur aplikasi berita dan call-to-action untuk memulai eksplorasi.

### Struktur Komponen

- **Hero Section**: Menampilkan judul utama, deskripsi singkat, dan tombol call-to-action.
- **Features Section**: Menampilkan fitur-fitur utama aplikasi dengan ikon.
- **How It Works Section**: Menjelaskan cara penggunaan aplikasi dalam langkah-langkah sederhana.
- **CTA Section**: Call-to-action tambahan di bagian bawah halaman.

### Library dan Dependencies

- `React`: Library JavaScript untuk membangun antarmuka pengguna.
- `react-router-dom`: Untuk navigasi antar halaman (`Link`).
- `react-icons`: Menyediakan ikon seperti `FaSearch`, `FaBookmark`, dan `FaGlobeAsia`.

### Fitur Utama

- Desain minimalis dengan fokus pada teks dan white space.
- Layout responsif yang menyesuaikan dengan ukuran layar (mobile dan desktop).
- Navigasi langsung ke halaman utama aplikasi melalui tombol call-to-action.
- Dukungan tema terang dan gelap melalui kelas Tailwind CSS.

### Styling

Menggunakan Tailwind CSS dengan:

- Sistem grid untuk layout responsif.
- Warna netral yang disesuaikan untuk tema terang dan gelap.
- Flex dan grid untuk penempatan elemen.
- Section tinggi penuh (min-h-screen) untuk visual yang menarik.

## 2. Indonesia.jsx

### Deskripsi

Komponen Indonesia menampilkan berita-berita terkait Indonesia dari New York Times API dan memungkinkan pengguna untuk menjelajahi serta menyimpan artikel.

### Struktur Komponen

- **Container**: Menampung keseluruhan komponen dengan styling dan padding yang sesuai.
- **Content Area**: Menampilkan berita dalam grid atau pesan error/loading jika diperlukan.
- **Load More Button**: Untuk memuat artikel tambahan dengan paginasi.

### Library dan Dependencies

- `React`: Untuk functional component dan hooks (`useState`, `useEffect`).
- `react-redux`: Untuk mengakses state global (`useDispatch`, `useSelector`).
- `NewsGrid`: Komponen custom untuk menampilkan berita dalam format grid.
- `LoadingSpinner`: Komponen custom untuk indikator loading.

### State Management (Redux)

- **Mengambil state**: `indonesiaNews`, `savedNews`, `loading`, `error`, `currentPage` dari Redux store.
- **Dispatching actions**:
  - `resetPageState`: Mereset state halaman ke awal.
  - `fetchIndonesiaNews`: Mengambil berita Indonesia dari API.
  - `saveNews`/`unsaveNews`: Menyimpan/menghapus artikel dari koleksi.

### Siklus Hidup Komponen

1. **Mount**: Mereset state halaman dan mengambil berita awal.
2. **Update**: Menampilkan data berita atau loading/error state.
3. **Interaksi**: Pengguna dapat memuat lebih banyak berita atau menyimpan artikel.

### Penanganan Error dan Loading

- Menampilkan loading spinner saat data sedang dimuat.
- Menampilkan pesan error jika terjadi masalah saat pengambilan data.
- State terpisah untuk loading artikel tambahan (`loadingMore`).

### Optimasi

- Animasi smooth scroll setelah memuat artikel tambahan.
- Timeout kecil untuk memastikan state loading terlihat pengguna.

## 3. Programming.jsx

### Deskripsi

Komponen Programming menampilkan berita-berita terkait programming dan teknologi dari New York Times API, dengan fungsionalitas untuk menjelajah dan menyimpan artikel.

### Struktur Komponen

- **Container**: Menampung seluruh konten dengan styling dan padding.
- **Content Area**: Menampilkan berita dalam grid atau pesan error/loading.
- **Load More Button**: Untuk memuat artikel tambahan melalui paginasi.

### Library dan Dependencies

- `React`: Untuk functional component dan hooks (`useState`, `useEffect`).
- `react-redux`: Untuk manajemen state global (`useDispatch`, `useSelector`).
- `NewsGrid`: Komponen custom untuk menampilkan berita dalam grid.
- `LoadingSpinner`: Komponen custom untuk indikator loading.

### State Management (Redux)

- **Mengambil state**: `programmingNews`, `savedNews`, `loading`, `error`, `currentPage` dari Redux store.
- **Dispatching actions**:
  - `resetPageState`: Mereset state halaman ke awal.
  - `fetchProgrammingNews`: Mengambil berita programming dari API.
  - `saveNews`/`unsaveNews`: Menyimpan/menghapus artikel dari koleksi.

### Siklus Hidup Komponen

1. **Mount**: Reset state halaman dan mengambil berita awal.
2. **Update**: Menampilkan data atau loading/error state.
3. **Interaksi**: Pengguna dapat memuat artikel tambahan atau menyimpan artikel.

### Penanganan Error dan Loading

- Menggunakan loading state untuk menampilkan skeleton loader.
- Menampilkan pesan error jika terjadi masalah saat pengambilan data.
- State terpisah untuk loading artikel tambahan (`loadingMore`).

### Perbedaan dengan Indonesia.jsx

- Menggunakan endpoint API yang berbeda (`fetchProgrammingNews`).
- Logging lebih detail untuk debugging.
- Styling tombol yang sedikit berbeda.

## 4. Search.jsx

### Deskripsi

Komponen Search menyediakan antarmuka untuk mencari artikel dari New York Times API dengan berbagai filter dan opsi pencarian.

### Struktur Komponen

- **Header Section**: Menampilkan judul, deskripsi, dan toggle untuk tipe API.
- **Search Form**: Input pencarian dan filter untuk mencari artikel.
- **Section Selection**: Dropdown untuk memilih kategori berita (TimeWire).
- **Results Section**: Menampilkan hasil pencarian dalam grid.

### Library dan Dependencies

- `React`: Library untuk UI dan hooks (`useState`, `useEffect`, `useCallback`).
- `react-redux`: Untuk manajemen state global (`useDispatch`, `useSelector`).
- `react-router-dom`: Untuk manajemen parameter URL (`useSearchParams`).
- `NewsGrid`, `LoadingSpinner`, `SkeletonNewsCard`: Komponen custom.

### Custom Hooks

- `useDebounce`: Hook custom untuk menunda eksekusi pencarian hingga pengguna selesai mengetik, mengoptimalkan performa dan mengurangi API calls.

### State Management (Redux)

- **Mengambil state**: `searchResults`, `savedNews`, `loading`, `error`, `selectedApiType`, `timeswireSections`, `loadingSections`.
- **Dispatching actions**:
  - `fetchSearchNews`: Mengambil hasil pencarian.
  - `saveNews`/`unsaveNews`: Menyimpan/menghapus artikel.
  - `resetPageState`: Mereset state paginasi.
  - `setApiType`: Mengubah tipe API yang digunakan.
  - `fetchTimeswireSections`: Mengambil daftar kategori TimeWire.

### Fitur Utama

1. **Multiple Search Types**:

   - Article Search: Pencarian berdasarkan kata kunci.
   - TimeWire: Pencarian berdasarkan kategori/section.

2. **Optimized Search**:

   - Debouncing untuk mengurangi API calls.
   - State cache untuk hasil pencarian sebelumnya.

3. **URL Integration**:

   - Menyimpan parameter pencarian di URL untuk bookmark dan sharing.
   - Memulihkan pencarian dari URL saat komponen dimuat.

4. **User Experience**:
   - Quick search suggestions (popular searches).
   - Clear search button untuk reset.
   - Loading indicators dan skeleton loaders.
   - Handling kasus empty state dan error state.

### Flow Pencarian

1. Pengguna memilih tipe API (Article Search atau TimeWire).
2. Untuk Article Search: memasukkan kata kunci pencarian.
3. Untuk TimeWire: memilih kategori dari dropdown.
4. Hasil ditampilkan dan dapat dimuat lebih banyak melalui pagination.
5. Artikel dapat disimpan ke dalam koleksi pengguna.

### Penanganan Kompleksitas

- Memisahkan pencarian debounced otomatis dari pencarian manual.
- Menggunakan `useCallback` untuk fungsi yang digunakan dalam dependencies.
- Kondisi rendering berdasarkan state untuk UI yang dinamis.

## 5. Saved.jsx

### Deskripsi

Komponen Saved menampilkan daftar artikel yang telah disimpan oleh pengguna, disimpan dalam localStorage, dan menyediakan opsi untuk menghapus artikel dari koleksi.

### Struktur Komponen

- **Header Section**: Menampilkan judul dan informasi jumlah artikel tersimpan.
- **Content Section**: Menampilkan artikel tersimpan dalam grid atau pesan jika tidak ada artikel.
- **Footer Note**: Informasi tentang penyimpanan artikel menggunakan localStorage.

### Library dan Dependencies

- `React`: Untuk functional component dan hooks.
- `react-redux`: Untuk mengakses state global (`useDispatch`, `useSelector`).
- `NewsGrid`: Komponen custom untuk menampilkan berita dalam format grid.
- `framer-motion`: Library animasi (diimpor tapi belum digunakan secara langsung dalam kode).

### State Management (Redux)

- **Mengambil state**: `savedNews` dari Redux store.
- **Dispatching actions**: `unsaveNews` untuk menghapus artikel dari koleksi tersimpan.

### Fitur Utama

- Menampilkan semua artikel yang telah disimpan pengguna.
- Memungkinkan pengguna untuk menghapus artikel dari koleksi.
- Menampilkan pesan dan visual yang informatif jika tidak ada artikel tersimpan.
- Layout responsif untuk berbagai ukuran layar.

### Empty State

Menampilkan UI informatif ketika tidak ada artikel tersimpan:

- Ikon bookmark
- Pesan yang jelas
- Instruksi untuk menyimpan artikel

### Styling

- Menggunakan Tailwind CSS untuk styling konsisten.
- Padding dan margin yang lebih kecil untuk layout yang lebih ringkas.
- Pemisahan antar bagian dengan border.

### Perbedaan dari Halaman Lain

- Tidak melakukan API calls (menggunakan data dari localStorage).
- Fokus pada manajemen artikel tersimpan, bukan pencarian atau penjelajahan.
- Layout yang lebih sederhana karena tidak memerlukan pagination atau state loading.

## Ringkasan Arsitektur Pages

Aplikasi News-Web-App mengikuti arsitektur komponen React dengan state management terpusat menggunakan Redux. Halaman-halaman utama dirancang dengan fungsionalitas spesifik:

1. **Home**: Landing page dengan pengenalan fitur.
2. **Indonesia**: Menampilkan berita spesifik Indonesia.
3. **Programming**: Menampilkan berita terkait teknologi dan pemrograman.
4. **Search**: Interface pencarian yang fleksibel dengan berbagai opsi.
5. **Saved**: Manajemen koleksi artikel tersimpan.

Semua halaman memiliki karakteristik umum:

- Responsive design menggunakan Tailwind CSS.
- Konsistensi UI/UX antar halaman.
- Integrasi dengan Redux store untuk state management.
- Penanganan loading state dan error handling.

Arsitektur ini memisahkan dengan jelas antara tampilan (pages), state management (Redux), dan layanan data (API calls), menciptakan aplikasi yang terstruktur dengan baik dan mudah dipelihara.
