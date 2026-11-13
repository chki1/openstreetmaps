"use client";

import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { PLACES, type Place } from "../../data/places";

// OpenStreetMap-ийн үндсэн tile сервер. Ашиглахдаа attribution заавал харуулна.
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Geolocation алдааны кодууд: 1 = зөвшөөрөлгүй, 2 = олдсонгүй, 3 = хугацаа хэтэрсэн.
const GEO_ERRORS: Record<number, string> = {
  1: "Allow Location?.",
  2: "Cannot find the Location.",
  3: "Finding Location...",
};

// Зураг файлгүй, CSS-ээр зурсан marker (Next.js дээр Leaflet-ийн default icon-ы зам эвдэрдэг асуудлаас зайлсхийнэ).
function pinIcon(index: number) {
  return L.divIcon({
    className: "osm-pin",
    html: `<span class="osm-pin__body"><span class="osm-pin__label">${index + 1}</span></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 29],
    popupAnchor: [0, -28],
  });
}

function popupHtml(p: Place) {
  const osmLink = `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=17/${p.lat}/${p.lng}`;
  return `
    <div class="osm-popup">
      <strong>${p.name}</strong>
      <p>${p.description}</p>
      <code>${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}</code>
      <a href="${osmLink}" target="_blank" rel="noopener noreferrer">OpenStreetMap дээр нээх ↗</a>
    </div>`;
}

export default function OsmMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // --- Live location  ---
  const watchIdRef = useRef<number | null>(null); // watchPosition-ий буцаасан id (зогсооход хэрэгтэй)
  const userDotRef = useRef<L.CircleMarker | null>(null); // цэнхэр цэг
  const accuracyRef = useRef<L.Circle | null>(null); // нарийвчлалын тойрог
  const hasCenteredRef = useRef(false); // анхны байршил дээр нэг л удаа zoom хийнэ
  const [tracking, setTracking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container);

    // Бүх цэг харагдахаар эхний байрлалыг тохируулна.
    const bounds = L.latLngBounds(PLACES.map((p) => [p.lat, p.lng] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [40, 40] });

    L.tileLayer(OSM_TILES, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);

    const markers: Record<string, L.Marker> = {};
    PLACES.forEach((p, i) => {
      markers[p.id] = L.marker([p.lat, p.lng], { icon: pinIcon(i), title: p.name, alt: p.name })
        .addTo(map)
        .bindPopup(popupHtml(p));
    });

    mapRef.current = map;
    markersRef.current = markers;

    // Хуудаснаас гарах үед: байршил хянахаа зогсоож, газрын зургийг устгана.
    // (React StrictMode dev горимд effect-ийг 2 удаа ажиллуулдаг тул энэ заавал хэрэгтэй.)
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      userDotRef.current = null;
      accuracyRef.current = null;
    };
  }, []);

  // Шинэ байршил ирэх бүрт ажиллана.
  function handlePosition(pos: GeolocationPosition) {
    const map = mapRef.current;
    if (!map) return;

    const { latitude, longitude, accuracy } = pos.coords;
    const here: L.LatLngTuple = [latitude, longitude];

    let circle = accuracyRef.current;
    let dot = userDotRef.current;

    if (!circle || !dot) {
      // Анхны байршил: тойрог болон цэгийг үүсгэнэ.
      circle = L.circle(here, {
        radius: accuracy,
        color: "#0b6ef3",
        weight: 1,
        fillOpacity: 0.15,
        interactive: false,
      }).addTo(map);
      dot = L.circleMarker(here, {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#0b6ef3",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup("Та энд байна");
      accuracyRef.current = circle;
      userDotRef.current = dot;
    } else {
      // Дараагийн байршлууд: шинээр үүсгэхгүй, зөвхөн зөөнө.
      circle.setLatLng(here).setRadius(accuracy);
      dot.setLatLng(here);
    }

    if (!hasCenteredRef.current) {
      map.fitBounds(circle.getBounds(), { maxZoom: 17 });
      hasCenteredRef.current = true;
    }

    setStatus(`Нарийвчлал: ±${Math.round(accuracy)} м`);
  }

  function handleError(err: GeolocationPositionError) {
    if (err.code === err.PERMISSION_DENIED) stopTracking();
    setStatus(GEO_ERRORS[err.code] ?? "Байршил авахад алдаа гарлаа.");
  }

  function startTracking() {
    if (watchIdRef.current !== null) return;
    if (!("geolocation" in navigator)) {
      setStatus("Энэ browser байршил тодорхойлох боломжгүй.");
      return;
    }
    if (!window.isSecureContext) {
      setStatus("Байршил зөвхөн https:// эсвэл localhost хаяг дээр ажиллана.");
      return;
    }

    hasCenteredRef.current = false;
    setTracking(true);
    setStatus("Байршлыг хайж байна…");

    watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    });
  }

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    userDotRef.current?.remove();
    accuracyRef.current?.remove();
    userDotRef.current = null;
    accuracyRef.current = null;
    setTracking(false);
    setStatus(null);
  }

  function centerOnMe() {
    const map = mapRef.current;
    const dot = userDotRef.current;
    if (!map || !dot) return;
    map.flyTo(dot.getLatLng(), Math.max(map.getZoom(), 16), { duration: 0.8 });
  }

  function focusPlace(p: Place) {
    const map = mapRef.current;
    const marker = markersRef.current[p.id];
    if (!map || !marker) return;
    map.once("moveend", () => marker.openPopup());
    map.flyTo([p.lat, p.lng], 16, { duration: 0.8 });
  }

  return (
    <div className="osm-layout">
      <div ref={containerRef} className="osm-map" role="region" aria-label="Улаанбаатарын газрын зураг" />

      <div className="osm-side">
        <div className="osm-locate">
          <div className="osm-locate__buttons">
            <button
              type="button"
              className="osm-btn osm-btn--primary"
              onClick={tracking ? stopTracking : startTracking}
              aria-pressed={tracking}
            >
              {tracking ? "Зогсоох" : "Миний байршил"}
            </button>
            {tracking && (
              <button type="button" className="osm-btn" onClick={centerOnMe}>
                Над руу очих
              </button>
            )}
          </div>
          {status && (
            <p className="osm-status" role="status">
              {status}
            </p>
          )}
        </div>

        <ol className="osm-list">
          {PLACES.map((p, i) => (
            <li key={p.id}>
              <button type="button" onClick={() => focusPlace(p)}>
                <span className="osm-list__num">{i + 1}</span>
                <span className="osm-list__text">
                  <span className="osm-list__name">{p.name}</span>
                  <span className="osm-list__coords">
                    {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
