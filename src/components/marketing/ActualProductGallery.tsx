"use client";

import Image from "next/image";
import { useState } from "react";

const screens = [
  {
    label: "Trend chart",
    src: "/images/pls-sales-trend.jpg",
    alt: "PLS daily sales trend interface showing selectable financial metrics on a line chart",
    title: "See the movement before opening the detail.",
    copy: "Switch between chart types, choose a reporting period and control which financial measures appear together.",
  },
  {
    label: "Data table",
    src: "/images/pls-sales-table.jpg",
    alt: "PLS sales analytics table showing revenue, expenses, net operating cash and daily breakdown actions",
    title: "Move from the chart to the records behind it.",
    copy: "Review daily figures, changes, operating cash and breakdown actions in the detailed table beneath the trend.",
  },
];

export function ActualProductGallery() {
  const [active, setActive] = useState(0);
  const screen = screens[active];

  return (
    <div className="actual-gallery">
      <div className="actual-gallery-copy">
        <span className="eyebrow">ACTUAL PLS INTERFACE</span>
        <h3>{screen.title}</h3>
        <p>{screen.copy}</p>
        <ul>
          <li><span>01</span>Line, bar and area views</li>
          <li><span>02</span>Selectable financial metrics</li>
          <li><span>03</span>Daily breakdown actions</li>
          <li><span>04</span>Printable detail table</li>
        </ul>
        <small>Shown from a supplied PLS product screen. Facility and administrator details have been removed. No patient records are visible.</small>
      </div>
      <div className="actual-gallery-stage">
        <div className="actual-gallery-tabs" role="tablist" aria-label="PLS analytics product views">
          {screens.map((item, index) => (
            <button
              key={item.label}
              id={`actual-gallery-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-controls="actual-gallery-panel"
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                event.preventDefault();
                const next = (index + (event.key === "ArrowRight" ? 1 : -1) + screens.length) % screens.length;
                setActive(next);
                document.getElementById(`actual-gallery-tab-${next}`)?.focus();
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </button>
          ))}
          <span className="actual-gallery-status"><i /> IDENTIFIERS REMOVED</span>
        </div>
        <div className="actual-gallery-image" id="actual-gallery-panel" role="tabpanel" aria-labelledby={`actual-gallery-tab-${active}`}>
          <Image key={screen.src} src={screen.src} alt={screen.alt} width={1606} height={702} sizes="(max-width: 850px) 100vw, 68vw" priority={false} />
        </div>
      </div>
    </div>
  );
}
