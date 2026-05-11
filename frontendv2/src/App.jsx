/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FileComplaint from "./pages/FileComplaint";
import MyComplaints from "./pages/MyComplaints";
import MapView from "./pages/MapView";
import Trends from "./pages/Trends";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App Routes (with layout) */}
          <Route
            path="*"
            element={
              <Layout theme={theme} toggleTheme={toggleTheme}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/register" element={<FileComplaint />} />
                  <Route path="/complaints" element={<MyComplaints />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/trends" element={<Trends />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
