import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Layout } from './components/Layout.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { SeriesPage } from './pages/SeriesPage.js';
import { MyTicketPage } from './pages/MyTicketPage.js';
import { StaffCounterPage } from './pages/StaffCounterPage.js';
import { ForbiddenPage } from './pages/ForbiddenPage.js';
import './styles/index.css';

export function AppRoutes(): React.JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/series"
          element={
            <ProtectedRoute allowedRoles={['COLLECTOR']}>
              <SeriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-ticket"
          element={
            <ProtectedRoute allowedRoles={['COLLECTOR']}>
              <MyTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/counter"
          element={
            <ProtectedRoute allowedRoles={['BOX_MASTER']}>
              <StaffCounterPage />
            </ProtectedRoute>
          }
        />
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}

export function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
