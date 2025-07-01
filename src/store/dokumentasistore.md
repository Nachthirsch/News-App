# Dokumentasi Redux Store

## 1. Konfigurasi Store (`index.js`)

### Pernyataan Import

```javascript
import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slices/newsSlice";
```

- `configureStore`: Fungsi dari Redux Toolkit yang menyederhanakan pengaturan store dengan default yang baik
- `newsReducer`: Diimpor dari file newsSlice, berisi semua logika manajemen state terkait berita

### Konfigurasi Store

```javascript
export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});
```

- Membuat Redux store dengan `configureStore`
- Mengatur satu reducer bernama "news" yang menangani semua state terkait berita
- Store diekspor untuk digunakan dengan Provider di komponen root aplikasi

## 2. News Slice (`slices/newsSlice.js`)

### Pernyataan Import

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLocalNews, getProgrammingNews, searchNews, getTimeswireSections } from "../../services/api";
```

- `createSlice`: Fungsi Redux Toolkit untuk mendefinisikan slice dari state dan reducer-nya
- `createAsyncThunk`: Fungsi Redux Toolkit untuk menangani operasi asinkron
- Import layanan API untuk mengambil berbagai jenis data berita

### Fungsi Pembantu

#### loadSavedNews

```javascript
const loadSavedNews = () => {
  try {
    const savedNews = localStorage.getItem("savedNews");
    return savedNews ? JSON.parse(savedNews) : [];
  } catch (error) {
    console.error("Error loading saved news:", error);
    return [];
  }
};
```

- Memuat artikel berita tersimpan dari localStorage
- Mengembalikan array kosong jika tidak ada berita tersimpan atau jika terjadi kesalahan
- Menggunakan try-catch untuk menangani kemungkinan kesalahan parsing JSON

#### processArticles

```javascript
const processArticles = (articles) => {
  if (!Array.isArray(articles)) return [];

  return articles.map((article) => {
    // Logika normalisasi
    // ...
  });
};
```

- Menormalkan struktur data artikel untuk konsistensi di berbagai respons API
- Menangani kasus khusus di mana field yang diharapkan mungkin hilang atau dalam format berbeda
- Standardisasi field headline, abstract, URL, byline, source, dan section
- Mengembalikan array baru dengan artikel yang dinormalisasi

### Async Thunks

#### fetchIndonesiaNews

```javascript
export const fetchIndonesiaNews = createAsyncThunk("news/fetchIndonesiaNews", async ({ page = 0, isNewFetch = false }) => {
  const response = await getLocalNews(page);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    isNewFetch,
  };
});
```

- Mengambil berita Indonesia menggunakan layanan API `getLocalNews`
- Menerima parameter paginasi dan apakah ini adalah pengambilan baru
- Memproses artikel untuk struktur data yang konsisten
- Mengembalikan artikel yang sudah diproses beserta informasi halaman

#### fetchProgrammingNews

```javascript
export const fetchProgrammingNews = createAsyncThunk("news/fetchProgrammingNews", async ({ page = 0, isNewFetch = false }) => {
  const response = await getProgrammingNews(page);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    isNewFetch,
  };
});
```

- Mengambil berita terkait pemrograman menggunakan layanan API `getProgrammingNews`
- Struktur mirip dengan fetchIndonesiaNews
- Memproses dan mengembalikan artikel dengan informasi paginasi

#### fetchSearchNews

```javascript
export const fetchSearchNews = createAsyncThunk("news/fetchSearchNews", async ({ query, page = 0, apiType = "articlesearch" }) => {
  const response = await searchNews(query, page, apiType);
  return {
    docs: processArticles(response.data.response.docs),
    page,
    query,
    apiType,
    isNewSearch: page === 0,
  };
});
```

- Melakukan pencarian artikel berita berdasarkan query
- Mengambil parameter query, halaman, dan jenis API
- Memproses hasil dan menyertakan flag untuk menunjukkan apakah ini adalah pencarian baru (halaman 0)
- Mengembalikan hasil pencarian yang telah diproses dengan metadata

#### fetchTimeswireSections

```javascript
export const fetchTimeswireSections = createAsyncThunk("news/fetchTimeswireSections", async (_, { rejectWithValue }) => {
  try {
    const response = await getTimeswireSections();
    return response.data.results;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch TimeWire sections");
  }
});
```

- Mengambil bagian TimeWire yang tersedia
- Termasuk penanganan kesalahan dengan `rejectWithValue`
- Mengembalikan data bagian dari respons API

### Definisi Redux Slice

#### State Awal

```javascript
const newsSlice = createSlice({
  name: "news",
  initialState: {
    indonesiaNews: [],
    programmingNews: [],
    searchResults: [],
    savedNews: loadSavedNews(),
    loading: false,
    error: null,
    lastUpdated: null,
    currentPage: {
      indonesia: 0,
      programming: 0,
      search: 0,
    },
    selectedApiType: "articlesearch",
    timeswireSections: [],
    loadingSections: false,
    sectionsError: null,
  },
  // ...
});
```

- Mendefinisikan struktur state awal untuk slice berita
- Berisi array untuk berbagai kategori berita: indonesia, programming, hasil pencarian, tersimpan
- Termasuk state loading dan error untuk operasi asinkron
- Melacak paginasi dengan objek currentPage untuk setiap kategori
- Memelihara selectedApiType untuk fungsionalitas pencarian
- Termasuk bagian TimeWire dan state loading terkait

#### Reducers

```javascript
reducers: {
  saveNews: (state, action) => {
    const isAlreadySaved = state.savedNews.some((saved) => saved.web_url === action.payload.web_url);
    if (!isAlreadySaved) {
      state.savedNews.push(action.payload);
      localStorage.setItem("savedNews", JSON.stringify(state.savedNews));
    }
  },
  unsaveNews: (state, action) => {
    state.savedNews = state.savedNews.filter((news) => news.web_url !== action.payload.web_url);
    localStorage.setItem("savedNews", JSON.stringify(state.savedNews));
  },
  clearError: (state) => {
    state.error = null;
  },
  resetPageState: (state, action) => {
    if (action.payload === "indonesia") {
      state.currentPage.indonesia = 0;
    } else if (action.payload === "programming") {
      state.currentPage.programming = 0;
    } else if (action.payload === "search") {
      state.currentPage.search = 0;
    }
  },
  setApiType: (state, action) => {
    state.selectedApiType = action.payload;
    state.searchResults = [];
    state.currentPage.search = 0;
  },
},
```

- `saveNews`: Menambahkan artikel ke savedNews jika belum disimpan, memperbarui localStorage
- `unsaveNews`: Menghapus artikel dari savedNews, memperbarui localStorage
- `clearError`: Mereset state error
- `resetPageState`: Mereset paginasi untuk kategori berita tertentu
- `setApiType`: Mengubah API yang digunakan untuk pencarian, mereset hasil pencarian dan paginasi

#### Extra Reducers

Bagian `extraReducers` menangani perubahan state untuk async thunks:

- **fetchIndonesiaNews**:

  - `pending`: Mengatur loading menjadi true, menghapus error
  - `fulfilled`: Memperbarui array indonesiaNews (mengganti atau menambahkan berdasarkan isNewFetch), memperbarui paginasi dan timestamp
  - `rejected`: Mengatur loading menjadi false, menyimpan pesan error

- **fetchProgrammingNews**:

  - `pending`: Mengatur loading menjadi true, menghapus error
  - `fulfilled`: Memperbarui array programmingNews (mengganti atau menambahkan berdasarkan isNewFetch), memperbarui paginasi dan timestamp
  - `rejected`: Mengatur loading menjadi false, menyimpan pesan error

- **fetchSearchNews**:

  - `pending`: Mengatur loading menjadi true, menghapus error
  - `fulfilled`: Memperbarui searchResults (mengganti atau menambahkan berdasarkan isNewSearch), memperbarui selectedApiType, paginasi, dan timestamp
  - `rejected`: Mengatur loading menjadi false, menyimpan pesan error

- **fetchTimeswireSections**:
  - `pending`: Mengatur loadingSections menjadi true, menghapus sectionsError
  - `fulfilled`: Memperbarui array timeswireSections, mereset state loading dan error
  - `rejected`: Mengatur loadingSections menjadi false, menyimpan pesan error

### Exports

```javascript
export const { saveNews, unsaveNews, clearError, resetPageState, setApiType } = newsSlice.actions;
export default newsSlice.reducer;
```

- Mengekspor action creator individual untuk digunakan dalam komponen
- Mengekspor fungsi reducer sebagai ekspor default untuk digunakan dalam konfigurasi store

## Ringkasan

Implementasi Redux store ini mengelola data berita untuk aplikasi React dengan fitur-fitur utama berikut:

1. **Manajemen State Terpusat**:

   - Menggunakan Redux Toolkit untuk manajemen state yang efisien
   - Mengorganisir semua state terkait berita dalam satu slice

2. **Kategori Berita**:

   - Berita Indonesia
   - Berita pemrograman
   - Hasil pencarian
   - Artikel tersimpan (disimpan di localStorage)

3. **Integrasi API**:

   - Pengambilan data asinkron dengan createAsyncThunk
   - Dukungan untuk beberapa endpoint API
   - Normalisasi data untuk struktur yang konsisten

4. **Fitur Interaksi Pengguna**:

   - Simpan/batalkan simpan artikel
   - Fungsionalitas pencarian dengan berbagai jenis API
   - Penanganan kesalahan dan state loading

5. **Fitur Lanjutan**:

   - Dukungan paginasi untuk semua kategori berita
   - Bagian TimeWire untuk opsi filtering tambahan
   - Persistensi localStorage untuk artikel tersimpan

6. **Pola Manajemen State**:
   - Pemisahan kepentingan yang jelas
   - Penanganan operasi async yang konsisten (pending, fulfilled, rejected)
   - Normalisasi respons API

Implementasi ini mengikuti praktik terbaik Redux dengan pemisahan kepentingan yang bersih, penanganan kesalahan yang tepat, dan pembaruan state yang efisien. Ini memberikan fondasi yang kuat untuk mengelola data berita di seluruh aplikasi.
