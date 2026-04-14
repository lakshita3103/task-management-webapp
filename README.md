# TaskFlow

TaskFlow is a full-stack task management app with a React frontend and an Express + MongoDB backend. The backend is configured to use MongoDB Atlas through the `MONGODB_URI` environment variable so the shared database can be accessed by teammates and users from any device.

## Project Structure

```text
task-management-webapp/
|-- backend/   # Express + MongoDB Atlas + Mongoose API
|-- frontend/  # React + Vite SPA
`-- .gitignore
```

## Backend API

The backend exposes JSON APIs for authentication and task management:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/boards`
- `GET /api/boards/:boardId`
- `POST /api/boards`
- `DELETE /api/boards/:boardId`
- `POST /api/boards/:boardId/lists`
- `DELETE /api/boards/:boardId/lists/:listId`
- `POST /api/lists/:listId/tasks`
- `PATCH /api/lists/:listId/tasks/:taskId`
- `DELETE /api/lists/:listId/tasks/:taskId`

## MongoDB Atlas Setup

1. Ask the project owner for the MongoDB Atlas connection string for this project.
2. In Atlas, make sure the project owner has created a database user with access to the TaskFlow cluster.
3. In Atlas Network Access, whitelist either:
   - `0.0.0.0/0` for open development access, or
   - each teammate's public IP address for tighter security
4. Copy `backend/.env.example` to `backend/.env`.
5. Replace the placeholder `MONGODB_URI` value in `backend/.env` with the Atlas URI shared by the project owner.

Example format:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/taskflow?retryWrites=true&w=majority&appName=TaskFlow
```

Important notes:

- `backend/.env` is ignored by Git so credentials are not committed.
- Keep the database name in the Atlas URI aligned with the shared TaskFlow database.
- If the backend logs a connection failure, first verify the URI, user credentials, and Atlas IP whitelist entries.

## Run the Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000` after the Atlas connection is established successfully.

## Run the Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

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

## Production Notes

- Set a production-ready `MONGODB_URI` in the deployment environment.
- Set a strong `JWT_SECRET` outside source control.
- Build the frontend before starting the backend in production.

```bash
cd frontend
npm install
npm run build

cd ..\backend
npm install
npm start
```

If `frontend/dist` exists, the backend serves the React build directly.
