import { useEffect, useState } from "react";
import { api } from "../api.js";

const fallback = [
  { mode:"ongrid", label:"ON-GRID SOLAR SYSTEM", title:"Smart Power. Maximum Savings.", description:"An on-grid solar system connects solar panels to the electricity grid. Excess electricity may be exported under applicable net-metering rules. Standard grid-tied systems generally shut down during a grid outage unless designed with approved backup capability.", features:["No battery required in a standard setup","Can reduce grid electricity consumption","Net metering subject to local rules"], image:"https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900" },
  { mode:"hybrid", label:"HYBRID SOLAR SYSTEM", title:"The Ultimate Balance", description:"A hybrid solar system combines solar panels, battery storage and grid connectivity. Solar power can serve loads, charge the battery and use the grid when needed.", features:["Solar generation for daily use","Battery storage for backup","Grid support when required"], image:"https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900" },
  { mode:"offgrid", label:"OFF-GRID SOLAR SYSTEM", title:"Independent Energy", description:"An off-grid solar system operates without a utility-grid connection. Solar panels charge batteries and the system supplies the property from solar generation and stored energy.", features:["No utility-grid connection required","Battery storage is essential","Useful for remote locations"], image:"https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=900" }
];

const modes = [{key:"ongrid",name:"ON-GRID",symbol:"ϟ"},{key:"hybrid",name:"HYBRID",symbol:"◉"},{key:"offgrid",name:"OFF-GRID",symbol:"▣"}];

export default function SolarSystems() {
  const [systems, setSystems] = useState(fallback);
  const [mode, setMode] = useState("hybrid");

  useEffect(() => { api("/systems").then(setSystems).catch(() => {}); }, []);
  const selected = systems.find(s => s.mode === mode) || fallback.find(s => s.mode === mode);

  return <section className="solar-section section" id="solar">
    <div className="section-heading"><span className="eyebrow">CHOOSE YOUR POWER PATH</span><h2>Explore Our Solar Systems</h2><p>Select a system to see how solar energy works.</p></div>
    <div className="system-tabs">
      {modes.map(m => <button key={m.key} onClick={() => setMode(m.key)} className={`system-tab ${mode===m.key?"active":""}`}><span>{m.symbol}</span><b>{m.name}</b></button>)}
    </div>
    <div className="flow-card">
      <div className="flow-caption"><i /> ENERGY FLOW OVERVIEW</div>
      <div className={`flow-diagram mode-${mode}`}>
        <div className="flow-line line-sun-panel"/><div className="flow-line line-panel-battery"/><div className="flow-line line-panel-grid"/><div className="flow-line line-battery-home"/><div className="flow-line line-grid-home"/>
        <div className="flow-node sun"><span>☀</span><b>SUN</b></div>
        <div className="flow-node panels"><span>▦</span><b>PANELS</b></div>
        <div className="flow-node battery"><span>▰</span><b>BATTERY</b></div>
        <div className="flow-node grid"><span>ϟ</span><b>GRID</b></div>
        <div className="flow-node home"><span>⌂</span><b>HOME</b></div>
      </div>
      <div className="system-detail">
        <div><span className="eyebrow">{selected.label}</span><h3>{selected.title}</h3><p>{selected.description}</p>
          <ul>{selected.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
          <a className="button" href="#contact">Ask for a Solar Quote →</a>
        </div>
        <img src={selected.image} alt={`${selected.label} installation`} />
      </div>
    </div>
  </section>;
}
