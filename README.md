# Todo Java Monorepo

Monorepo skeleton for a Todo application with a React/Vite frontend and a Spring Boot/MyBatis backend.

## Structure

- `frontend/`: React + Vite + TypeScript app shell
- `backend/`: Spring Boot backend with MyBatis, JWT auth, and Todo APIs
- `docs/superpowers/specs/`: design documents
- `docs/superpowers/plans/`: implementation plans

## Quick Start

### Frontend

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

### Backend

```bash
mvn -f backend/pom.xml spring-boot:run
```

By default the backend uses an in-memory H2 datasource in MySQL compatibility mode. Override datasource properties to target MySQL.
