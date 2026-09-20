# Complaint Management and Smart City Portal

A production-ready MERN stack portal for civic complaint submission, officer resolution workflows, admin management, analytics, Cloudinary proof images, timeline tracking, and citizen feedback.

## Features

- JWT authentication with `user`, `admin`, and `officer` roles
- Citizen complaint submission with optional Cloudinary image proof
- Tracking IDs like `CMP-2026-100001`
- Public complaint tracking
- Admin dashboard with complaint/user management
- Officer dashboard scoped only to assigned complaints
- Complaint timeline for every status update
- Resolved complaint feedback with one-time rating and comment
- Admin analytics charts for category, status, and monthly complaints
- Responsive Bootstrap 5 frontend with professional public pages

## Tech Stack

- Frontend: React, Vite, Bootstrap 5, Recharts, Lucide React
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas or local MongoDB
- Auth: JWT
- Uploads: Cloudinary, Multer
- Deployment: Render Web Service and Render Static Site

## Folder Structure

```text
smart-city-complaint-portal/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    uploads/
    server.js
    package.json
    .env.example
  frontend/
    public/
    src/
      api/
      components/
      context/
      pages/
      routes/
      utils/
    index.html
    package.json
    .env.example
```

## Environment Variables

Backend `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_city_complaints
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
ADMIN_NAME=Smart City Admin
ADMIN_EMAIL=nishant805180@gmail.com
ADMIN_MOBILE=6200576221
ADMIN_PASSWORD=@sandip2028
```

Frontend `frontend/.env`:

```env
VITE_API_URL=http://localhost:27010/api
```

## Local Setup

Create backend environment file:

```bash
cd backend
copy .env.example .env
```

Update `backend/.env` with your MongoDB URI, JWT secret, Cloudinary keys, and `FRONTEND_URL=http://localhost:5173`.

Install backend dependencies:

```bash
cd backend
npm install
```

Create frontend environment file:

```bash
cd frontend
copy .env.example .env
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run backend:

```bash
cd backend
npm run dev
```

Run frontend:

```bash
cd frontend
npm run dev
```

Open the frontend at `http://localhost:5173`.

Backend health check:

```http
GET http://localhost:5000/api/health
```

Create or update the first admin:

```bash
cd backend
npm run seed:admin
```

## Render Deployment Guide

Backend Render Web Service:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add backend environment variables from `backend/.env.example`
- Set `FRONTEND_URL` to your deployed Render frontend URL

Frontend Render Static Site:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add `VITE_API_URL=https://your-backend-service.onrender.com/api`

CORS:

- The backend reads `FRONTEND_URL`
- Set it exactly to the Render frontend URL, for example `https://smart-city-portal.onrender.com`

## Admin Login Creation Guide

Public registration always creates a citizen `user` account. This prevents users from creating their own admin or officer access.

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, and `ADMIN_MOBILE` in `backend/.env`, then run `npm run seed:admin` inside `backend`. After login, create officers from `Admin > Manage Users`.

## Cloudinary Notes

Complaint proof images are optional. Supported formats are `jpg`, `jpeg`, `png`, and `webp`, with a maximum size of 5MB. If Cloudinary variables are missing, complaint creation without images still works.
