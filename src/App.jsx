// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./components/Schedule"
import Users from "./components/Users"
import Income from "./components/Income";
import Billing from "./components/Billing";
import Settings from "./components/Settings";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";

function RequireAuth({ children }) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user.email");
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/schedule" element={<RequireAuth><Schedule title="Schedule Posts" /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><Users title="Users" /></RequireAuth>} />
          <Route path="/income" element={<RequireAuth><Income /></RequireAuth>} />
          <Route path="/billing" element={<RequireAuth><Billing /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          {/* <Route path="/income" element={<DummyPage title="Income" />} /> */}
          {/* <Route path="/billing" element={<DummyPage title="Billing" />} /> */}
          {/* <Route path="/settings" element={<DummyPage title="Settings" />} />  */}
        </Routes>
      </Layout>
    </Router>
  );
}
