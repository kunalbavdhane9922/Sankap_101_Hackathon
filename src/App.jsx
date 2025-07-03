// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./components/Schedule"
import Users from "./components/Users"
import Income from "./components/Income";
import Billing from "./components/Billing";
import Settings from "./components/Settings";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule title="Schedule Posts" />} />
          <Route path="/users" element={<Users title="Users" />} />
          <Route path="/income" element={<Income />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/income" element={<DummyPage title="Income" />} /> */}
          {/* <Route path="/billing" element={<DummyPage title="Billing" />} /> */}
          {/* <Route path="/settings" element={<DummyPage title="Settings" />} />  */}
        </Routes>
      </Layout>
    </Router>
  );
}
