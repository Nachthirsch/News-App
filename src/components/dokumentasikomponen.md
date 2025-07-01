# Dokumentasi Komponen

## 1. NewsCard.jsx

### Deskripsi

`NewsCard` adalah komponen kartu berita yang dapat disesuaikan untuk menampilkan artikel berita dalam berbagai format visual. Komponen ini mendukung beberapa variasi tampilan, interaksi pengguna, dan dioptimalkan untuk kinerja.

### Props

- `title`: String (required) - Judul artikel berita
- `description`: String (required) - Deskripsi atau abstrak artikel
- `source`: String (required) - Sumber berita (misalnya "New York Times")
- `url`: String (required) - URL artikel lengkap
- `imageUrl`: String (required) - URL gambar untuk artikel
- `onSave`: Function (required) - Handler untuk menyimpan/menghapus artikel
- `isSaved`: Boolean (required) - Status apakah artikel telah disimpan
- `variant`: String (optional) - Jenis tampilan kartu ("hero", "feature", "horizontal", "regular", "small", "text-only", "title-only", "thumbnail-square")
- `priority`: Boolean (optional) - Apakah gambar harus dimuat dengan prioritas tinggi

### Fitur Utama

1. **Multiple Visual Variants**:

   - `hero`: Kartu besar dengan gambar dan konten lengkap
   - `feature`: Kartu menengah dengan gambar dan konten
   - `horizontal`: Layout horizontal dengan gambar di samping konten
   - `regular`: Kartu standar dengan gambar dan konten
   - `small`: Kartu kecil dengan gambar kecil dan teks minimal
   - `text-only`: Kartu tanpa gambar, hanya teks
   - `title-only`: Kartu hanya dengan judul
   - `thumbnail-square`: Tampilan thumbnail dengan gambar persegi

2. **Interaktivitas**:

   - Berbagi artikel melalui Web Share API atau copy link
   - Text-to-speech untuk membacakan artikel
   - Simpan/hapus artikel dari koleksi

3. **Optimasi Performa**:
   - Lazy loading gambar untuk performa yang lebih baik
   - Intersection Observer untuk memuat komponen saat terlihat
   - Format teks yang optimal untuk menjaga konsistensi visual

### Implementasi Teknis

- Menggunakan `useState` untuk mengelola status pemutaran text-to-speech
- Menggunakan `useInView` dari react-intersection-observer untuk lazy loading
- Animasi dengan Framer Motion untuk efek visual halus
- Styling responsif dengan Tailwind CSS
- Penanganan error untuk gambar dengan fallback

### Contoh Penggunaan

```jsx
<NewsCard title="Judul Artikel Berita" description="Deskripsi artikel berita yang informatif..." source="The New York Times" url="https://www.nytimes.com/article-url" imageUrl="https://example.com/image.jpg" onSave={handleSaveArticle} isSaved={false} variant="feature" priority={true} />
```

## 2. NewsGrid.jsx

### Deskripsi

`NewsGrid` adalah komponen layout yang mengatur tampilan artikel berita dalam berbagai format grid yang responsif. Komponen ini menampilkan kumpulan berita dengan layout yang berbeda berdasarkan ukuran layar dan preferensi tampilan.

### Props

- `news`: Array (required) - Array artikel berita untuk ditampilkan
- `onSave`: Function (required) - Handler untuk menyimpan/menghapus artikel
- `savedNews`: Array (required) - Array artikel yang sudah disimpan
- `isLoading`: Boolean (optional) - Status loading data

### Fitur Utama

1. **Multiple Layout Types**:

   - `featured`: Layout unggulan dengan artikel utama dan pendukung
   - `mobile-grid`: Layout grid khusus mobile dengan horizontal scrolling
   - `magazine`: Layout gaya majalah

2. **Dynamic Article Sizing**:

   - Posisi dan ukuran artikel berbeda berdasarkan indeks
   - Artikel utama ditampilkan lebih besar
   - Support untuk horizontal scrolling pada mobile

