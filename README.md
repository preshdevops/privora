# Privora — Personal Data Protection Vault & Audit Ledger

Privora is an end-to-end personal data protection platform providing zero-knowledge client-isolated file encryption, an authentic security audit ledger, rule-based anomaly detection, and a dynamic privacy hygiene index. Built for compliance under the **Nigeria Data Protection Act (NDPA) 2023** and international data protection standards (GDPR).

Designed around **"The Ledger Vault"** identity — an editorial aesthetic using Newsreader serif typography, Work Sans, warm paper & ink-navy tones, and the canonical **Privora Seal** mark.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Visual System & Brand Mark](#visual-system--brand-mark)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Django)](#backend-setup-django)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Deployment (Render & Vercel)](#deployment-render--vercel)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security Model & Cryptography](#security-model--cryptography)
- [Testing](#testing)
- [License](#license)

---

## Project Overview

Privora lets users securely store files in an encrypted vault, monitors all access interactions in an immutable audit ledger, and calculates a real-time **Data Protection Score** reflecting privacy hygiene.

The platform consists of:
- **Backend**: Django REST Framework API with PostgreSQL, SimpleJWT authentication, PyCryptodome AES-256 encryption, and WhiteNoise static asset serving.
- **Frontend**: React (Vite) Single Page Application styled with Tailwind CSS, Framer Motion animations, and the Privora Seal vector identity system.

---

## Architecture & Tech Stack

```
+--------------------------+        +--------------------------+
|  React (Vite) Frontend   | <----> |   Django 6 REST API      |
|  Hosted on Vercel        |  JWT   |   Hosted on Render/Railway|
+--------------------------+        +--------------------------+
             |                                    |
     Axios Auto-Refresh                   PostgreSQL / SQLite
     Token Interceptor                    WhiteNoise Static
```

### Stack & Dependencies

| Component | Technology / Library | Version / Details |
|-----------|----------------------|-------------------|
| **Backend Framework** | Django | `6.0.7` |
| **REST API** | Django REST Framework | `3.17.1` |
| **Authentication** | DRF SimpleJWT | `5.5.1` (Token rotation + Blacklist) |
| **Database** | PostgreSQL / SQLite | `dj-database-url`, `psycopg2-binary` |
| **WSGI / Static** | Gunicorn + WhiteNoise | `gunicorn`, `whitenoise` |
| **Cryptography** | PyCryptodome | `3.23.0` (AES-256-CBC + PBKDF2) |
| **Frontend Framework** | React + Vite | `^19.2.4`, Vite `8.0.8` |
| **Routing** | React Router DOM | `^7.14.1` |
| **Styling & Fonts** | Tailwind CSS, Newsreader, Work Sans | Newsreader Serif, Work Sans |
| **Animations** | Framer Motion | Spring physics & SealStamp motion |

---

## Visual System & Brand Mark

Privora follows **"The Ledger Vault"** concept — conveying calm authority, deliberate protection, and paper-like editorial clarity:

- **Canonical Mark (`PrivoraSeal.jsx`)**: Built from an outer solid ring + dashed inner ring (wax seal impression) + interior P-ascender keyhole glyph.
  - **Full Variant**: Used in hero banners and authentication panels.
  - **Glyph Variant**: Used as tab favicon (`public/favicon.svg`) and sidebar brand icon.
  - **Outline Variant**: Used as quiet low-opacity background watermarks and empty state anchors.
- **Color System**: Ink-Navy (`#14171F`) base, warm paper (`#F6F1E7`), and a single restrained brass accent (`#C9A15A`) reserved for primary CTAs and official completion beats.
- **Zero Raster Assets**: 100% vector SVG line-art system — zero photorealistic PNG/JPEG renders.

---

## Key Features

- **Client-Isolated AES-256 File Vault**: PBKDF2-HMAC-SHA256 key derivation (600,000 iterations). Master passphrases are never stored; only per-file random `salt` and `iv` are persisted.
- **Signature Seal Stamp Motion (`SealStamp.jsx`)**: An unhurried spring impact animation for significant completion beats (file protected, login granted, onboarding complete).
- **In-Place Ledger Accordion Expansion**: Ledger rows across Dashboard, Protected Files, and Access Logs expand directly in-place to show technical metadata without popping modals or navigating away.
- **Automatic JWT Refresh Interceptor**: `axiosInstance.js` automatically catches `401 Unauthorized` responses and refreshes access tokens via `/api/users/token/refresh/` seamlessly without disrupting active user sessions.
- **Non-Blocking Asynchronous Email Alerts**: SendLib email notifications run on background threads (`threading.Thread`), preventing login delays when external email services are slow.
- **Rule-Based Threat Detection**: Automatic anomaly scoring and alert creation (e.g. >5 failed logins in 15 mins). High-severity alerts auto-blacklist active refresh tokens.
- **Dynamic Privacy Hygiene Index**: Calculated score reflecting active security toggles, 2FA status, encrypted asset presence, and unresolved alerts.

---

## Getting Started

### Prerequisites
- **Python 3.12+**
- **Node.js 20+** (npm 10+)
- **Git**

---

### Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables template
cp .env.example .env

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run local development server
python manage.py runserver
```
The Django REST API will run at `http://127.0.0.1:8000/`.

---

### Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend dev server runs at `http://localhost:5173`.

---

## Deployment (Render & Vercel)

### Backend Deployment (Render / Railway)
1. Set build command: `./build.sh` (or `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`)
2. Set start command: `gunicorn privora_project.wsgi:application`
3. Configure Environment Variables:
   - `DATABASE_URL` (injected automatically by PostgreSQL add-on)
   - `ALLOWED_HOSTS` = `your-render-backend-url.onrender.com`
   - `CORS_ALLOWED_ORIGINS` = `https://your-vercel-app-url.vercel.app`
   - `SECRET_KEY` = `your-production-secret-key`

### Frontend Deployment (Vercel)
1. Root directory: `./frontend` (or repository root)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Configure Environment Variable:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com`
5. `vercel.json` provides client-side SPA routing rewrites to `/index.html`.

---

## Environment Variables

| Variable | Purpose | Default / Production |
|----------|---------|----------------------|
| `SECRET_KEY` | Django cryptographic signing key | Set strong secret in production |
| `DEBUG` | Django debug mode | `False` in production |
| `DATABASE_URL` | PostgreSQL connection string | Injected by host |
| `ALLOWED_HOSTS` | Allowed host headers | Host domain |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | Vercel domain |
| `VITE_API_URL` | Frontend API endpoint | Render backend URL |

---

## API Reference

All endpoints are prefixed with `/api/`.

### Users (`/api/users/`)
- `POST /register/` — Register user & return initial JWT pair
- `POST /login/` — Authenticate user & return JWT pair
- `POST /logout/` — Blacklist refresh token & log exit
- `GET /me/` — Retrieve user profile
- `POST /token/refresh/` — Obtain new access token using refresh token

### Encryption (`/api/encryption/`)
- `GET /assets/` — List user's encrypted file entries
- `POST /upload/` — Encrypt and store file entry
- `POST /assets/<id>/retrieve/` — Decrypt and download file entry
- `DELETE /assets/<id>/` — Purge file entry from ledger

### Audit (`/api/audit/`)
- `GET /logs/` — Paginated list of audit ledger entries
- `GET /alerts/` — List security alerts
- `PATCH /alerts/<id>/resolve/` — Mark alert resolved

### Privacy (`/api/privacy/`)
- `GET /settings/` — Retrieve privacy toggles
- `GET /score/` — Compute current Data Protection Score

---

## Security Model & Cryptography

- **Zero-Knowledge Passphrase Architecture**: File encryption keys are generated client-side/in-memory using PBKDF2-HMAC-SHA256 with 600,000 iterations and random per-file salts. User passphrases are never stored on the server.
- **JWT Token Rotation & Blacklisting**: Refresh tokens rotate upon refresh and are blacklisted upon logout or high-severity anomaly detection.
- **Background Async Threading**: Email notifications run asynchronously on daemon threads, isolating authentication performance from third-party network latency.

---

## Testing

```bash
# Run Django test suite
cd backend
python manage.py test

# Test specific applications
python manage.py test users
python manage.py test encryption
python manage.py test audit
python manage.py test privacy
```

---

## License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

```text
Copyright (c) 2026 Precious Olonade & Privora Contributors
```
