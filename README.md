# ETWMS

Enterprise Task and Workflow Management System.

This is a full-stack app for admin, manager, and employee workflows.

## What this project does

- Authentication with role-based access (admin, manager, employee)
- Team management
- Project and task management
- Employee task tracking and status updates
- Dashboard metrics and activity logs
- Real-time events with Socket.IO
- Light and dark theme support on the frontend

## Tech stack

Frontend:
- React + Vite
- Tailwind CSS
- Axios
- Zustand
- Socket.IO client
- Recharts

Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- Socket.IO
- Helmet, rate limiting, morgan

## Project structure

- client: React frontend
- server: Express backend
- API_CONTRACT.md: API reference

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

## Environment variables (server)

Create a .env file inside server folder with:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

Notes:
- CLIENT_URL should match your frontend URL.
- MONGODB_URI must be valid before starting the backend.

## Install dependencies

From project root (etwms):

npm install
cd client && npm install
cd ../server && npm install

## Run in development

From project root (etwms):

npm run dev

This starts both:
- backend on port 5000
- frontend on Vite default port (usually 5173)

## Build frontend

From client folder:

npm run build
npm run preview

## Run backend only

From server folder:

npm run dev

or

npm start

## API base URL used by frontend

Current frontend API target:
- http://localhost:5000/api

If deploying, switch this to an environment-based value.

## Deployment summary

1. Deploy backend first (set env vars and MongoDB URI).
2. Deploy frontend next.
3. Point frontend API base URL to deployed backend.
4. Update backend CLIENT_URL to deployed frontend URL.

## Common issues

Server does not start:
- Check MONGODB_URI and JWT_SECRET in server .env

CORS errors:
- Verify CLIENT_URL in server .env matches frontend URL

Login works but wrong page behavior:
- Make sure selected role matches account role on sign-in

## Notes

- API endpoints and payloads are documented in API_CONTRACT.md
- Main branch is the active, cleaned branch for this repo