3. **Optimasi Performa**:

   - Lazy loading komponen
   - Skeleton loading state
   - Animasi staggered untuk meningkatkan perceived performance

4. **Image Handling**:
   - Resolusi gambar yang sesuai untuk tiap ukuran kartu
   - Fallback untuk gambar yang tidak tersedia
   - Preferential loading untuk gambar penting

### Helper Functions

- `getImageUrl`: Mengambil URL gambar yang tepat dari berbagai format API
- `getSource`: Mengambil sumber berita dari format API yang berbeda
- `getArticleVariant`: Menentukan variant kartu berdasarkan posisi
- `getItemClass`: Menentukan class grid berdasarkan layout dan posisi
- `renderSkeletonCards`: Membuat array kartu skeleton untuk loading state

### States

- `mounted`: Mengontrol animasi mounting
- `layoutType`: Jenis layout yang ditampilkan
- `windowWidth`: Lebar window untuk responsivitas

### Skeleton Loading

Komponen menampilkan skeleton cards saat `isLoading` true, dengan layout yang cocok dengan tipe layout yang dipilih.

### Contoh Penggunaan

```jsx
<NewsGrid news={articles} onSave={handleSaveArticle} savedNews={savedArticles} isLoading={loading} />
```

## 3. SkeletonNewsCard.jsx

### Deskripsi

`SkeletonNewsCard` adalah komponen placeholder yang digunakan selama loading data artikel. Komponen ini menampilkan visual yang merepresentasikan struktur artikel yang sedang dimuat, dengan animasi pulse untuk menunjukkan status loading.

### Props

- `variant`: String (optional) - Jenis tampilan skeleton ("hero", "feature", "horizontal", "regular", "small", "text-only", "title-only", "thumbnail-square")

### Fitur Utama

1. **Multiple Visual Variants**:

   - Skeleton untuk semua variant yang ada di NewsCard
   - Struktur yang sesuai dengan masing-masing variant

2. **Visual Loading Indicator**:

   - Animasi pulse untuk menunjukkan status loading
   - Dukungan tema gelap dan terang

3. **Customizable Layout**:
   - Layout skeleton sesuai dengan tipe kartu
   - Proporsi dan padding yang sesuai

### Helper Functions

- `getSkeletonLayout`: Menentukan layout berdasarkan variant
- `getImageHeight`: Menentukan tinggi bagian gambar berdasarkan variant

### Styling

- Menggunakan Tailwind CSS untuk styling responsif
- Animasi pulse untuk visual loading
- Dukungan dark mode dengan kelas dark:

### Contoh Penggunaan

```jsx
<SkeletonNewsCard variant="hero" />
```

## 4. LoadingSpinner.jsx

### Deskripsi

`LoadingSpinner` adalah komponen indikator loading yang sederhana dan ringan. Komponen ini menampilkan animasi spinner memutar untuk menunjukkan proses loading yang sedang berlangsung.

### Props

- `size`: String (optional) - Ukuran spinner ("small", "default", "large")

### Fitur

1. **Multiple Sizes**:

   - Small: Untuk loading indikator inline atau dalam komponen kecil
   - Default: Untuk loading indikator standar
   - Large: Untuk loading indikator yang menonjol

2. **Visual Consistency**:
   - Warna yang konsisten dengan tema aplikasi
   - Dukungan tema gelap dan terang

### Implementasi

- Animasi CSS untuk efek memutar
- Menggunakan kelas Tailwind untuk styling dan ukuran
- Support untuk dark mode

### Contoh Penggunaan

```jsx
<LoadingSpinner size="large" />
```

## 5. Header.jsx

### Deskripsi

`Header` adalah komponen navigasi utama aplikasi yang menampilkan menu, fitur pencarian, dan toggle tema. Komponen ini hadir di seluruh aplikasi dan menawarkan akses ke halaman utama dan fungsi-fungsi penting.

### Props

- Tidak ada prop yang diperlukan, menggunakan hooks internal

### Fitur Utama

1. **Navigation**:

   - Links ke semua halaman utama aplikasi
   - Indikator halaman aktif
   - Menu responsif untuk tampilan mobile

