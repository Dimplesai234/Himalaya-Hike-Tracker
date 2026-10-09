import { useEffect, useState } from "react";
import "../styles/TotalDistance.css";

const API_URL = "http://localhost:8080/api/hikes/total-distance";

function TotalDistance({ refreshKey }) {
    const [totalDistance, setTotalDistance] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTotalDistance();
    }, [refreshKey]);

    async function fetchTotalDistance() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch total distance");
            }

            const data = await response.json();
            setTotalDistance(data.totalDistanceKm);
        } catch (err) {
            console.error("Error fetching total distance:", err);
            setError("Unable to load total distance.");
        }
    }

    return (
        <section className="total-distance">
            <h2>Total Distance Covered</h2>

            {error ? (
                <p>{error}</p>
            ) : (
                <p className="distance-value">
                    {Number(totalDistance).toFixed(2)} km
                </p>
            )}
        </section>
    );
}

export default TotalDistance;