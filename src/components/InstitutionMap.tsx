import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
    __gmapsInitCallbacks?: Array<() => void>;
    __gmapsInit?: () => void;
  }
}

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}

interface Props {
  markers: MapMarker[];
  height?: number;
}

const API_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
const CHANNEL = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.google?.maps) return resolve();

    window.__gmapsInitCallbacks = window.__gmapsInitCallbacks || [];
    window.__gmapsInitCallbacks.push(() => resolve());

    if (document.getElementById("gmaps-js")) return; // already loading

    window.__gmapsInit = () => {
      (window.__gmapsInitCallbacks || []).forEach((cb) => cb());
      window.__gmapsInitCallbacks = [];
    };

    const s = document.createElement("script");
    s.id = "gmaps-js";
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&loading=async&callback=__gmapsInit&channel=${CHANNEL}`;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
}

const InstitutionMap = ({ markers, height = 360 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!API_KEY) {
      setError("Map unavailable");
      return;
    }
    if (!markers.length) return;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !ref.current) return;
        const { google } = window;
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));

        const map = new google.maps.Map(ref.current, {
          center: bounds.getCenter(),
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        });

        const info = new google.maps.InfoWindow();
        markers.forEach((m) => {
          const marker = new google.maps.Marker({
            position: { lat: m.lat, lng: m.lng },
            map,
            title: m.title,
          });
          marker.addListener("click", () => {
            info.setContent(
              `<div style="font-family:Inter,sans-serif;padding:2px 4px">
                <div style="font-weight:600;color:#0f1b3d">${m.title}</div>
                ${m.subtitle ? `<div style="font-size:12px;color:#475569;margin-top:2px">${m.subtitle}</div>` : ""}
              </div>`,
            );
            info.open({ anchor: marker, map });
          });
        });

        if (markers.length > 1) {
          map.fitBounds(bounds, 60);
        }
      })
      .catch((e) => setError(e.message || "Map failed to load"));

    return () => {
      cancelled = true;
    };
  }, [markers]);

  if (error) {
    return (
      <div
        className="w-full rounded-xl border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        {error}
      </div>
    );
  }

  return <div ref={ref} className="w-full rounded-xl border overflow-hidden" style={{ height }} />;
};

export default InstitutionMap;
