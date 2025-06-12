"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/home";
import TripsPage from "./pages/trips";
import TripDetailPage from "./pages/trip-detail";
import TripMapPage from "./pages/trip-map";
import ProtectedRoute from "./components/protected-route";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="app/trips"
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="app/trip/:trip_id"
          element={
            <ProtectedRoute>
              <TripDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="app/trip/:trip_id/map"
          element={
            <ProtectedRoute>
              <TripMapPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
