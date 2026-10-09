
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/HikeMap.css";

const API_URL = "http://localhost:8080/api/hikes";
const DEFAULT_CENTER = [30.5, 79.0];


function MapBounds({ hikes }) {
  const map = useMap();

  useEffect(() => {
    const coordinates = hikes.flatMap((hike) => [
      [Number(hike.startLatitude), Number(hike.startLongitude)],
      [Number(hike.endLatitude), Number(hike.endLongitude)],
    ]);

    const validCoordinates = coordinates.filter(
      ([lat, lng]) =>
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );

    if (validCoordinates.length > 0) {
      map.fitBounds(validCoordinates, {
        padding: [40, 40],
        maxZoom: 8,
      });
    }
  }, [hikes, map]);

  return null;
}


function HikeMap({ refreshKey = 0 }) {
  const [hikes, setHikes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHikes() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not fetch hikes");
        }

        const data = await response.json();

console.table(
  data.map((hike) => ({
    id: hike.id,
    start: hike.startLocation,
    startLat: hike.startLatitude,
    startLng: hike.startLongitude,
    end: hike.endLocation,
    endLat: hike.endLatitude,
    endLng: hike.endLongitude,
    distanceKm: hike.distanceKm,
  }))
);

setHikes(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load hike locations.");
      }
    }

    fetchHikes();
  }, [refreshKey]);

  const validHikes = hikes.filter((hike) =>
    [hike.startLatitude, hike.startLongitude,
      hike.endLatitude, hike.endLongitude].every(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        Number.isFinite(Number(value))
    )
  );

  return (
    <section className="hike-map-section">
      <h2>Explore Your Hikes</h2>
      <p>View your recorded start and end locations on the map.</p>

      {error && <p className="hike-map-message">{error}</p>}

      {!error && validHikes.length === 0 && (
        <p className="hike-map-message">
          Add a hike with valid coordinates to see it on the map.
        </p>
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        minZoom={3}
        scrollWheelZoom={true}
        className="hike-map"
       >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds hikes={validHikes} />

        {validHikes.map((hike) => {
          const start = [
            Number(hike.startLatitude),
            Number(hike.startLongitude),
          ];

          const end = [
            Number(hike.endLatitude),
            Number(hike.endLongitude),
          ];

          return (
            <div key={hike.id}>
              <Marker position={start}>
                <Popup>
                  <strong>{hike.startLocation}</strong>
                  <br />
                  Start location
                </Popup>
              </Marker>

              <Marker position={end}>
                <Popup>
                  <strong>{hike.endLocation}</strong>
                  <br />
                  End location
                </Popup>
              </Marker>

              <Polyline positions={[start, end]} />
            </div>
          );
        })}
      </MapContainer>
    </section>
  );
}

export default HikeMap;

