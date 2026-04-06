# TaskFlow React Migration

This project has been migrated from an EJS server-rendered frontend to a React SPA while keeping the Express + MongoDB backend intact as the API and data layer.

## Project Structure

```text
task-management-webapp/
├── backend/   # Express + MongoDB + Mongoose API
├── frontend/  # React + Vite SPA
└── .gitignore
```

## Backend API

The backend now exposes JSON APIs while preserving the same board, list, and task behaviors:

- `GET /api/health`
- `GET /api/boards`
- `GET /api/boards/:boardId`
- `POST /api/boards`
- `DELETE /api/boards/:boardId`
- `POST /api/boards/:boardId/lists`
- `DELETE /api/boards/:boardId/lists/:listId`
- `POST /api/lists/:listId/tasks`
- `PATCH /api/lists/:listId/tasks/:taskId`
- `DELETE /api/lists/:listId/tasks/:taskId`

## Frontend

The new frontend uses:

- React with Vite
- React Router
- Functional components and hooks
- Fetch-based API services
- Environment-based API URL via `VITE_API_BASE_URL`
- Loading and error states

## Run the Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

## Run the Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

The Vite dev server proxies `/api` requests to the backend.

## Run Both Together

Install dependencies once in each location:

```bash
cd backend
npm install

cd ..\frontend
npm install

cd ..
npm install
```

Then from the project root run:

```bash
npm run dev
```

This starts:

- backend on `http://localhost:5000`
- frontend on `http://localhost:5173`

## Production

Build the frontend first:

```bash
cd frontend
npm install
npm run build
```

Then start the backend:

```bash
cd backend
npm install
npm start
```

If `frontend/dist` exists, the backend serves the React build directly.
