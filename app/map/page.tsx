import type { Metadata } from "next";
import MapLoader from "../../components/map/MapLoader";

export const metadata: Metadata = {
  title: "Газрын зураг · OpenStreetMap",
  description: " OpenStreetMap дээр marker-ээр тэмдэглэсэн хуудас",
};

export default function MapPage() {
  return (
    <main className="osm-page">
      <header className="osm-header">
        <h1> OpenStreetMap</h1>
        <p>5 LOCATIONS PINNED ON MAP. CLICK TO VIEW</p>
      </header>
      <MapLoader />
    </main>
  );
}
