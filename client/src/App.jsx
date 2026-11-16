import { Routes, Route, Link } from "react-router-dom";

import SolarPage from "./pages/SolarPage.jsx";
import BatteriesPage from "./pages/BatteriesPage.jsx";
import InvertersPage from "./pages/InvertersPage.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  return (
    <Routes>
      {/* Solar page is the website homepage */}
      <Route path="/" element={<SolarPage />} />
      <Route path="/solar" element={<SolarPage />} />

      {/* Separate product pages */}
      <Route path="/batteries" element={<BatteriesPage />} />
      <Route path="/inverters" element={<InvertersPage />} />

      {/* Customer and administrator accounts */}
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route
        path="*"
        element={
          <main className="container">
            <h1>Page not found</h1>
            <Link to="/">Go home</Link>
          </main>
        }
      />
    </Routes>
  );
}
