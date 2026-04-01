# Todo Java Monorepo

Monorepo skeleton for a Todo application with a React/Vite frontend and a Spring Boot/MyBatis backend.

## Structure

- `frontend/`: React + Vite + TypeScript app shell
- `backend/`: Spring Boot backend with MyBatis, JWT auth, and Todo APIs
- `docs/superpowers/specs/`: design documents
- `docs/superpowers/plans/`: implementation plans

## Quick Start

### Backend

Set a JWT secret before starting the backend. The application now fails fast at startup if `JWT_SECRET` is missing.

```bash
export JWT_SECRET="replace-with-at-least-32-characters"
mvn -f backend/pom.xml spring-boot:run
```

The backend listens on `http://localhost:8080` by default and uses an in-memory H2 datasource in MySQL compatibility mode unless you override the datasource properties. The H2 console is disabled by default.

### Frontend

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

The Vite dev server proxies `/api` requests to `http://localhost:8080`, so local frontend development works against the backend without changing the client base URL.
