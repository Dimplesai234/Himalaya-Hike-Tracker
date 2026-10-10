/*
  HikeList component displays saved hikes, allows users to edit or delete
  a hike, and refreshes the list when refreshKey changes.
 */
import { useEffect, useState } from "react";
import "../styles/HikeList.css";

// Backend API endpoint for fetching, updating, and deleting hikes.
const API_URL = "http://localhost:8080/api/hikes";

function HikeList({ refreshKey, onEditHike, onHikeDeleted }) {
  // Stores the list of hikes retrieved from the backend.
  const [hikes, setHikes] = useState([]);

  // Tracks whether the hike list is currently loading.
  const [loading, setLoading] = useState(true);

  // Stores an error message if an API operation fails.
  const [error, setError] = useState("");

  // Stores the ID of the hike currently being deleted.
  const [deletingId, setDeletingId] = useState(null);

  // Fetches hikes when the component mounts or refreshKey changes.
  useEffect(() => {
    // Prevents state updates if the component is no longer active.
    let cancelled = false;

    // Retrieves all saved hikes from the backend API.
    async function fetchHikes() {
      setLoading(true);
      setError("");

      try {
        // Send a GET request to retrieve the saved hikes.
        const response = await fetch(API_URL);

        // Throw an error if the server returns an unsuccessful status.
        if (!response.ok) {
          throw new Error("Failed to fetch hikes");
        }

        // Convert the JSON response into a JavaScript value.
        const data = await response.json();

        // Update the hike list only if the request is still active.
        if (!cancelled) {
          setHikes(data);
        }
      } catch (err) {
        // Log the technical error for debugging.
        console.error("Error fetching hikes:", err);

        // Display a user-friendly error message.
        if (!cancelled) {
          setError(
            "Unable to load hikes. Please check whether the backend is running."
          );
        }
      } finally {
        // Stop displaying the loading state if the request is still active.
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    // Start fetching hikes when the effect runs.
    fetchHikes();

    // Cleanup runs before the effect repeats or the component unmounts.
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Deletes a selected hike after asking the user for confirmation.
  async function handleDelete(hike) {
    // Confirm the deletion before making the API request.
    const confirmed = window.confirm(
      `Are you sure you want to delete the hike from ${hike.startLocation} to ${hike.endLocation}?`
    );

    // Stop the operation if the user cancels.
    if (!confirmed) return;

    // Track the selected hike and clear any previous error.
    setDeletingId(hike.id);
    setError("");

    try {
      // Send a DELETE request for the selected hike.
      const response = await fetch(`${API_URL}/${hike.id}`, {
        method: "DELETE",
      });

      // Handle unsuccessful responses from the backend.
      if (!response.ok) {
        throw new Error("Failed to delete hike");
      }

      // Remove the deleted hike from the UI without fetching the full list again.
      setHikes((previousHikes) =>
        previousHikes.filter((item) => item.id !== hike.id)
      );

      // Notify the parent component so related data can be refreshed.
      if (onHikeDeleted) {
        onHikeDeleted();
      }
    } catch (err) {
      // Log the technical error for debugging.
      console.error("Error deleting hike:", err);

      // Inform the user that the deletion failed.
      setError("Unable to delete this hike. Please try again.");
    } finally {
      // Clear the deleting state after the operation finishes.
      setDeletingId(null);
    }
  }

  // Display a loading message while the initial request is in progress.
  if (loading) {
    return <p className="hike-message">Loading your hikes...</p>;
  }

  // Render the saved hikes and their available actions.
  return (
    <section className="hike-list">
      <h2>My Saved Hikes</h2>

      {/* Display an error message when an operation fails. */}
      {error && (
        <p className="hike-message hike-error" role="alert">
          {error}
        </p>
      )}

      {/* Show an empty-state message when no hikes are available. */}
      {hikes.length === 0 ? (
        <p className="hike-message">
          No hikes recorded yet. Add your first hike above!
        </p>
      ) : (
        // Render each saved hike as an individual card.
        <div className="hike-list-container">
          {hikes.map((hike) => (
            <article className="hike-card" key={hike.id}>
              {/* Display the starting and ending locations. */}
              <h3>
                {hike.startLocation} → {hike.endLocation}
              </h3>

              {/* Display the hike date or a fallback message. */}
              <p>
                <strong>Date:</strong>{" "}
                {hike.hikeDate || "Not specified"}
              </p>

              {/* Display the distance rounded to two decimal places. */}
              <p>
                <strong>Distance:</strong>{" "}
                {Number(hike.distanceKm ?? 0).toFixed(2)} km
              </p>

              {/* Provide actions for editing and deleting the hike. */}
              <div className="hike-card-actions">
                <button
                  type="button"
                  // Pass the selected hike to the parent's edit handler.
                  onClick={() => onEditHike?.(hike)}
                  // Prevent editing while this hike is being deleted.
                  disabled={deletingId === hike.id}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  // Start the deletion process for the selected hike.
                  onClick={() => handleDelete(hike)}
                  // Prevent repeated deletion requests for the same hike.
                  disabled={deletingId === hike.id}
                >
                  {/* Show progress text while the deletion is in progress. */}
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

// Make HikeList available for import in other React components.
export default HikeList;
