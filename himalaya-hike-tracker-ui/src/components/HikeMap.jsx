/*
  HikeMap fetches saved hikes and displays their start and end locations
  as markers, connected by a line on an interactive Leaflet map.
 */
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

// Backend API endpoint for retrieving saved hikes.
const API_URL = "http://localhost:8080/api/hikes";

// Default map center, used before hike coordinates are available.
const DEFAULT_CENTER = [30.5, 79.0];

/*
  MapBounds adjusts the visible map area to include all valid
  start and end coordinates belonging to the saved hikes.
 */
function MapBounds({ hikes }) {
  // Access the Leaflet map instance provided by MapContainer.
  const map = useMap();

  // Recalculate the visible map area when hikes or the map instance changes.
  useEffect(() => {
    // Extract the start and end coordinates from every hike.
    const coordinates = hikes.flatMap((hike) => [
      [Number(hike.startLatitude), Number(hike.startLongitude)],
      [Number(hike.endLatitude), Number(hike.endLongitude)],
    ]);

    // Keep only coordinates within valid latitude and longitude ranges.
    const validCoordinates = coordinates.filter(
      ([lat, lng]) =>
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
    );

    // Adjust the map to show all valid coordinates when available.
    if (validCoordinates.length > 0) {
      map.fitBounds(validCoordinates, {
        padding: [40, 40], // Keep some space around the visible coordinates.
        maxZoom: 8,        // Prevent the map from zooming in too closely.
      });
    }
  }, [hikes, map]);

  // This component controls the map but does not render visible elements.
  return null;
}

function HikeMap({ refreshKey = 0 }) {
  // Stores the hikes retrieved from the backend.
  const [hikes, setHikes] = useState([]);

  // Stores an error message if the API request fails.
  const [error, setError] = useState("");

  // Fetch the latest hikes when the component mounts or refreshKey changes.
  useEffect(() => {
    // Retrieves saved hikes from the backend API.
    async function fetchHikes() {
      try {
        // Send a GET request to retrieve all hikes.
        const response = await fetch(API_URL);

        // Handle unsuccessful HTTP responses.
        if (!response.ok) {
          throw new Error("Could not fetch hikes");
        }

        // Convert the JSON response into a JavaScript array.
        const data = await response.json();

        // Print hike details in a table to help debug coordinate values.
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

        // Update the map with the retrieved hikes.
        setHikes(data);

        // Clear any previous error after a successful request.
        setError("");
      } catch (err) {
        // Log the technical error for debugging.
        console.error(err);

        // Display a user-friendly error message.
        setError("Unable to load hike locations.");
      }
    }

    // Start fetching hikes.
    fetchHikes();
  }, [refreshKey]);

  // Keep hikes whose start and end coordinates contain numeric values.
  const validHikes = hikes.filter((hike) =>
    [
      hike.startLatitude,
      hike.startLongitude,
      hike.endLatitude,
      hike.endLongitude,
    ].every(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        Number.isFinite(Number(value))
    )
  );

  // Render the map, its markers, and the connecting route lines.
  return (
    <section className="hike-map-section">
      <h2>Explore Your Hikes</h2>
      <p>View your recorded start and end locations on the map.</p>

      {/* Display an error if the hike request fails. */}
      {error && <p className="hike-map-message">{error}</p>}

      {/* Explain why the map has no hike markers when none are valid. */}
      {!error && validHikes.length === 0 && (
        <p className="hike-map-message">
          Add a hike with valid coordinates to see it on the map.
        </p>
      )}

      {/* Create the interactive Leaflet map. */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        minZoom={3}
        scrollWheelZoom={true}
        className="hike-map"
      >
        {/* Load map tiles from OpenStreetMap. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Automatically adjust the map to include all valid hike locations. */}
        <MapBounds hikes={validHikes} />

        {/* Create markers and a connecting line for every valid hike. */}
        {validHikes.map((hike) => {
          // Convert the start coordinates into numeric values.
          const start = [
            Number(hike.startLatitude),
            Number(hike.startLongitude),
          ];

          // Convert the end coordinates into numeric values.
          const end = [
            Number(hike.endLatitude),
            Number(hike.endLongitude),
          ];

          return (
            <div key={hike.id}>
              {/* Display a marker for the hike's starting location. */}
              <Marker position={start}>
                <Popup>
                  <strong>{hike.startLocation}</strong>
                  <br />
                  Start location
                </Popup>
              </Marker>

              {/* Display a marker for the hike's ending location. */}
              <Marker position={end}>
                <Popup>
                  <strong>{hike.endLocation}</strong>
                  <br />
                  End location
                </Popup>
              </Marker>

              {/* Draw a straight line between the start and end points. */}
              <Polyline positions={[start, end]} />
            </div>
          );
        })}
      </MapContainer>
    </section>
  );
}

// Make HikeMap available for import in other React components.
export default HikeMap;
