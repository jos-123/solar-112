import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import ProductSection from "../components/ProductSection.jsx";
import { api } from "../api.js";
export default function InvertersPage() {
  const [products,setProducts] = useState([]);
  useEffect(()=>{api("/products?category=inverter").then(setProducts).catch(()=>setProducts([]));},[]);
  return <>
    <Header/>
    <main>
      <section className="category-page-hero inverter-page-hero"><div className="container"><span className="eyebrow light">HAIL MARY PRODUCT RANGE</span><h1>Inverters</h1><p>Explore inverter models, product images, specifications and prices. Contact us to confirm compatibility with your power requirements.</p></div></section>
      <ProductSection title="Available Inverters" category="inverter" products={products}/>
      <section className="contact-section section" id="contact"><div className="container"><h2>Looking for the right inverter?</h2><p>Share your load and backup requirements with our team.</p><a className="button" href="https://wa.me/7510373226?text=Hello%20HAIL%20MARY%2C%20I%20need%20help%20choosing%20an%20inverter." target="_blank" rel="noreferrer">Ask on WhatsApp</a></div></section>
    </main>
  </>;
}
