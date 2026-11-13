"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import "./osm-map.css";

// Leaflet нь `window`-г шууд ашигладаг тул сервер дээр render хийхгүй (ssr: false).
// App Router дээр ssr: false-г зөвхөн Client Component дотор бичих боломжтой.
const OsmMap = dynamic(() => import("./OsmMap"), {
  ssr: false,
  loading: () => <div className="osm-map osm-map--loading">Газрын зураг ачаалж байна…</div>,
});

export default function MapLoader() {
  return <OsmMap />;
}
