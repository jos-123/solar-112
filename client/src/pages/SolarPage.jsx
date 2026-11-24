import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { api } from "../api.js";
import SolarSystems from "../components/SolarSystems.jsx";
import { site } from "../data/site.js";
import NewArrivalBanner from "../components/NewArrivalBanner.jsx";

const benefits = [
  ["Bill-conscious energy", "Generate electricity from sunlight and reduce the amount of power you need to purchase from the grid."],
  ["Long-term value", "A properly designed system can deliver value over many years. Actual payback depends on usage, tariff, equipment and installation cost."],
  ["Cleaner electricity", "Use renewable energy from the sun and reduce reliance on conventional grid electricity."],
  ["Designed around your needs", "Choose a configuration based on your roof, daily consumption, backup needs and available space."],
  ["Smart monitoring", "Compatible inverter systems can help you monitor solar generation, battery status and energy usage."],
  ["Guidance on schemes", "We can help you understand applicable subsidy and net-metering processes. Eligibility and benefits must be verified for each project."]
];

const services = [
  { title: "On-Grid Solar", text: "Grid-connected solar for properties that want to use solar generation and export eligible surplus under applicable utility rules.", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900" },
  { title: "Hybrid Solar", text: "Solar generation with battery storage and grid support for properties that need backup flexibility.", image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900" },
  { title: "Off-Grid Solar", text: "Independent solar and battery systems for locations where a utility connection is unavailable or not preferred.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900" },
  { title: "Panel Cleaning", text: "Periodic cleaning helps remove dust and deposits that can reduce sunlight reaching the panel surface.", image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?w=900" },
  { title: "Protection & Maintenance", text: "Inspection of wiring, earthing, surge protection and system performance to help maintain safe operation.", image: "https://images.unsplash.com/photo-1624397640148-949b1732bb0a?w=900" },
  { title: "Solar Water Heating", text: "Solar thermal water-heating options for homes and businesses with suitable hot-water demand.", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900" }
];

const faqs = [
  ["Which solar system is right for my property?", "It depends on your electricity usage, grid availability, backup requirements, roof space and budget. Our team can assess these details before recommending a configuration."],
  ["Does an on-grid solar system work during a power cut?", "A standard grid-tied inverter normally shuts down when the utility grid fails for safety. Backup during outages requires compatible equipment and an appropriately designed system."],
  ["Do I need batteries with solar panels?", "Not always. Standard on-grid systems generally operate without batteries. Hybrid and off-grid systems use batteries when energy storage or backup is required."],
  ["Can I get a government subsidy?", "Subsidy eligibility depends on the current government scheme, property type, system capacity and approved installation requirements. Confirm the latest rules before making a financial decision."],
  ["How much roof space do I need?", "Required space depends on the panel wattage, system capacity, roof layout, orientation, shading and maintenance access. A site survey gives a more reliable estimate."],
  ["How do I request a quotation?", "Send us your location, recent electricity bill and contact details through WhatsApp or the enquiry section. We can then discuss a site assessment and suitable options."]
];

function QuoteForm() {
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello HAIL MARY, I would like a solar installation quotation.")}`;
  return <div className="solar-quote-card"><span className="eyebrow">START WITH A CONVERSATION</span><h3>Get a solar quotation</h3><p>Share your electricity needs with our team. We can help you identify the right next step.</p><a className="button" href={whatsapp} target="_blank" rel="noreferrer">Request on WhatsApp →</a><small>Replace the sample business contact details before publishing.</small></div>;
}

export default function SolarPage() {
  const [projects,setProjects] = useState([]);
  useEffect(() => { api("/projects").then(setProjects).catch(() => setProjects([])); }, []);
  return <>
    <Header />
    <main className="solar-page">
      <div className="container"><NewArrivalBanner /></div>
      <section className="solar-hero">
        <div className="solar-hero-content">
          <span className="eyebrow light">HAIL MARY SOLAR SOLUTIONS</span>
          <h1>Power your home.<br/><em>Choose a brighter future.</em></h1>
          <p>Explore solar systems designed around your electricity use, property and backup requirements. Get clear guidance before you invest.</p>
          <div className="hero-actions"><a className="button" href="#solar-path">Explore solar systems</a><a className="button button-outline" href="#contact">Get a free quote</a></div>
          <div className="solar-hero-points"><span>✓ Residential solutions</span><span>✓ Commercial solutions</span><span>✓ System guidance</span></div>
        </div>
        <div className="solar-hero-note"><b>Plan your solar system</b><span>On-Grid · Hybrid · Off-Grid</span></div>
      </section>

      <section className="section container solar-benefits">
        <div className="section-heading"><span className="eyebrow">WHY CONSIDER SOLAR?</span><h2>Make more of the sunlight available to you</h2><p>Understand the practical benefits and choose a system that matches your needs.</p></div>
        <div className="solar-benefit-grid">{benefits.map(([title,text],i)=><article className="solar-benefit" key={title}><span className="benefit-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="solar-tech-section section">
        <div className="container solar-tech-grid"><div className="solar-tech-image"><img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200" alt="Solar photovoltaic panels"/><span>Solar technology</span></div><div><span className="eyebrow">SOLAR PANEL TECHNOLOGY</span><h2>Choose quality components for dependable performance</h2><p>Solar panel technologies differ in cell design, efficiency, temperature behaviour and warranty terms. We help customers compare product specifications instead of relying on headline claims alone.</p><ul><li>Compare rated power and module efficiency</li><li>Review product and performance warranties</li><li>Consider roof orientation, heat and shading</li><li>Match panels with a compatible inverter</li></ul><a className="button" href="#contact">Discuss your installation →</a></div></div>
      </section>

      <section className="section container solar-services"><div className="section-heading"><span className="eyebrow">WHAT WE CAN HELP WITH</span><h2>Solar services for different needs</h2><p>From choosing a system to keeping it maintained, explore the available service areas.</p></div><div className="solar-service-grid">{services.map(s=><article className="solar-service-card" key={s.title}><img src={s.image} alt={s.title}/><div><h3>{s.title}</h3><p>{s.text}</p><a href="#contact">Discuss this service →</a></div></article>)}</div></section>

      <div id="solar-path"><SolarSystems /></div>

      <section className="section solar-projects"><div className="container"><div className="section-heading"><span className="eyebrow">PROJECT SHOWCASE</span><h2>Our completed solar works</h2><p>Swipe or scroll to explore installation photos. HAIL MARY admins can add and update these projects.</p></div><div className="solar-project-carousel">{projects.map(p=><article className="solar-project-card" key={p._id}><img src={p.image} alt={p.title}/><div><span>{p.capacity || "Solar installation"}</span><h3>{p.title}</h3><p>{p.location}{p.description ? ` · ${p.description}` : ""}</p></div></article>)}</div></div></section>

      <section className="section container solar-faq"><div className="section-heading"><span className="eyebrow">HELP & GUIDANCE</span><h2>Frequently asked questions</h2><p>Quick answers to help you understand solar before requesting a quote.</p></div><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>

      <section className="section solar-quote" id="contact"><div className="container solar-quote-grid"><div><span className="eyebrow light">YOUR SOLAR JOURNEY STARTS HERE</span><h2>Let's find the right solar solution for you.</h2><p>Tell us about your property and electricity requirements. Our team can guide you through the available options.</p><div className="solar-contact-lines"><span>☎ {site.phone}</span><span>✉ {site.email}</span><span>⌖ {site.address}</span></div></div><QuoteForm /></div></section>
    </main>
    <footer><a className="brand footer-brand" href="/">☀ HAIL MARY</a><p>Solar Solutions • Your trusted solar energy partner</p><a href="/admin/login">Administrator</a><small>© {new Date().getFullYear()} HAIL MARY. All rights reserved.</small></footer>
    <a className="whatsapp-float" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hello HAIL MARY, I need information about solar solutions.")}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">☏</a>
  </>;
}
