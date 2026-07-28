# Privora

**An end‑user data protection platform** providing file encryption, access logging, rule‑based threat detection, and a dynamic privacy score. Targeted at individual Nigerian users subject to the **Nigeria Data Protection Act 2023** and the upcoming **GAID 2025** framework.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Security Notes](#security-notes)
- [Testing](#testing)
- [Known Limitations / Out of Scope](#known-limitations--out-of-scope)
- [Project Structure](#project-structure)

---

## Project Overview

Privora lets users securely store files in an encrypted vault, monitors all interactions, and calculates a **Data Protection Score** that reflects the user's privacy hygiene. The platform consists of a **Django REST Framework** backend and a **React + Vite** frontend that communicate over a JWT‑protected REST API.

---

## Architecture

```
+-------------------+        +-------------------+
|   React/Vite UI   | <----> |   Django REST API |
+-------------------+        +-------------------+
        ^                           ^
        | JWT (access/refresh)      |
        +---------------------------+
```

| Django App | Responsibility |
|------------|-----------------|
| `users` | Registration, login/logout, JWT issuance, user settings, email login notifications |
| `encryption` | AES‑256‑CBC file vault (upload, list, retrieve, delete) |
| `audit` | Access logging (`AuditLog`) and rule‑based alerting (`AuditAlert`) |
| `privacy` | User privacy‑toggle settings and dynamic Data Protection Score |
| `core` | Scaffold app (currently unused) |

### Dependency Versions

| Component | Version |
|-----------|---------|
| Django | 6.0.7 |
| djangorestframework | 3.17.1 |
| djangorestframework‑simplejwt | 5.5.1 |
| django‑cors‑headers | 4.9.0 |
| asgiref | 3.12.1 |
| pycryptodome | 3.23.0 |
| python‑dotenv | 1.2.2 |
| tzdata | 2026.3 |
| Frontend (npm) | |
| react | ^19.2.4 |
| react‑dom | ^19.2.4 |
| axios | ^1.15.0 |
| react‑router‑dom | ^7.14.1 |
| tailwindcss | ^4.2.2 |

---

## Features

- **JWT‑based authentication** – access + refresh tokens, rotation on refresh, blacklist on logout.
- **AES‑256‑CBC file encryption** with PBKDF2‑HMAC‑SHA256 (600 000 iterations); per‑file random `salt` and `iv` are stored, the password is never persisted.
- **Real‑time access logging** – every login, logout, file upload/download/delete, and settings change creates an `AuditLog` entry.
- **Rule‑based anomaly & breach alerting** – thresholds are defined in `backend/audit/rules.py` (e.g., >5 failed logins in 15 min → high severity). Alerts are stored in `AuditAlert` and high‑severity alerts automatically blacklist existing JWT refresh tokens.
- **Dynamic Data Protection Score** – calculated in `backend/privacy/scoring.py` from privacy toggles, 2FA flag, encrypted‑asset presence, and unresolved alerts.
- **Email login notifications** – dispatched by `backend/users/notifications.py` when a new successful login occurs (respecting the user’s `login_notifications` preference).
- **Full React UI** – Landing, Register, Login, Dashboard (shows score & key stats), My Data (vault UI), Access Logs, Settings.

---

## Getting Started

### Prerequisites
- Python 3.12 (project generated with Django 6.0.4)
- Node 20 (compatible with Vite 8)
- SQLite 3 (default dev database)

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-org/privora.git
cd privora/backend

# Create a virtual environment
python -m venv .venv
# On Windows
.venv\\Scripts\\activate

# Install Python dependencies
pip install -r requirements.txt

# Copy the example env file and adjust values as needed
cp .env.example .env
# Edit .env to set a strong SECRET_KEY and any email configuration you need

# Apply database migrations
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```
The API will be reachable at `http://127.0.0.1:8000/`.

### Frontend Setup
```bash
cd ../../frontend
npm install
npm run dev
```
The Vite dev server runs on `http://localhost:5173`. The Axios instance (`frontend/src/api/axiosInstance.js`) is currently hard‑coded to `http://127.0.0.1:8000` as the backend URL.

---

## Environment Variables
| Variable | Purpose | Default | Required? |
|----------|---------|---------|-----------|
| `SECRET_KEY` | Django secret key (used for signing cookies & JWT) | `unsafe-default-key` (dev only) | **Yes** for production |
| `DEBUG` | Enable Django debug mode | `True` | No |
| `EMAIL_BACKEND` | Email backend class | `django.core.mail.backends.console.EmailBackend` | No |
| `EMAIL_HOST` | SMTP host | `` (empty) | No |
| `EMAIL_PORT` | SMTP port | `587` | No |
| `EMAIL_HOST_USER` | SMTP username | `` | No |
| `EMAIL_HOST_PASSWORD` | SMTP password | `` | No |
| `EMAIL_USE_TLS` | Use TLS for SMTP | `True` | No |
| `DEFAULT_FROM_EMAIL` | Default “From” address for outgoing mail | `Privora <no-reply@privora.local>` | No |

---

## API Reference
All endpoints are prefixed with `/api/` as defined in `privora_project/urls.py`.

### Users (`/api/users/`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `register/` | No | Register a new user and return JWT pair |
| POST | `login/` | No | Authenticate and return JWT pair; creates an `AuditAlert` for each login |
| POST | `logout/` | Yes | Blacklist the refresh token and log the logout |
| GET | `me/` | Yes | Retrieve current user details |
| GET/PATCH | `settings/` | Yes | View or update `UserSettings` |
| POST | `token/refresh/` | No | Refresh an access token |

### Encryption (`/api/encryption/`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `assets/` | Yes | List the authenticated user’s encrypted assets |
| POST | `upload/` | Yes | Upload a file, encrypt it with the supplied password |
| DELETE | `assets/<uuid:pk>/` | Yes | Delete the specified encrypted asset |
| POST | `assets/<uuid:pk>/retrieve/` | Yes | Decrypt and download the specified asset |

### Audit (`/api/audit/`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `logs/` | Yes | Paginated list of `AuditLog` entries for the user |
| GET | `alerts/` | Yes | List all `AuditAlert` objects for the user |
| PATCH | `alerts/<int:pk>/resolve/` | Yes | Mark the specified alert as resolved |

### Privacy (`/api/privacy/`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `settings/` | Yes | Retrieve the user’s `PrivacySettings` |
| GET | `score/` | Yes | Compute and return the current Data Protection Score |

---

## Data Model
### `users`
| Model | Fields |
|-------|--------|
| **User** | `email` (unique), `full_name`, `encryption_salt`, `is_2fa_enabled`, `is_active`, `is_staff`, `date_joined` |
| **UserSettings** | `user` (OneToOne), `login_notifications`, `third_party_access`, `session_timeout_mins`, `data_retention_days`, `created_at`, `updated_at` |

### `encryption`
| Model | Fields |
|-------|--------|
| **EncryptedAsset** | `id` (UUID), `user` (FK), `name`, `file_size`, `storage_path`, `salt`, `iv`, `created_at` |

### `audit`
| Model | Fields |
|-------|--------|
| **AuditLog** | `user` (FK), `action`, `ip_address`, `data_item`, `status`, `timestamp`, `metadata` (JSON) |
| **AuditAlert** | `user` (FK), `title`, `description`, `severity` (`low`/`medium`/`high`), `resolved`, `created_at` |

### `privacy`
| Model | Fields |
|-------|--------|
| **PrivacySettings** | `user` (OneToOne), `tracking_protection`, `data_sharing`, `ad_blocking`, `cookie_control`, `location_masking`, `fingerprint_defense`, `updated_at` |

---

## Security Notes
- **Password handling** – Encryption password is never stored. Only per‑file `salt` and `iv` are persisted.
- **SECRET_KEY fallback** – `unsafe-default-key` is used for development. Production must set a secure key.
- **Alert thresholds** – Configurable in `backend/audit/rules.py`.
- **Token blacklisting** – High‑severity alerts auto‑blacklist refresh tokens.

---

## Testing
```bash
# Run the full Django test suite
python manage.py test

# Run tests for a specific app, e.g.:
python manage.py test users
python manage.py test encryption
python manage.py test audit
python manage.py test privacy
```
The frontend currently has no configured test suite.

---

## Known Limitations / Out of Scope
- **Two‑factor authentication** – Models exist but logic is not implemented.
- **`core` app** – Scaffolded but unused.
- **Frontend tests** – None configured.
- **API URL** – Hard‑coded in frontend.

---

## Project Structure
```
privora/
├─ backend/
│  ├─ .env.example
│  ├─ .gitignore
│  ├─ manage.py
│  ├─ db.sqlite3
│  ├─ requirements.txt
│  ├─ audit/
│  │  ├─ models.py
│  │  ├─ views.py
│  │  ├─ urls.py
│  │  └─ rules.py
│  ├─ core/
│  │  └─ models.py
│  ├─ encryption/
│  │  ├─ models.py
│  │  ├─ views.py
│  │  ├─ urls.py
│  │  └─ crypto.py
│  ├─ privacy/
│  │  ├─ models.py
│  │  ├─ views.py
│  │  ├─ urls.py
│  │  └─ scoring.py
│  ├─ privora_project/
│  │  ├─ settings.py
│  │  └─ urls.py
│  └─ users/
│     ├─ models.py
│     ├─ views.py
│     ├─ urls.py
│     ├─ serializers.py
│     ├─ notifications.py
│     └─ tests.py
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   └─ src/
       ├─ App.jsx
       ├─ index.css
       ├─ main.jsx
       ├─ api/
       │   └─ axiosInstance.js
       ├─ components/
       ├─ context/
       └─ pages/
           ├─ AccessLogs.jsx
           ├─ Dashboard.jsx
           ├─ Landing.jsx
           ├─ Login.jsx
           ├─ MyData.jsx
           ├─ Register.jsx
           └─ Settings.jsx
```

---

*Generated on 2026‑07‑29.*
