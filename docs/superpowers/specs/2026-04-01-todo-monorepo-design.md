# Todo Monorepo (Frontend/Backend Split) Design

## 1. Goal
Build a frontend-backend separated Todo management system with login and full CRUD, using a single monorepo. The system must enforce strict multi-user data isolation.

## 2. Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Spring Boot + MyBatis + MySQL
- Auth: JWT Bearer token
- Repository model: Monorepo

## 3. Repository Structure
- `frontend/`: React app
- `backend/`: Spring Boot app
- `docs/superpowers/specs/`: design documents
- `docs/superpowers/plans/`: implementation plans

## 4. Backend Module Boundaries
Backend follows a modular monolith style with clear functional boundaries:
- `auth` module
  - responsibilities: register, login, JWT issue/validate
  - internal slices: controller/service/mapper
- `todo` module
  - responsibilities: CRUD on current user tasks
  - internal slices: controller/service/mapper

## 5. Data Model (Minimal)
### users
- `id` (PK)
- `username` (unique)
- `password_hash`
- `created_at`
- `updated_at`

### todos
- `id` (PK)
- `user_id` (FK -> users.id)
- `title`
- `description`
- `status` (`TODO` | `DONE`)
- `created_at`
- `updated_at`

## 6. API Design
Base path: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Todo (auth required)
- `GET /todos`
- `POST /todos`
- `PUT /todos/{id}`
- `DELETE /todos/{id}`

## 7. Security and Isolation Rules
- Client never sends `userId` for Todo ownership.
- Server derives current user from JWT for all Todo requests.
- Every Todo read/write query is constrained by current user id.
- Update/Delete for non-owned or missing records returns `404` to avoid resource existence leakage.

## 8. Frontend Pages and State
- `/login`: login form
- `/register`: register form
- `/todos`: task list and CRUD operations

State and routing behavior:
- JWT stored in `localStorage`
- Request layer auto-injects `Authorization: Bearer <token>`
- Route guard redirects unauthenticated users to `/login`

## 9. Request/Response Contract
Unified JSON envelope:
- success: `{ code: 0, message: "ok", data: ... }`
- error: `{ code: <non-zero>, message: <reason>, data: null }`

HTTP status mapping:
- `400` invalid input
- `401` auth missing/invalid
- `404` resource not found or not owned
- `500` unexpected server error

## 10. Data Flow
1. User registers or logs in.
2. Backend returns JWT on successful login.
3. Frontend stores token and navigates to `/todos`.
4. Frontend sends token for each Todo API request.
5. Backend resolves `userId` from JWT and enforces ownership in queries.

## 11. Testing Strategy (TDD)
Execution rule: no production behavior without a failing test first.

### Backend auth tests first
- register success
- register duplicate username
- login success returns JWT
- login wrong password rejected
- invalid JWT rejected on protected endpoints

### Backend todo tests first
- list only current user tasks
- create task attaches current user
- update own task succeeds
- update other user task returns 404
- delete own task succeeds
- delete other user task returns 404

### Frontend tests after backend endpoints stabilize
- unauthenticated route guard redirects to `/login`
- login flow stores token and redirects
- todo list loads with token
- create/update/delete interactions call expected APIs and refresh UI state

## 12. Non-Goals (YAGNI)
- no roles/permissions beyond per-user isolation
- no pagination/search/filter in v1
- no refresh token flow in v1
- no microservice decomposition in v1

## 13. Trade-off Acknowledgment
Modular monolith keeps the initial development and teaching workflow fast and clear, with explicit module boundaries. Migration to microservices later will require extracting module contracts and integration concerns.
