# ETWMS — Enterprise Task & Workflow Management System

A full-stack web platform for organizations to manage teams, assign tasks, and track project progress. Built with the MERN stack, it supports three user roles — Admin, Manager, and Employee — each with distinct permissions and views, with real-time task notifications via Socket.IO.

🔗 **Live Demo:** [etwms.vercel.app](https://etwms.vercel.app)

---

## Project Structure

```
etwms/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/                 # Zustand state management
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                        # Express backend
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # API route handlers
│   ├── middleware/                 # Auth, RBAC, rate limiting
│   ├── app.js
│   └── package.json
├── API_CONTRACT.md                # Full API reference
├── package.json                   # Root — runs both client and server
├── .gitignore
└── README.md
```

---

## Overview

ETWMS is a full-stack task and workflow management system built for organizations to manage teams, assign tasks, and track project progress across all levels.

The platform implements **Role-Based Access Control (RBAC)** with JWT authentication, supporting three distinct user roles:

| Role | Permissions |
|---|---|
| **Admin** | Manages the entire organization — creates teams, manages users, oversees all projects |
| **Manager** | Creates projects, assigns tasks to employees, tracks team progress |
| **Employee** | Views assigned tasks, updates task status, tracks personal progress |

Real-time task notifications and live dashboard updates are powered by **Socket.IO**, keeping all users in sync across the organization instantly.

---

## Tech Stack

| Layer | Tools / Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios, Zustand, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Real-time | Socket.IO |
| Security | Helmet, rate limiting, morgan |

---

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/Venu-R/etwms.git
cd etwms
```

### 2. Set Up Environment Variables

Create a `.env` file inside the `server/` folder:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies

From the project root:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 4. Run in Development

From the project root:

```bash
npm run dev
```

This starts both:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

---

## Build for Production

```bash
cd client
npm run build
npm run preview
```

To run backend only:

```bash
cd server
npm run dev
# or
npm start
```

---

## Features

- JWT-based authentication with role-based access control (RBAC)
- Three role levels — Admin, Manager, Employee — each with distinct views and permissions
- Team creation and organization management
- Project and task assignment with status tracking
- Real-time task notifications and live dashboard updates via Socket.IO
- Dashboard metrics, activity logs, and progress tracking
- Light and dark theme support

---

## API Reference

All API endpoints and request/response payloads are documented in [`API_CONTRACT.md`](./API_CONTRACT.md).

---

## Author

**Venu R**
rvenu730@gmail.com

---
