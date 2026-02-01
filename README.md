# College Placement Portal

A minimal full-stack placement portal: React + Node/Express + MongoDB + JWT.

## Setup

1. **MongoDB**: Run MongoDB locally (e.g. `mongod`) or set `MONGO_URI` in backend `.env`.

2. **Backend**
   ```bash
   cd backend
   cp .env.example .env   # edit MONGO_URI and JWT_SECRET
   npm install
   npm start
   ```
   Server runs on http://localhost:5001.

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on http://localhost:5173 (proxies `/api` to backend).

## Roles

- **Student**: Register, profile, view jobs, apply, track applications.
- **Recruiter**: Register, profile (pending approval), post jobs, view applicants, shortlist/reject.
- **Admin**: Approve recruiters, view stats.

## API (summary)

- `POST /api/auth/register` – body: `{ email, password, role }`
- `POST /api/auth/login` – body: `{ email, password }` → `{ token, user }`
- `GET/PUT /api/students/profile` – student only
- `GET/PUT /api/recruiters/profile` – recruiter only
- `GET /api/recruiters/pending` – admin; `PUT /api/recruiters/:id/approve` – admin
- `POST /api/jobs`, `GET /api/jobs`, `GET /api/jobs/:id`, `GET /api/jobs/:id/applications` – jobs and applicants
- `POST /api/applications` – body: `{ jobId }` – student apply
- `PUT /api/applications/:id/status` – body: `{ status: "shortlisted"|"rejected" }` – recruiter
- `GET /api/students/applications` – my applications (student)
- `GET /api/admin/stats` – admin

Send `Authorization: Bearer <token>` for protected routes.
