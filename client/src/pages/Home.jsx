import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import SolarSystems from "../components/SolarSystems.jsx";
import ProductSection from "../components/ProductSection.jsx";
import { api } from "../api.js";
import { site } from "../data/site.js";
import CustomerReviews from "../components/CustomerReviews.jsx";
export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api("/products").then(setProducts).catch(() => setProducts([])); }, []);
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello HAIL MARY, I would like to know more about your solar products.")}`;

  return <>
    <Header />
    <main>
      <section className="hero">
        <div className="hero-content"><span className="eyebrow light">CLEAN ENERGY • SMARTER LIVING</span><h1>Power Your Future With <em>Solar Energy</em></h1><p>Reliable solar panels, batteries and inverters for homes and businesses. Make a confident move towards cleaner energy.</p><div className="hero-actions"><a className="button" href="/solar">Explore Solar Solutions</a><a className="button button-outline" href={wa} target="_blank" rel="noreferrer">WhatsApp Us</a></div></div>
      </section>

      <section className="intro container section"><span className="eyebrow">WELCOME TO HAIL MARY</span><h2>Your Trusted Solar Energy Partner</h2><p>Explore solar solutions and essential power products backed by helpful guidance. Contact our team to find the right system for your needs.</p></section>

      <section className="solar-home-promo container section"><div><span className="eyebrow">SOLAR SOLUTIONS</span><h2>Find the right solar system for your home or business</h2><p>Compare On-Grid, Hybrid and Off-Grid systems and understand how each one works.</p><a className="button" href="/solar">Explore Solar Systems →</a></div><img src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1000" alt="Solar panels on a rooftop" /></section>
      <ProductSection title="Solar Panels & Solutions" category="solar" products={products} id="solar-products" />
      <ProductSection title="Solar Batteries" category="battery" products={products} id="batteries" />
      <ProductSection title="Solar Inverters" category="inverter" products={products} id="inverters" />

      <section className="section savings"><div className="container savings-inner"><div><span className="eyebrow">PLAN YOUR SOLAR JOURNEY</span><h2>Calculate Your Solar Savings</h2><p>Enter your monthly electricity bill to see an illustrative annual spending and savings estimate.</p></div><SavingsCalculator /></div></section>

      <section className="section container testimonials"><div className="section-heading"><span className="eyebrow">CUSTOMER EXPERIENCES</span><h2>What Customers Say</h2><p>Replace these sample testimonials with genuine customer reviews.</p></div><div className="quote-grid"><blockquote>“The team explained the solar options clearly and helped us understand the installation process.”<b>— Sample customer</b></blockquote><blockquote>“Helpful service and a smooth experience from enquiry to installation.”<b>— Sample customer</b></blockquote><blockquote>“We received clear guidance about choosing the right power backup.”<b>— Sample customer</b></blockquote></div></section>

      <section className="contact-section section" id="contact"><div className="container contact-grid"><div><span className="eyebrow light">LET'S TALK SOLAR</span><h2>Ready to Switch to Solar?</h2><p>{site.address}</p><p><a href={`tel:${site.phone}`}>☎ {site.phone}</a></p><p><a href={`mailto:${site.email}`}>✉ {site.email}</a></p><a className="button" href={wa} target="_blank" rel="noreferrer">Chat on WhatsApp</a><p>WhatsApp: +91 75103 73226</p></div><iframe title="HAIL MARY business location" src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`} loading="lazy" /></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#">☀ HAIL MARY</a><p>Solar Solutions • Your trusted solar energy partner</p><a href="/admin/login">Administrator</a><small>© {new Date().getFullYear()} HAIL MARY. All rights reserved.</small></footer>
    <a className="whatsapp-float" href={wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">☏</a>
  </>;
}

function SavingsCalculator() {
  const [bill,setBill] = useState("3000");
  const [type,setType] = useState("home");
  const [show,setShow] = useState(false);
  const pct = type === "home" ? .7 : type === "apartment" ? .6 : .75;
  const annual = Math.max(0,Number(bill)||0)*12;
  const money = n => n.toLocaleString("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
  return <div className="calculator"><label>Monthly electricity bill (₹)<input type="number" min="1" value={bill} onChange={e=>setBill(e.target.value)} /></label><label>Property type<select value={type} onChange={e=>setType(e.target.value)}><option value="home">Residential home</option><option value="apartment">Apartment</option><option value="commercial">Commercial building</option></select></label><button className="button" onClick={()=>setShow(true)}>Calculate Savings</button>{show && <div className="calc-result"><span>Annual electricity spending</span><strong>{money(annual)}</strong><span>Illustrative annual solar savings</span><strong className="green">{money(annual*pct)}</strong><small>Illustrative only, not guaranteed savings. Actual savings depend on system size, generation, tariff, usage and applicable policies.</small></div>}</div>;
}
