import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createMemoryRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { getToken } from "./api/client";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";

function ProtectedRoute() {
  return getToken() ? <Outlet /> : <Navigate replace to="/login" />;
}

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Navigate replace to="/todos" />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/todos" element={<TodoPage />} />
    </Route>
  </>,
);

export function createAppRouter(initialEntries: string[]) {
  return createMemoryRouter(routes, { initialEntries });
}

const browserRouter = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={browserRouter} />;
}
