import { useEffect, useRef, useState } from "react";
import Header from "../components/Header.jsx";
import ProductSection from "../components/ProductSection.jsx";
import { api } from "../api.js";

const categories = [
  ["all", "All Batteries"],
  ["four-wheeler", "4 Wheeler"],
  ["two-wheeler", "2 Wheeler"],
  ["commercial", "Commercial Vehicles"],
  ["power-backup", "Power Backup"]
];

export default function BatteriesPage() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("all");
  const productsRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    api("/products?category=battery").then(setProducts).catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const current = categories.find(([key]) => key === active)?.[1] || "Batteries";

  return <>
    <Header />
    <main>
      <section className="category-page-hero battery-page-hero">
        <div className="container">
          <span className="eyebrow light">HAIL MARY PRODUCT RANGE</span>
          <h1>Batteries</h1>
          <p>Choose the battery category that matches your vehicle or power backup requirement.</p>
        </div>
      </section>

      <section className="battery-category-nav container" aria-label="Battery categories">
        {categories.map(([key, label]) => <button
          type="button" key={key}
          className={active === key ? "active" : ""}
          aria-pressed={active === key}
          onClick={() => setActive(key)}
        >{label}</button>)}
      </section>

      <div ref={productsRef} id="battery-products" className="battery-products-anchor">
        <ProductSection
          title={active === "all" ? "Batteries" : current}
          category="battery"
          batteryType={active === "all" ? undefined : active}
          products={products}
        />
      </div>

      <section className="contact-section section" id="contact">
        <div className="container">
          <h2>Need help choosing a battery?</h2>
          <p>Contact HAIL MARY for product compatibility and pricing.</p>
          <a className="button" href="https://wa.me/7510373226?text=Hello%20HAIL%20MARY%2C%20I%20need%20help%20choosing%20a%20battery." target="_blank" rel="noreferrer">Ask on WhatsApp</a>
        </div>
      </section>
    </main>
  </>;
}
