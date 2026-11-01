"use client";

import Image from "next/image";
import { useState } from "react";
import { productScreens } from "@/data/product-screens";

export function ActualProductGallery({ id = "product-gallery" }: { id?: string }) {
  const [active, setActive] = useState(0);
  const screen = productScreens[active];

  return (
    <div className="actual-gallery">
      <div className="actual-gallery-copy">
        <span className="eyebrow">ACTUAL PLS INTERFACE</span>
        <h3>{screen.title}</h3>
        <p>{screen.description}</p>
        <ul>
          {screen.workflows.map((workflow, index) => <li key={workflow}><span>{String(index + 1).padStart(2, "0")}</span>{workflow}</li>)}
        </ul>
        <small>{screen.provenance}</small>
      </div>
      <div className="actual-gallery-stage">
        <div className="actual-gallery-picker">
          <label htmlFor={`${id}-select`}>Choose a software page</label>
          <select id={`${id}-select`} value={active} onChange={event => setActive(Number(event.target.value))} aria-controls={`${id}-panel`}>
            {productScreens.map((item, index) => <option key={item.id} value={index}>{String(index + 1).padStart(2, "0")}. {item.label}</option>)}
          </select>
          <div className="actual-gallery-controls"><button type="button" aria-label="Previous software screenshot" onClick={() => setActive((active + productScreens.length - 1) % productScreens.length)}>←</button><button type="button" aria-label="Next software screenshot" onClick={() => setActive((active + 1) % productScreens.length)}>→</button></div>
        </div>
        <div className="actual-gallery-image" id={`${id}-panel`} role="region" aria-label={`${screen.label} screenshot`} tabIndex={0}>
          <Image key={screen.src} src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(max-width: 850px) 100vw, 68vw" loading="lazy" />
        </div>
        <div className="actual-gallery-footer"><a href={screen.src} target="_blank" rel="noopener noreferrer">Open full-size page ↗</a><span>{active + 1} / {productScreens.length}</span></div>
      </div>
    </div>
  );
}
