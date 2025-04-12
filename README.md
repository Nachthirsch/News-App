# 📰 NewsApp - Your Gateway to Global News

<p align="center">
  <img src="https://i.imgur.com/SXHgDEO.png" alt="NewsApp Banner" width="800"/>
</p>

> A modern React application leveraging The New York Times Article Search API to deliver high-quality journalism with an elegant user experience.

<p align="center">
  <a href="#features">Features</a> •
  <a href="#technology-stack">Technology Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-features">API Features</a> •
  <a href="#ui-components">UI Components</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#author">Author</a>
</p>

## ✨ Features

### 🔍 Advanced Search

Find articles using keywords, date ranges, and multiple filters. Search by desk, section, author, and more using the powerful NYT Article Search API.

### 🌏 Indonesia Focus

Access curated international news with a special focus on Indonesia. Stay updated with the latest developments relevant to the region.

### 🔖 Save Articles

Bookmark your favorite articles to read later and create your personal news collection. Access your saved articles anytime, even offline.

### 🌓 Dark Mode Support

Enjoy a comfortable reading experience in any lighting condition with our built-in dark mode feature.

### 🎭 Interactive UI

Experience a modern and responsive interface with smooth animations and transitions powered by Framer Motion and React Spring.

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Redux-5.0.1-purple?logo=redux" alt="Redux" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.15-38B2AC?logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.4.3-ff69b4?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vite-5.4.10-646CFF?logo=vite" alt="Vite" />
</p>

- **React.js** - Frontend library for building user interfaces
- **Redux** - State management with Redux Toolkit
- **React Router** - Navigation and routing between different views
- **Tailwind CSS** - Utility-first CSS framework for modern designs
- **Framer Motion** - Animation library for creating fluid UI interactions
- **React Spring** - Physics-based animation library for natural motion
- **Axios** - HTTP client for API requests with caching capabilities
- **New York Times API** - Premium data source for comprehensive news coverage

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PNPM package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/News-Web-App.git
cd News-Web-App
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory and add your NYT API key:

```
VITE_API_KEY=your_nyt_api_key_here
VITE_BASE_URL=https://api.nytimes.com/svc/search/v2
```

4. **Start the development server**

```bash
pnpm dev
```

5. **Open your browser and navigate to** [http://localhost:5173](http://localhost:5173)

## 📱 Usage

### Navigation

Choose between Indonesia news or use the search function to find specific topics of interest.

### Discover

Browse through articles and use filters to find exactly what you're looking for. The app supports pagination to view more results.

### Save

Click the bookmark icon on any article to save it to your personal collection. Access your saved articles anytime, even when offline.

## 🔍 API Features

The application utilizes the New York Times Article Search API which offers:

- **Keyword Search**: Find articles matching specific keywords
- **Date Range Filtering**: Narrow down articles by publication date
- **Section Filtering**: Filter articles by NYT sections (Politics, Arts, Sports, etc.)
- **Type Filtering**: Filter by content type (News, Review, Op-Ed, etc.)
- **Pagination**: Navigate through large result sets

## 🎨 UI Components

### Hero Section

The app features a dynamic hero section with animated background gradients that adapt to your system's light/dark mode preference. The animation is built using React Spring for smooth, physics-based transitions.

### Article Cards

Each article is presented in a visually appealing card format with options to:

- Read the full article
- Save for later reading
- Share with others
- Listen to article content using text-to-speech

## 📋 Project Structure

## 👨‍💻 Author

Handra Putratama Tanjung - [GitHub](https://github.com/yourusername) | [LinkedIn](https://linkedin.com/in/yourusername)

## 📝 License

This project was created as a capstone project for the MSIB Studi Independen program with Hacktiv8 "ReactJS For Front End Website Developer".

## 🙏 Acknowledgements

- New York Times API for providing access to high-quality journalism
- React Icons for the icon sets
- Tailwind CSS for the styling utilities
- Framer Motion for animations
- React Spring for physics-based animations
- Hacktiv8 for the educational program