2. **Search Functionality**:

   - Pencarian inline yang langsung mengarahkan ke halaman pencarian
   - Handling query parameters di URL

3. **Theme Toggle**:

   - Tombol untuk beralih antara mode terang dan gelap
   - Menggunakan ThemeContext untuk manajemen tema

4. **Responsive Design**:
   - Layout desktop dengan navigasi horizontal
   - Layout mobile dengan dropdown menu
   - Transisi halus untuk membuka/menutup menu

### State Management

- `searchQuery`: Mengelola input pencarian
- `isMenuOpen`: Status apakah menu mobile terbuka

### Context Usage

Menggunakan `useTheme` hook untuk mengakses dan memodifikasi tema aplikasi.

### Navigation

Menggunakan React Router untuk navigasi:

- `useLocation`: Mengetahui halaman aktif untuk styling
- `useNavigate`: Navigasi programatis setelah pencarian
- `Link`: Komponen navigasi untuk menu items

### Contoh Penggunaan

```jsx
<Header />
```

## 6. Footer.jsx

### Deskripsi

`Footer` adalah komponen footer aplikasi yang menampilkan informasi tambahan, kredit, dan link sosial media. Komponen ini berada di bagian bawah setiap halaman.

### Props

- Tidak ada prop yang diperlukan

### Fitur

1. **Branding**:

   - Logo/nama aplikasi
   - Slogan atau tagline

2. **Social Links**:

   - Links ke GitHub dan LinkedIn
   - Icons untuk visual yang lebih menarik

3. **Credits**:
   - Informasi pembuat aplikasi
   - Kredit untuk New York Times API

### Styling

- Menggunakan Tailwind CSS untuk layout dan styling
- Support untuk tema gelap dan terang
- Transisi halus untuk hover effects

### Contoh Penggunaan

```jsx
<Footer />
```

## 7. Hero-Home.jsx (AnimatedHero)

### Deskripsi

`AnimatedHero` adalah komponen hero section animasi untuk halaman beranda. Komponen ini menampilkan judul utama, deskripsi, dan call-to-action dengan efek animasi untuk meningkatkan pengalaman pengguna.

### Props

- Tidak ada prop yang diperlukan, menggunakan state internal

### Fitur Utama

1. **Responsive Design**:

   - Layout yang menyesuaikan dengan ukuran layar
   - Styling yang optimal untuk berbagai devices

2. **Animated Elements**:

   - Animasi text fade-in dan slide-up
   - Animasi latar belakang gradient
   - Transisi CTA buttons

3. **Theme Detection**:

   - Mendeteksi preferensi tema sistem
   - Menyesuaikan gradient berdasarkan tema terang/gelap

4. **Call-to-Action**:
   - Tombol untuk memulai pencarian
   - Tombol untuk melihat berita Indonesia

### Animation Implementation

- Menggunakan React Spring untuk animasi yang halus dan berbasis fisika
- Animasi sequence dengan delay untuk efek staggering
- Media query listener untuk responsivitas

### State Management

- `isDarkMode`: Mendeteksi dan menyimpan preferensi mode gelap

### Styling

- Gradient background dinamis berdasarkan tema
- Styling responsif dengan Tailwind CSS
- Efek hover dan active pada tombol

### Contoh Penggunaan

```jsx
<AnimatedHero />
```

## Analisis Mendalam Komponen NewsCard

### 1. Gambaran Umum

`NewsCard` adalah komponen yang sangat fleksibel untuk menampilkan artikel berita dengan berbagai format visual. Komponen ini dirancang untuk menampilkan artikel berita dengan cara yang konsisten namun dapat disesuaikan, dengan mendukung berbagai variasi tata letak dan fitur interaktif.

### 2. Dependencies dan Hooks

```jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
```

- **PropTypes**: Untuk validasi props yang diterima komponen
- **useState**: Hook React untuk mengelola state lokal
- **motion**: Komponen dari Framer Motion untuk animasi UI
- **useInView**: Hook dari react-intersection-observer untuk lazy loading dan efek berbasis viewport

