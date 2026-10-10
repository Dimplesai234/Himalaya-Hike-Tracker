/*
  TotalDistance component displays the combined distance of all saved hikes.
  It refreshes the total whenever refreshKey changes.
 */
import { useEffect, useState } from "react";
import "../styles/TotalDistance.css";

// Backend API endpoint for retrieving the total distance covered.
const API_URL = "http://localhost:8080/api/hikes/total-distance";

function TotalDistance({ refreshKey }) {
    // Stores the total distance returned by the backend, in kilometers.
    const [totalDistance, setTotalDistance] = useState(0);

    // Stores an error message if the API request fails.
    const [error, setError] = useState("");

    // Fetch the total distance when the component mounts or refreshKey changes.
    useEffect(() => {
        fetchTotalDistance();
    }, [refreshKey]);

    // Retrieves the total distance from the backend API.
    async function fetchTotalDistance() {
        try {
            // Send a GET request to retrieve the total distance.
            const response = await fetch(API_URL);

            // Handle unsuccessful HTTP responses.
            if (!response.ok) {
                throw new Error("Failed to fetch total distance");
            }

            // Convert the JSON response into a JavaScript object.
            const data = await response.json();

            // Update the displayed distance using the value from the response.
            setTotalDistance(data.totalDistanceKm);

            // Clear any previous error after a successful request.
            setError("");
        } catch (err) {
            // Log the technical error for debugging.
            console.error("Error fetching total distance:", err);

            // Display a user-friendly error message.
            setError("Unable to load total distance.");
        }
    }

    // Render the total distance or an error message.
    return (
        <section className="total-distance">
            <h2>Total Distance Covered</h2>

            {/* Display an error if the API request fails. */}
            {error ? (
                <p>{error}</p>
            ) : (
                // Display the total distance rounded to two decimal places.
                <p className="distance-value">
                    {Number(totalDistance).toFixed(2)} km
                </p>
            )}
        </section>
    );
}

// Make TotalDistance available for import in other React components.
export default TotalDistance;
