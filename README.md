# Task Management Webapp

This project is now a single Express application that uses:

- Node.js + Express
- MongoDB + Mongoose
- EJS for server-rendered views
- Tailwind CSS for styling

## What changed

The original repository had a split setup:

- `main` contained Express + MongoDB API code
- `frontend` only added static styling files on top of the React client

That created a few problems:

- the frontend and backend were still separated
- the styled UI in `frontend` was not actually connected to the task data
- data flow depended on client-side API requests instead of server-rendered pages
- models stored relationships as plain strings instead of Mongoose references
- auth files existed but were incomplete and not connected to the rest of the app

This version combines everything into one beginner-friendly server-rendered app.

## Folder structure

```text
task-management-webapp/
|-- app.js
|-- server.js
|-- package.json
|-- .env.example
|-- tailwind.config.js
|-- config/
|   `-- database.js
|-- controllers/
|   |-- boardController.js
|   |-- homeController.js
|   |-- listController.js
|   `-- taskController.js
|-- middleware/
|   |-- asyncHandler.js
|   |-- errorHandler.js
|   `-- flashMiddleware.js
|-- models/
|   |-- Board.js
|   |-- List.js
|   `-- Task.js
|-- public/
|   `-- css/
|       `-- styles.css
|-- routes/
|   |-- boardRoutes.js
|   |-- homeRoutes.js
|   |-- listRoutes.js
|   `-- taskRoutes.js
|-- src/
|   `-- styles.css
`-- views/
    |-- error.ejs
    |-- boards/
    |   `-- index.ejs
    `-- partials/
        |-- empty-state.ejs
        |-- flash.ejs
        |-- foot.ejs
        `-- head.ejs
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
copy .env.example .env
```

3. Make sure MongoDB is running locally.

4. Build Tailwind CSS:

```bash
npm run build:css
```

5. Start the app:

```bash
npm run dev
```

Then open [http://localhost:5000](http://localhost:5000).

## Environment variables

- `PORT` - Express server port
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - session secret used for flash messages

## Main routes

- `GET /` redirect to boards dashboard
- `GET /boards` show all boards
- `GET /boards/:boardId` show one board with its lists and tasks
- `POST /boards` create a board
- `DELETE /boards/:boardId` delete a board and its related data
- `POST /boards/:boardId/lists` create a list
- `DELETE /boards/:boardId/lists/:listId` delete a list and its tasks
- `POST /lists/:listId/tasks` create a task
- `PATCH /lists/:listId/tasks/:taskId` toggle task completion
- `DELETE /lists/:listId/tasks/:taskId` delete a task