### 3. Props

Komponen menerima props berikut:

| Prop          | Tipe     | Default   | Deskripsi                                    |
| ------------- | -------- | --------- | -------------------------------------------- |
| `title`       | string   | -         | Judul artikel berita                         |
| `description` | string   | -         | Deskripsi atau abstrak artikel               |
| `source`      | string   | -         | Sumber artikel berita                        |
| `url`         | string   | -         | URL artikel lengkap                          |
| `imageUrl`    | string   | -         | URL gambar artikel                           |
| `onSave`      | function | -         | Handler untuk menyimpan/menghapus artikel    |
| `isSaved`     | boolean  | -         | Status apakah artikel telah disimpan         |
| `variant`     | string   | "regular" | Tipe tampilan kartu                          |
| `priority`    | boolean  | false     | Apakah gambar dimuat dengan prioritas tinggi |

### 4. State Internal

```jsx
const [isPlaying, setIsPlaying] = useState(false);
const [utterance, setUtterance] = useState(null);
const [ref, inView] = useInView({
  threshold: 0.1,
  triggerOnce: true,
});
```

- **isPlaying**: Melacak status pemutaran text-to-speech
- **utterance**: Menyimpan instance SpeechSynthesisUtterance untuk TTS
- **ref, inView**: Dari useInView, melacak apakah komponen terlihat di viewport

### 5. Fitur Interaktif

#### 5.1 Web Share API dan Clipboard

```jsx
const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: title,
        text: description,
        url: url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};
```

- Menggunakan Web Share API jika tersedia di browser
- Fallback ke clipboard.writeText jika Web Share tidak tersedia
- Penanganan error untuk memberikan feedback pada pengguna

#### 5.2 Text-to-Speech

```jsx
const handleSpeak = () => {
  if (!utterance) {
    const newUtterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
    newUtterance.onend = () => setIsPlaying(false);
    setUtterance(newUtterance);
    setIsPlaying(true);
    window.speechSynthesis.speak(newUtterance);
  } else if (isPlaying) {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  } else {
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  }
};
```

- Menggunakan Web Speech API untuk text-to-speech
- Menggabungkan judul dan deskripsi untuk dibacakan
- Menangani toggle start/stop dan cleanup state setelah selesai
- Menyimpan instance utterance untuk digunakan kembali

### 6. Variasi Tampilan (Variants)

Komponen mendukung delapan tipe variant berbeda:

| Variant            | Deskripsi                                         |
| ------------------ | ------------------------------------------------- |
| "hero"             | Kartu besar dengan gambar dan konten lengkap      |
| "feature"          | Kartu menengah dengan gambar dan konten           |
| "horizontal"       | Layout horizontal dengan gambar di samping konten |
| "regular"          | Kartu standar (default) dengan gambar dan konten  |
| "small"            | Kartu kecil dengan gambar dan teks minimal        |
| "text-only"        | Kartu tanpa gambar, hanya teks                    |
| "title-only"       | Kartu hanya dengan judul                          |
| "thumbnail-square" | Tampilan thumbnail dengan gambar persegi          |

### 7. Helper Functions

#### 7.1 Layout dan Styling

Komponen menggunakan beberapa helper functions untuk menentukan class CSS berdasarkan variant:

```jsx
const getCardLayout = () => {
  switch (variant) {
    case "hero":
      return "flex flex-col";
    case "feature":
      return "flex flex-col";
    // ...lainnya
  }
};

const getImageContainerClass = () => {
  switch (variant) {
    case "hero":
      return "w-full h-52 md:h-[320px]";
    case "feature":
      return "w-full h-40 md:h-48";
    // ...lainnya
  }
};

const getContentContainerClass = () => {
  // ...
};

const getTitleClass = () => {
  // ...
};

const getDescriptionClass = () => {
  // ...
};
```

Pendekatan ini membuat komponen sangat fleksibel dan memungkinkan styling yang konsisten untuk setiap variant.

