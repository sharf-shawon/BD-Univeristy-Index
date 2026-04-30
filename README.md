# BD University Index

[![Sync and Deploy](https://github.com/sharfuddin-shawon/bd-university-index/actions/workflows/sync.yml/badge.svg)](https://github.com/sharfuddin-shawon/bd-university-index/actions/workflows/sync.yml)

A comprehensive data accessibility initiative focused on visualizing and streamlining official UGC (University Grants Commission) records of higher education institutions in Bangladesh. 

## 🌟 Overview

The **BD University Index** is a high-fidelity institutional registry designed to bridge the gap between official government data and public accessibility. By providing real-time institutional metrics, official domain verification, and advanced data visualization, we help students, researchers, and developers interact with Bangladesh's academic ecosystem with confidence.

### Key Features

- **✅ Official Verification:** Every institution is cross-referenced with the latest UGC Bangladesh datasets.
- **✉️ Domain Verification:** A built-in validator to confirm academic email addresses against official university domains (e.g., `name@du.ac.bd`).
- **📊 Advanced Analytics:** Interactive stats on university categories (Public, Private, International) and geographic distribution.
- **🏆 Global Rankings:** Integration of world-renowned ranking scores (QS, Webometrics) to provide global academic context.
- **🔍 Precision Search:** Advanced filtering by district, category, and ranking with real-time results.
- **🔌 Developer API:** Clean JSON endpoints for institutional data, enabling third-party integrations.

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend:** Node.js, Express (Custom API layer)
- **Data Engine:** TypeScript-based scraping and normalization engine
- **Deployment:** GitHub Actions for automated data synchronization and static site generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sharfuddin-shawon/bd-university-index.git
   cd bd-university-index
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔄 Automated Synchronization

The data is synchronized daily via GitHub Actions. The sync script:
1. Scrapes official data from the University Grants Commission of Bangladesh.
2. Normalizes institutional metadata (Vice Chancellor, Year of Establishment, District).
3. Cross-references world university rankings.
4. Updates the local `data/universities.json` repository.

## 📈 SEO & Performance

This project is built with SEO in mind, featuring:
- **SSR-ready Head Metadata:** Dynamic titles and descriptions for every university profile.
- **Schema.org Optimization:** Semantic HTML structure for better search engine indexing.
- **Static Site Generation:** Optimized build process for lightning-fast performance.

## 🤝 Contributing

Contributions are welcome! If you find any data inaccuracies or have feature suggestions, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

---

*Disclaimer: This is an independent data initiative and is not an official government directory. Data is sourced from public UGC records for maximum transparency.*
