
import { useEffect, useState } from "react";
import "../styles/HikeList.css";

const API_URL = "http://localhost:8080/api/hikes";

function HikeList({ refreshKey, onEditHike, onHikeDeleted }) {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchHikes() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch hikes");
        }

        const data = await response.json();

        if (!cancelled) {
          setHikes(data);
        }
      } catch (err) {
        console.error("Error fetching hikes:", err);

        if (!cancelled) {
          setError(
            "Unable to load hikes. Please check whether the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchHikes();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleDelete(hike) {
    const confirmed = window.confirm(
      `Are you sure you want to delete the hike from ${hike.startLocation} to ${hike.endLocation}?`
    );

    if (!confirmed) return;

    setDeletingId(hike.id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${hike.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete hike");
      }

      setHikes((previousHikes) =>
        previousHikes.filter((item) => item.id !== hike.id)
      );

      if (onHikeDeleted) {
        onHikeDeleted();
      }
    } catch (err) {
      console.error("Error deleting hike:", err);
      setError("Unable to delete this hike. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <p className="hike-message">Loading your hikes...</p>;
  }

  return (
    <section className="hike-list">
      <h2>My Saved Hikes</h2>

      {error && (
        <p className="hike-message hike-error" role="alert">
          {error}
        </p>
      )}

      {hikes.length === 0 ? (
        <p className="hike-message">
          No hikes recorded yet. Add your first hike above!
        </p>
      ) : (
        <div className="hike-list-container">
          {hikes.map((hike) => (
            <article className="hike-card" key={hike.id}>
              <h3>
                {hike.startLocation} → {hike.endLocation}
              </h3>

              <p>
                <strong>Date:</strong>{" "}
                {hike.hikeDate || "Not specified"}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {Number(hike.distanceKm ?? 0).toFixed(2)} km
              </p>

              <div className="hike-card-actions">
                <button
                  type="button"
                  onClick={() => onEditHike?.(hike)}
                  disabled={deletingId === hike.id}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(hike)}
                  disabled={deletingId === hike.id}
                >
                  {deletingId === hike.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HikeList;
