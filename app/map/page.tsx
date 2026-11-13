import type { Metadata } from "next";
import MapLoader from "../../components/map/MapLoader";

export const metadata: Metadata = {
  title: "Газрын зураг · OpenStreetMap",
  description: "Улаанбаатарын хэдэн газрыг OpenStreetMap дээр marker-ээр тэмдэглэсэн хуудас",
};

export default function MapPage() {
  return (
    <main className="osm-page">
      <header className="osm-header">
        <h1>Улаанбаатар · OpenStreetMap</h1>
        <p>5 газрыг marker-ээр тэмдэглэв. Жагсаалтаас сонгоход газрын зураг тухайн цэг рүү очно.</p>
      </header>
      <MapLoader />
    </main>
  );
}
