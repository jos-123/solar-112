import { useEffect, useState } from "react";
import { api } from "../api.js";
import { site } from "../data/site.js";

export default function NewArrivalBanner() {
  const [item, setItem] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => { api("/new-arrival").then(setItem).catch(() => setItem(null)); }, []);
  if (!item?.active || !item.images?.length) return null;
  const images = item.images.slice(0, 3);
  const move = (direction) => setActiveImage(current => (current + direction + images.length) % images.length);
  const whatsapp = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(item.whatsappMessage || `Hello HAIL MARY, I would like to enquire about ${item.title}.`)}`;
  return (
    <section className="new-arrival-banner" aria-label="New arrival">
      <div className="new-arrival-copy">
        <span className="eyebrow">{item.eyebrow || "NEW ARRIVAL"}</span>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <div className="new-arrival-actions">
          <a className="button" href={whatsapp} target="_blank" rel="noreferrer">Enquire on WhatsApp ↗</a>
          <a className="new-arrival-call" href={`tel:${site.phone}`}>☎ {site.phone}</a>
        </div>
      </div>
      <div className="new-arrival-gallery">
        <img src={images[activeImage]} alt={`${item.title} image ${activeImage + 1}`} />
        {images.length > 1 && <>
          <button className="new-arrival-arrow prev" type="button" onClick={() => move(-1)} aria-label="Previous image">‹</button>
          <button className="new-arrival-arrow next" type="button" onClick={() => move(1)} aria-label="Next image">›</button>
          <div className="new-arrival-dots">{images.map((_, index) => <button key={index} type="button" className={index === activeImage ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} />)}</div>
        </>}
      </div>
    </section>
  );
}
