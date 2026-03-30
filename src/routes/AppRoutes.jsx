// src/routes/AppRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./index";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const publicRoutes = routes.filter((r) => !r.protected);
  const protectedRoutes = routes.filter((r) => r.protected);

  return (
    <Suspense fallback={<div className='p-4'>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, component: Component, layout }) => {
          const content = <Component />;
          return (
            <Route
              key={path}
              path={path}
              element={
                layout === "none" ? content : <MainLayout>{content}</MainLayout>
              }
            />
          );
        })}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <MainLayout>
                  <Component />
                </MainLayout>
              }
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
