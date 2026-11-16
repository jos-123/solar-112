import { whatsappLink, inr } from "../data/site.js";

const batteryTypes = [
  ["four-wheeler", "4 Wheeler"],
  ["two-wheeler", "2 Wheeler"],
  ["commercial", "Commercial Vehicles"],
  ["power-backup", "Power Backup Batteries"]
];

export default function ProductSection({ title, category, products, id, batteryType }) {
  const list = products.filter(p => p.category === category);
  const groups = category === "battery"
    ? (batteryType ? batteryTypes.filter(([key]) => key === batteryType) : batteryTypes)
    : [["all", title]];

  return <section className="section container" id={id}>
    <div className="section-heading">
      <span className="eyebrow">OUR PRODUCTS</span>
      <h2>{title}</h2>
      <p>Explore available products. Contact us on WhatsApp for purchasing and product guidance.</p>
    </div>
    {groups.map(([key, label]) => {
      const items = category === "battery"
        ? list.filter(p => (p.batteryType || "power-backup") === key)
        : list;
      return <div className="product-subcategory" key={key}>
        {!batteryType && category === "battery" && <h3>{label}</h3>}
        {items.length ? <div className="product-grid">{items.map(p => {
          const message = `Hello HAIL MARY, I am interested in purchasing ${p.name}${p.brand ? ` (${p.brand})` : ""}. Please share details.`;
          return <article className="product-card" key={p._id}>
            <img src={p.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900"} alt={p.name}/>
            <div className="product-content">
              <span className="availability">Available</span><h3>{p.name}</h3>
              {p.brand && <p className="muted">{p.brand}</p>}<p>{p.description}</p>
              {p.price !== null && p.price !== undefined && <strong>{inr(p.price)}</strong>}
              {p.specifications?.length > 0 && <ul>{p.specifications.map((s,i)=><li key={i}>{s}</li>)}</ul>}
              <a className="button product-buy" href={whatsappLink(message)} target="_blank" rel="noreferrer">Enquire / Purchase on WhatsApp</a>
            </div>
          </article>;
        })}</div> : <p className="empty">Products will be added here soon.</p>}
      </div>;
    })}
  </section>;
}
