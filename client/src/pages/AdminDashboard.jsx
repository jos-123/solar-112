
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getToken } from "../api.js";

const emptyProduct = {
  name: "",
  category: "battery",
  batteryType: "power-backup",
  brand: "",
  description: "",
  price: "",
  image: "",
  specificationsText: "",
  available: true
};

const emptyProject = {
  title: "",
  location: "",
  capacity: "",
  description: "",
  image: "",
  active: true
};

const emptySystem = {
  label: "",
  title: "",
  description: "",
  featuresText: "",
  image: "",
  active: true
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [systems, setSystems] = useState([]);

  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectEditing, setProjectEditing] = useState(null);

  const [systemMode, setSystemMode] = useState("hybrid");
  const [systemForm, setSystemForm] = useState(emptySystem);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load all admin data
  async function load() {
    try {
      const [p, s, g] = await Promise.all([
        api("/products/admin/all"),
        api("/systems/admin/all"),
        api("/projects/admin/all")
      ]);

      setProducts(p);
      setSystems(s);
      setProjects(g);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  // Check admin login before loading dashboard
  useEffect(() => {
    if (!getToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }

    load();
  }, []);

  // Update solar system form
  useEffect(() => {
    const s = systems.find(x => x.mode === systemMode);

    if (s) {
      setSystemForm({
        ...s,
        featuresText: (s.features || []).join("\n")
      });
    } else {
      setSystemForm(emptySystem);
    }
  }, [systems, systemMode]);

  // Edit product
  function editProduct(p) {
    setEditing(p._id);

    setForm({
      ...p,
      price: p.price ?? "",
      specificationsText: (p.specifications || []).join("\n")
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Add or update product
  async function saveProduct(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const payload = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
      specifications: form.specificationsText
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean)
    };

    delete payload.specificationsText;

    ["_id", "__v", "createdAt", "updatedAt"].forEach(
      k => delete payload[k]
    );

    try {
      await api(
        editing ? `/products/${editing}` : "/products",
        {
          method: editing ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setMessage(
        editing ? "Product updated successfully." : "Product added successfully."
      );

      setForm(emptyProduct);
      setEditing(null);

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Delete product
  async function removeProduct(id) {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      await api(`/products/${id}`, {
        method: "DELETE"
      });

      setMessage("Product deleted successfully.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Change product availability
  async function toggleAvailability(p) {
    try {
      await api(`/products/${p._id}`, {
        method: "PUT",
        body: JSON.stringify({
          available: !p.available
        })
      });

      setMessage("Product availability updated.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Edit completed project
  function editProject(p) {
    setProjectEditing(p._id);
    setProjectForm({ ...p });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Add or update completed project
  async function saveProject(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const payload = { ...projectForm };

    ["_id", "__v", "createdAt", "updatedAt"].forEach(
      k => delete payload[k]
    );

    try {
      await api(
        projectEditing
          ? `/projects/${projectEditing}`
          : "/projects",
        {
          method: projectEditing ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      setMessage(
        projectEditing
          ? "Project updated successfully."
          : "Project added successfully."
      );

      setProjectForm(emptyProject);
      setProjectEditing(null);

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Delete completed project
  async function deleteProject(id) {
    if (!window.confirm("Delete this project photo?")) return;

    try {
      await api(`/projects/${id}`, {
        method: "DELETE"
      });

      setMessage("Project deleted successfully.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Save solar system information
  async function saveSystem(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    const payload = {
      ...systemForm,
      features: systemForm.featuresText
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean)
    };

    delete payload.featuresText;

    ["_id", "__v", "createdAt", "updatedAt", "mode"].forEach(
      k => delete payload[k]
    );

    try {
      await api(`/systems/${systemMode}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      setMessage(`${systemMode.toUpperCase()} details saved successfully.`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Admin logout
  function logout() {
    localStorage.removeItem("hm_admin_token");
    navigate("/", { replace: true });
  }

  return (
    <main className="admin-page">

      {/* Admin header */}
      <header className="admin-top">
        <Link to="/" className="brand">
          ☀ HAIL MARY
        </Link>

        <div>
          <span>Admin dashboard</span>

          <button
            className="button button-dark"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">

        {/* Dashboard heading */}
        <div className="admin-heading">
          <div>
            <span className="eyebrow">CONTROL PANEL</span>
            <h1>Website Management</h1>
            <p>
              Manage products, solar content and completed project gallery.
            </p>
          </div>

          <Link className="button button-outline-dark" to="/">
            View website ↗
          </Link>
        </div>

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        {/* Add or edit products */}
        <section className="admin-panel">
          <h2>{editing ? "Edit product" : "Add product"}</h2>

          <form className="admin-form" onSubmit={saveProduct}>

            <label>
              Product name
              <input
                required
                value={form.name}
                onChange={e =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="solar">Solar</option>
                <option value="battery">Battery</option>
                <option value="inverter">Inverter</option>
              </select>
            </label>

            {form.category === "battery" && (
              <label>
                Battery category
                <select
                  value={form.batteryType}
                  onChange={e =>
                    setForm({ ...form, batteryType: e.target.value })
                  }
                >
                  <option value="four-wheeler">4 Wheeler</option>
                  <option value="two-wheeler">2 Wheeler</option>
                  <option value="commercial">Commercial Vehicles</option>
                  <option value="power-backup">Power Backup Batteries</option>
                </select>
              </label>
            )}

            <label>
              Brand
              <input
                value={form.brand}
                onChange={e =>
                  setForm({ ...form, brand: e.target.value })
                }
              />
            </label>

            <label>
              Price (₹)
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </label>

            <label className="wide">
              Description
              <textarea
                required
                rows="3"
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label className="wide">
              Image URL
              <input
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={e =>
                  setForm({ ...form, image: e.target.value })
                }
              />
            </label>

            <label className="wide">
              Specifications (one per line)
              <textarea
                rows="3"
                value={form.specificationsText}
                onChange={e =>
                  setForm({
                    ...form,
                    specificationsText: e.target.value
                  })
                }
              />
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                checked={form.available}
                onChange={e =>
                  setForm({ ...form, available: e.target.checked })
                }
              />
              Available for customers
            </label>

            <div className="form-actions">
              <button className="button">
                {editing ? "Save changes" : "Add product"}
              </button>

              {editing && (
                <button
                  type="button"
                  className="button button-muted"
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyProduct);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

          </form>
        </section>

        {/* Product inventory */}
        <section className="admin-panel">
          <h2>Product inventory</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="table-product">
                        {p.image && (
                          <img src={p.image} alt={p.name} />
                        )}
                        <b>{p.name}</b>
                      </div>
                    </td>

                    <td>
                      {p.category}
                      {p.batteryType ? ` / ${p.batteryType}` : ""}
                    </td>

                    <td>
                      {p.price == null
                        ? "—"
                        : `₹${Number(p.price).toLocaleString("en-IN")}`}
                    </td>

                    <td>
                      {p.available ? "Available" : "Unavailable"}
                    </td>

                    <td className="actions">
                      <button onClick={() => editProduct(p)}>
                        Edit
                      </button>

                      <button onClick={() => toggleAvailability(p)}>
                        Toggle
                      </button>

                      <button
                        className="danger-text"
                        onClick={() => removeProduct(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Completed solar works gallery */}
        <section className="admin-panel">
          <h2>Completed solar works gallery</h2>

          <p className="muted">
            Add a photo URL, project details and location.
            Photos appear in a swipeable gallery on the Solar page.
          </p>

          <form className="admin-form" onSubmit={saveProject}>

            <label>
              Project title
              <input
                required
                value={projectForm.title}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    title: e.target.value
                  })
                }
              />
            </label>

            <label>
              Location
              <input
                value={projectForm.location}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    location: e.target.value
                  })
                }
              />
            </label>

            <label>
              System capacity
              <input
                placeholder="e.g. 5 kW"
                value={projectForm.capacity}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    capacity: e.target.value
                  })
                }
              />
            </label>

            <label>
              Photo URL
              <input
                required
                type="url"
                value={projectForm.image}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    image: e.target.value
                  })
                }
              />
            </label>

            <label className="wide">
              Description
              <textarea
                rows="2"
                value={projectForm.description}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value
                  })
                }
              />
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                checked={projectForm.active}
                onChange={e =>
                  setProjectForm({
                    ...projectForm,
                    active: e.target.checked
                  })
                }
              />
              Show on website
            </label>

            <div className="form-actions">
              <button className="button">
                {projectEditing ? "Update project" : "Add project photo"}
              </button>

              {projectEditing && (
                <button
                  type="button"
                  className="button button-muted"
                  onClick={() => {
                    setProjectEditing(null);
                    setProjectForm(emptyProject);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>

          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Location</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map(p => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.location}</td>

                    <td>
                      <a
                        href={p.image}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View image
                      </a>
                    </td>

                    <td className="actions">
                      <button onClick={() => editProject(p)}>
                        Edit
                      </button>

                      <button
                        className="danger-text"
                        onClick={() => deleteProject(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Solar system content */}
        <section className="admin-panel">
          <h2>Solar system content</h2>

          <div className="mode-picker">
            {["ongrid", "hybrid", "offgrid"].map(m => (
              <button
                type="button"
                key={m}
                className={systemMode === m ? "selected" : ""}
                onClick={() => setSystemMode(m)}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <form className="admin-form" onSubmit={saveSystem}>

            <label>
              Section label
              <input
                required
                value={systemForm.label}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    label: e.target.value
                  })
                }
              />
            </label>

            <label>
              Heading
              <input
                required
                value={systemForm.title}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    title: e.target.value
                  })
                }
              />
            </label>

            <label className="wide">
              Description
              <textarea
                required
                rows="4"
                value={systemForm.description}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    description: e.target.value
                  })
                }
              />
            </label>

            <label className="wide">
              Features (one per line)
              <textarea
                rows="4"
                value={systemForm.featuresText}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    featuresText: e.target.value
                  })
                }
              />
            </label>

            <label className="wide">
              Image URL
              <input
                type="url"
                value={systemForm.image}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    image: e.target.value
                  })
                }
              />
            </label>

            <label className="check-label">
              <input
                type="checkbox"
                checked={systemForm.active}
                onChange={e =>
                  setSystemForm({
                    ...systemForm,
                    active: e.target.checked
                  })
                }
              />
              Show on website
            </label>

            <button className="button">
              Save solar system
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}
