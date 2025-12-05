# THE-WATCHLYST 🎬🍿

> A modern, personalized movie and series tracker built with Vue 3 and Firebase, allowing users to effortlessly organize and track their entertainment consumption.

## 🚀 Live Application

You can view the deployed application here: **[https://the-watchlyst.web.app/](https://the-watchlyst.web.app/)** ```

## 🌟 Overview

**THE-WATCHLYST** is a Single Page Application (SPA) designed to help users keep tabs on the movies and series they intend to watch, or have already watched. The application leverages the comprehensive **The Movie Database (TMDB) API** for movie data and relies on **Google Firebase** for secure user authentication and real-time data persistence.

## ✨ Features

* **🎬 TMDB Integration:** Seamlessly search and display detailed movie/series cards powered by The Movie Database API.
* **➕ Personalized Watchlist:** Users can add and remove items from a dynamic watchlist stored securely in Firebase Firestore.
* **✅ Status Tracking:** Easily mark movies or series as **Watched** or **Unwatched** to keep a clear history of consumption.
* **🔒 Firebase Authentication:** Secure user registration, login, and session management.
* **🔄 Real-time Sync:** Watchlist data is synchronized across devices using Firebase Firestore.
* **📌 Centralized State:** Predictable data flow and management handled by **Pinia** (the official Vue state management library).
* **🔔 Non-Intrusive Notifications:** User feedback (success/error messages) provided via modern toast notifications.

## 🛠️ Technology Stack

| Category       | Technology | Version | Description |
| -------------- | ---------- | ------- | ----------- |
| **Frontend**   | Vue.js     | `^3.5.13` | Progressive JavaScript Framework. |
| **Bundler**    | Vite       | `^6.3.1` | Next-Generation Frontend Tooling for rapid development. |
| **State Mgt.** | Pinia      | `^3.0.2` | Official state management for Vue.js. |
| **Routing**    | Vue Router | `^4.5.0` | Client-side routing for dynamic views. |
| **Backend/DB** | Firebase   | `^11.6.1` | Authentication and Firestore for data persistence. |
| **Utilities**  | date-fns   | `^4.1.0` | Used for handling and formatting dates/timestamps. |

## ⚙️ Local Setup and Installation

Follow these steps to get a copy of the project running on your local machine.

### Prerequisites

You must have the following software installed:

* **Node.js:** (LTS recommended)
* **npm** (comes with Node.js)

### Step 1: Clone the Repository

```bash
git clone [YOUR_GITHUB_REPO_URL]
cd THE-WATCHLYST
````

### Step 2: Install Dependencies

```bash
# Using npm
npm install
```

### Step 3: API and Firebase Configuration (Crucial)

This project requires both a TMDB API key and your Firebase configuration.

* **TMDB Key:** Obtain a free API key from The Movie Database (TMDB) developer site.
* **Firebase Config:** Get your API keys and configuration details from your Firebase project console (Project Settings > General > Your Apps).

Create a file named `.env` in the root directory and add the following keys. Do not modify the `VITE_` prefix, as this is required by Vite:

```env
# --- TMDB API ---
VITE_TMDB_API_KEY="[YOUR_TMDB_API_KEY_HERE]"

# --- FIREBASE CONFIG ---
VITE_API_KEY="AIzaSy...your...firebase...key"
VITE_AUTH_DOMAIN="[your-app-id].firebaseapp.com"
VITE_PROJECT_ID="[your-app-id]"
VITE_STORAGE_BUCKET="[your-app-id].appspot.com"
VITE_MESSAGING_SENDER_ID="[sender-id]"
VITE_APP_ID="1:1234567890:web:abcdef12345"   // <-- place actual value here
```

### Step 4: Run the Application

Start the development server:

```bash
npm run dev
```


### 📦 Deployment

The production build process is handled by Vite, generating static assets into the `/dist` directory.

```bash
npm run build
```

The application is hosted using Firebase Hosting and deployed via the Firebase CLI.


## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.
