# Aryan Sharma - 3D Interactive Portfolio

A visually stunning, interactive 3D portfolio website built with HTML/CSS/JS, Three.js, and backed by a custom Node.js/Express backend API and Supabase database.

![Portfolio Preview](./public/background1.jpg) <!-- Update with actual preview image if needed -->

## 🌟 Features

*   **Immersive 3D Experience:** Uses `Three.js` to render interactive, floating geometric elements and dynamic camera movements.
*   **Modern UI/UX:** Glassmorphism design, custom cursors, smooth scroll animations, and a seamless Dark/Light mode toggle.
*   **Fully Functional Contact Form:** Connected to a Node.js API that sends emails instantly via Nodemailer.
*   **Secure Admin Dashboard:** A protected Vue.js + Tailwind CSS control panel (`/admin`) to manage portfolio content (Projects, Skills, Certificates).
*   **Supabase Integration:** Uses `@supabase/supabase-js` for robust, scalable data storage for dynamic portfolio content.
*   **Render Ready:** Configured with `render.yaml` for one-click deployment.

## 🛠️ Tech Stack

**Frontend (Public):**
*   HTML5 / CSS3 (Vanilla, Custom properties, Flexbox/Grid)
*   Vanilla JavaScript
*   [Three.js](https://threejs.org/) (WebGL 3D rendering)

**Backend (API & Admin):**
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Supabase](https://supabase.com/) (PostgreSQL Database)
*   [Nodemailer](https://nodemailer.com/) (Email transport)
*   [Vue.js 3](https://vuejs.org/) & [Tailwind CSS](https://tailwindcss.com/) (Admin Dashboard UI)

## 🚀 Getting Started Locally

### Prerequisites
*   Node.js (v18 or higher)
*   A Supabase Project
*   An SMTP Email account (e.g., Gmail App Passwords)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/geniusnobita45/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Fill in your `.env` file with your specific credentials (Supabase keys, SMTP settings, and a secure `ADMIN_TOKEN`).

4. **Database Setup (Supabase):**
   Run the following SQL in your Supabase SQL Editor to create the required tables:
   ```sql
   CREATE TABLE projects ( id UUID DEFAULT gen_random_uuid() PRIMARY KEY, title TEXT NOT NULL, description TEXT, image_url TEXT, tech_stack TEXT[], live_url TEXT, github_url TEXT, sort_order INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT now() );
   CREATE TABLE skills ( id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, category TEXT, proficiency INT DEFAULT 0, icon_url TEXT, sort_order INT DEFAULT 0 );
   CREATE TABLE certificates ( id UUID DEFAULT gen_random_uuid() PRIMARY KEY, title TEXT NOT NULL, issuer TEXT, date TEXT, credential_url TEXT, image_url TEXT, sort_order INT DEFAULT 0 );
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`.

## 📂 Project Structure

```text
portfolio/
├── public/                 # Static frontend files (HTML, CSS, JS, Images, Three.js logic)
├── src/                    # Backend source code (TypeScript)
│   ├── middleware/         # Express middlewares (Auth, Error handling)
│   ├── models/             # Database clients (Supabase)
│   ├── routes/             # API endpoints (Contact, Portfolio, Admin CRUD)
│   ├── services/           # External services (Mailer)
│   └── views/              # HTML templates for the Admin UI (Login, Dashboard)
├── .env.example            # Environment variable template
├── render.yaml             # Render deployment blueprint
├── Dockerfile              # Docker container configuration
└── tsconfig.json           # TypeScript configuration
```

## 🌐 Deployment (Render)

This project is configured for easy deployment on [Render](https://render.com).

1. Connect your GitHub repository to Render as a **Blueprint**.
2. Render will automatically detect the `render.yaml` file.
3. Provide the required Environment Variables in the Render dashboard.
4. Render will automatically build the TypeScript backend and serve both the API and the static frontend!

## 🧑‍💻 Author

**Aryan Sharma**
*   GitHub: [@geniusnobita45](https://github.com/geniusnobita45)