#### 7.2 Format Deskripsi

```jsx
const formatDescription = (text) => {
  const maxLength = variant === "hero" ? 250 : variant === "feature" ? 150 : variant === "horizontal" ? 130 : variant === "small" ? 80 : 120;

  if (text.length > maxLength) {
    return (
      <>
        {text.substring(0, maxLength)}
        <span className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer ml-1">...</span>
      </>
    );
  }
  return text;
};
```

- Memotong teks deskripsi berdasarkan panjang maksimum sesuai variant
- Menambahkan indikator visual "..." untuk teks yang terpotong
- Styling khusus pada elipsis untuk menunjukkan bahwa ada konten lebih lanjut

### 8. Struktur Komponen

Struktur JSX komponen dapat dibagi menjadi beberapa bagian utama:

#### 8.1 Container Utama

```jsx
<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
  transition={{ duration: 0.5 }}
  className={`group relative 
             border-b border-neutral-200 dark:border-neutral-700
             transition-all duration-300 
             overflow-hidden
             ${getCardLayout()} h-full
             ${variant !== "thumbnail-square" ? "pb-3 mb-3" : ""}`}
>
  {/* ... */}
</motion.div>
```

- Menggunakan motion.div untuk animasi
- Menggunakan ref dari useInView untuk deteksi visibility
- Menggunakan class "group" untuk styling hover pada child elements
- Menerapkan styling dinamis berdasarkan variant

#### 8.2 Container Gambar

```jsx
{
  variant !== "text-only" && variant !== "title-only" && (
    <div className={`relative overflow-hidden ${getImageContainerClass()}`}>
      <motion.img
        src={imageUrl}
        alt={title}
        loading={loadingPriority}
        className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 
                ${variant === "thumbnail-square" ? "aspect-square object-cover" : ""}`}
        onError={(e) => (e.target.src = "/fallback-image.jpg")}
        layoutId={`image-${url}`}
      />

      {/* Category/source badge */}
      {/* Control buttons */}
    </div>
  );
}
```

- Hanya ditampilkan untuk variant yang memiliki gambar
- Menggunakan motion.img untuk animasi gambar
- Menerapkan hover effect (scale) pada gambar
- Mengatur loading priority berdasarkan props
- Penanganan error dengan fallback image
- layoutId untuk animasi transisi antar halaman

#### 8.3 Tombol Kontrol

Terdapat dua set tombol kontrol yang berbeda berdasarkan variant:

1. **Tombol Kontrol Standar**:

```jsx
<div className="absolute top-3 right-3 flex items-center gap-2">
  {/* Text-to-Speech button */}
  {/* Share button */}
  {/* Save button */}
</div>
```

2. **Tombol Kontrol Thumbnail**:

```jsx
<div className="absolute top-2 right-2">{/* Simplified save button */}</div>
```

#### 8.4 Container Konten

```jsx
<div className={`flex flex-col ${variant === "text-only" || variant === "title-only" ? "flex-grow" : ""} ${getContentContainerClass()}`}>
  {/* Source indicator for text-only/title-only */}
  {/* Source indicator for other variants */}

  <motion.a href={url} target="_blank" rel="noopener noreferrer" className={variant === "text-only" || variant === "title-only" || variant === "thumbnail-square" ? "flex-grow" : ""}>
    <h2 className={`font-bold text-neutral-800 dark:text-neutral-100 ${getTitleClass()}`}>{title}</h2>
    <div className={`text-neutral-600 dark:text-neutral-300 mb-2 text-sm ${getDescriptionClass()} ${variant === "small" ? "hidden sm:block" : ""}`}>{formatDescription(description)}</div>
  </motion.a>
</div>
```

- Struktur fleksibel yang menyesuaikan dengan variant
- Penggunaan motion.a untuk animasi link
- Kondisional rendering untuk source indicator
- Styling responsif dengan hidden/display untuk small variant pada mobile

### 9. Optimasi Performa

#### 9.1 Lazy Loading

```jsx
const [ref, inView] = useInView({
  threshold: 0.1,
  triggerOnce: true,
});

