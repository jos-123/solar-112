
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("hm_customer_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() =>
    Boolean(localStorage.getItem("hm_admin_token"))
  );

  function customerLogout() {
    localStorage.removeItem("hm_customer_token");
    localStorage.removeItem("hm_customer_user");

    setCustomer(null);
    navigate("/", { replace: true });
  }

  function adminLogout() {
    localStorage.removeItem("hm_admin_token");

    setIsAdmin(false);
    navigate("/", { replace: true });
  }

  return (
    <header className="header">

      {/* Logo */}
      <Link to="/" className="brand">
        <span className="brand-mark">☀</span>

        <span>
          HAIL MARY
          <small>SOLAR SOLUTIONS</small>
        </span>
      </Link>

      {/* Main navigation */}
      <nav>
        <Link to="/">Solar</Link>
        <Link to="/batteries">Batteries</Link>
        <Link to="/inverters">Inverters</Link>
        <a href="/#contact">Contact</a>
      </nav>

      {/* Account controls */}
      <div className="header-account">

        {isAdmin ? (
          <>
            <Link className="button button-small" to="/admin">
              Admin Panel
            </Link>

            <button
              className="button button-small"
              onClick={adminLogout}
            >
              Logout
            </button>
          </>
        ) : customer ? (
          <>
            <span className="header-user">
              Hi, {customer.name?.split(" ")[0] || "Customer"}
            </span>

            <button
              className="button button-small"
              onClick={customerLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="button button-small" to="/login">
              Customer Login
            </Link>

            <Link
              className="button button-small"
              to="/admin/login"
            >
              Admin Login
            </Link>
          </>
        )}

      </div>

    </header>
  );
}
