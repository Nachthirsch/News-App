# Dokumentasi ThemeContext

## 1. Gambaran Umum

`ThemeContext` adalah sistem manajemen tema dalam aplikasi News-Web-App yang menyediakan fungsionalitas mode terang dan gelap. Komponen ini menggunakan React Context API untuk berbagi dan mengelola status tema di seluruh aplikasi tanpa perlu meneruskan prop secara manual melalui komponen intermediet.

## 2. Struktur File

File `ThemeContext.jsx` berisi tiga komponen utama:

- `ThemeContext`: Context React untuk menyimpan state tema
- `ThemeProvider`: Komponen provider yang membungkus aplikasi dan menyediakan nilai tema
- `useTheme`: Custom hook untuk mengakses nilai tema di komponen lain

## 3. Analisis Kode

### 3.1 Pembuatan Context

```javascript
const ThemeContext = createContext();
```

- Membuat context React baru yang akan digunakan untuk menyimpan dan menyediakan nilai tema.
- Nilai awal tidak diatur disini karena akan diatur dalam Provider.

### 3.2 ThemeProvider Component

```javascript
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};
```

- **Inisialisasi State**:

  - Menggunakan `useState` dengan fungsi inisialisasi untuk menentukan nilai awal `darkMode`.
  - Membaca preferensi tema dari `localStorage` jika tersedia, atau default ke mode terang (`false`).

- **Efek Samping**:

  - Menyimpan preferensi tema ke `localStorage` setiap kali nilai berubah.
  - Menambah atau menghapus kelas CSS `dark` pada elemen `html` berdasarkan status `darkMode`.
  - Kelas ini digunakan oleh Tailwind CSS untuk menerapkan tema gelap.

- **Fungsi Pengalih Tema**:

  - `toggleDarkMode`: Fungsi untuk beralih antara tema terang dan gelap.

- **Render**:
  - Menyediakan nilai context (`darkMode` dan `toggleDarkMode`) kepada komponen turunannya melalui `ThemeContext.Provider`.

### 3.3 useTheme Custom Hook

```javascript
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
```

- **Tujuan**: Menyediakan cara yang mudah dan aman untuk komponen mengakses nilai tema.
- **Validasi**: Memastikan hook hanya digunakan dalam komponen yang dibungkus oleh `ThemeProvider`.
- **Error Handling**: Melempar error yang informatif jika digunakan di luar Provider.
- **Penggunaan**: Memungkinkan komponen untuk mendapatkan nilai `darkMode` dan fungsi `toggleDarkMode`.

## 4. Integrasi dengan Aplikasi

### 4.1 Penggunaan ThemeProvider

Untuk menggunakan sistem tema ini, `ThemeProvider` harus membungkus komponen root aplikasi:

```javascript
// Contoh dalam App.jsx atau index.jsx
import { ThemeProvider } from "./context/ThemeContext";

const App = () => (
  <ThemeProvider>
    <YourApp />
  </ThemeProvider>
);
```

### 4.2 Menggunakan Theme dalam Komponen

Komponen dapat mengakses dan memanipulasi tema menggunakan `useTheme` hook:

```javascript
// Contoh dalam suatu komponen
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return <button onClick={toggleDarkMode}>{darkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}</button>;
};
```

## 5. Penggunaan dengan Tailwind CSS

### 5.1 Konfigurasi

Sistem tema ini dirancang untuk bekerja dengan fitur dark mode Tailwind CSS yang menggunakan kelas `dark:` untuk menentukan varian tema gelap.

Contoh konfigurasi Tailwind:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: "class", // Mengaktifkan dark mode berbasis kelas
  // Konfigurasi lainnya...
};
```

### 5.2 Contoh Styling

```html
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">Konten yang responsif terhadap tema</div>
```

## 6. Persistensi Preferensi Pengguna

- **Penyimpanan**: Preferensi tema disimpan dalam `localStorage`, memungkinkan aplikasi untuk mengingat pilihan pengguna di antara kunjungan.
- **Inisialisasi**: Saat aplikasi dimuat, preferensi tema dibaca dari `localStorage` untuk memulihkan pilihan pengguna sebelumnya.
- **Pembaruan**: Setiap kali tema berubah, nilai baru disimpan ke `localStorage` untuk persistensi.

## 7. Keuntungan Pendekatan Ini

1. **Pemisahan Kepedulian**: Logika tema dienkapsulasi dalam modul terpisah.
2. **Penggunaan Ulang**: Nilai dan fungsi tema dapat digunakan di seluruh aplikasi tanpa prop drilling.
3. **Persistensi**: Preferensi pengguna dipertahankan di antara sesi.
4. **Integrasi Tailwind**: Bekerja mulus dengan sistem tema Tailwind CSS.
5. **UX yang Konsisten**: Memastikan tampilan tema yang konsisten di seluruh aplikasi.

## 8. Ringkasan

ThemeContext menyediakan solusi manajemen tema yang elegan dan efektif untuk News-Web-App menggunakan React Context API. Dengan memisahkan logika tema ke dalam modul terpisah, aplikasi mempertahankan struktur yang bersih sambil menawarkan pengalaman pengguna yang ditingkatkan dengan dukungan tema terang dan gelap. Sistem ini juga memastikan preferensi pengguna disimpan dan dipulihkan di antara sesi, meningkatkan konsistensi pengalaman pengguna.