// ...

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 20 }}
  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
  // ...
>
```

- Menggunakan Intersection Observer untuk hanya menganimasikan komponen ketika terlihat di viewport
- Setting triggerOnce: true untuk memastikan animasi hanya berjalan sekali

#### 9.2 Image Loading

```jsx
const loadingPriority = priority ? "eager" : "lazy";

// ...

<motion.img
  src={imageUrl}
  alt={title}
  loading={loadingPriority}
  // ...
/>;
```

- Mengontrol prioritas loading gambar berdasarkan props priority
- "eager" untuk konten above-the-fold, "lazy" untuk konten lainnya

#### 9.3 Error Handling

```jsx
<motion.img
  // ...
  onError={(e) => (e.target.src = "/fallback-image.jpg")}
  // ...
/>
```

- Menangani kasus di mana gambar gagal dimuat dengan fallback image

### 10. Styling dan Tema

#### 10.1 Responsive Design

Komponen menggunakan breakpoints Tailwind untuk responsivitas:

- `sm:` untuk layar small (640px+)
- `md:` untuk layar medium (768px+)
- `lg:` untuk layar large (1024px+)

#### 10.2 Dark Mode

Komponen mendukung dark mode dengan class Tailwind:

- `dark:bg-neutral-800` vs `bg-white`
- `dark:text-neutral-100` vs `text-neutral-800`
- `dark:border-neutral-700` vs `border-neutral-200`

#### 10.3 Hover Effects

Menggunakan kombinasi Tailwind dan Framer Motion:

```jsx
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  // ...
>
```

### 11. Aksesibilitas

- Menggunakan tag semantik untuk struktur konten
- Menyediakan `alt` text untuk gambar
- Menggunakan `target="_blank"` dan `rel="noopener noreferrer"` untuk link eksternal
- Menyediakan `title` attribute untuk tombol kontrol

### 12. Validasi Props

```jsx
NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaved: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  isFeature: PropTypes.bool,
  variant: PropTypes.oneOf(["hero", "feature", "horizontal", "regular", "small", "text-only", "title-only", "thumbnail-square"]),
  priority: PropTypes.bool,
};
```

- Memastikan semua props yang diperlukan diberikan dengan tipe data yang benar
- Menggunakan oneOf untuk membatasi nilai variant yang valid

### 13. Best Practices yang Diimplementasikan

1. **Komponen yang Reusable**: Desain fleksibel dengan berbagai variants
2. **Single Responsibility**: Komponen berfokus pada satu tugas utama - menampilkan artikel berita
3. **Conditional Rendering**: Menyesuaikan tampilan berdasarkan props dan kondisi
4. **Performance Optimization**: Lazy loading, error handling
5. **Accessibility**: Semantic HTML, text alternatives
6. **Consistent Styling**: Helper functions untuk styling konsisten
7. **Proper Animation**: Penggunaan Framer Motion untuk animasi yang halus
8. **Adaptive Design**: Mendukung berbagai ukuran layar dan tema

### 14. Integrasi dengan Komponen Lain

`NewsCard` digunakan sebagai building block utama dalam:

1. **NewsGrid**: Menampilkan koleksi NewsCard dengan layout terstruktur
2. **Search Results**: Menampilkan hasil pencarian
3. **Saved Articles**: Menampilkan artikel tersimpan

### 15. Kesimpulan

`NewsCard` adalah komponen yang sangat fleksibel dan dirancang dengan baik yang menyeimbangkan:

- **Fungsionalitas**: Dengan fitur berbagi, simpan, dan text-to-speech
- **Estetika**: Dengan animasi halus dan design yang bersih
- **Performa**: Dengan optimasi loading dan lazy animation
- **Aksesibilitas**: Dengan semantic markup dan alternative text
- **Maintainability**: Dengan struktur kode yang jelas dan helper functions

Komponen ini mendemonstrasikan praktik terbaik dalam pengembangan React modern dengan fokus pada reusability, performa, dan pengalaman pengguna.
