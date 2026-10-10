/*
  HikeForm provides a form for adding new hikes and editing existing ones.
  It manages form data, validates locations and coordinates, and sends
  POST or PUT requests to the Spring Boot backend to save hike details.
 */
import { useEffect, useState } from "react";
import "../styles/HikeForm.css";

// Backend API endpoint for creating and managing hikes.
const API_URL = "http://localhost:8080/api/hikes";

// Default values used when creating a new hike or resetting the form.
const EMPTY_FORM = {
  startLocation: "",
  endLocation: "",
  startLatitude: "",
  startLongitude: "",
  endLatitude: "",
  endLongitude: "",
  hikeDate: "",
};

function HikeForm({ hikeToEdit, onHikeAdded, onCancelEdit }) {
  // Stores the current values entered into the form.
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // Tracks whether a form submission is in progress.
  const [submitting, setSubmitting] = useState(false);

  // Stores validation errors and API failure messages.
  const [error, setError] = useState("");

  // Determines whether the form is adding a hike or editing an existing one.
  const isEditing = Boolean(hikeToEdit);

  // Populate the form when editing a hike, or reset it for a new hike.
  useEffect(() => {
    if (hikeToEdit) {
      setFormData({
        startLocation: hikeToEdit.startLocation ?? "",
        endLocation: hikeToEdit.endLocation ?? "",
        startLatitude: hikeToEdit.startLatitude ?? "",
        startLongitude: hikeToEdit.startLongitude ?? "",
        endLatitude: hikeToEdit.endLatitude ?? "",
        endLongitude: hikeToEdit.endLongitude ?? "",
        hikeDate: hikeToEdit.hikeDate ?? "",
      });
    } else {
      setFormData({ ...EMPTY_FORM });
    }

    // Clear previous errors whenever the selected hike changes.
    setError("");
  }, [hikeToEdit]);

  // Updates the corresponding form field whenever the user types or selects a value.
  function handleChange(event) {
    const { name, value } = event.target;

    // Update only the changed field while preserving the other form values.
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Validates the form and sends the hike data to the backend.
  async function handleSubmit(event) {
    // Prevent the browser from reloading the page on form submission.
    event.preventDefault();
    setError("");

    // Collect all four coordinates for validation.
    const coordinateFields = [
      formData.startLatitude,
      formData.startLongitude,
      formData.endLatitude,
      formData.endLongitude,
    ];

    // Ensure every coordinate field has a value.
    if (
      coordinateFields.some(
        (value) => String(value).trim() === ""
      )
    ) {
      setError("Please enter all four coordinates.");
      return;
    }

    // Convert coordinate values from strings to numbers.
    const coordinates = coordinateFields.map(Number);

    // Validate numeric values and their allowed latitude/longitude ranges.
    if (
      coordinates.some((value) => !Number.isFinite(value)) ||
      coordinates[0] < -90 ||
      coordinates[0] > 90 ||
      coordinates[1] < -180 ||
      coordinates[1] > 180 ||
      coordinates[2] < -90 ||
      coordinates[2] > 90 ||
      coordinates[3] < -180 ||
      coordinates[3] > 180
    ) {
      setError(
        "Enter valid coordinates: latitude must be between -90 and 90, and longitude between -180 and 180."
      );
      return;
    }

    // Prepare a clean object containing the data expected by the backend.
    const hikeData = {
      startLocation: formData.startLocation.trim(),
      endLocation: formData.endLocation.trim(),
      startLatitude: coordinates[0],
      startLongitude: coordinates[1],
      endLatitude: coordinates[2],
      endLongitude: coordinates[3],
      hikeDate: formData.hikeDate || null,
    };

    // Require both the starting and ending location names.
    if (!hikeData.startLocation || !hikeData.endLocation) {
      setError("Start location and end location are required.");
      return;
    }

    // Disable submission while the request is being processed.
    setSubmitting(true);

    try {
      // Use the selected hike's ID for updates, or the base URL for new hikes.
      const url = isEditing
        ? `${API_URL}/${hikeToEdit.id}`
        : API_URL;

      // Send POST to create a hike or PUT to update an existing hike.
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hikeData),
      });

      // Read the backend error response if the request fails.
      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Unable to ${isEditing ? "update" : "add"} hike.`
        );
      }

      // Reset the form after the hike is successfully saved.
      setFormData({ ...EMPTY_FORM });

      // Notify the parent component to refresh related hike data and navigation.
      if (onHikeAdded) {
        onHikeAdded();
      }

      // Inform the user that the operation was successful.
      window.alert(
        isEditing
          ? "Hike updated successfully!"
          : "Hike added successfully!"
      );
    } catch (err) {
      // Log the technical error for debugging.
      console.error("Error saving hike:", err);

      // Display an error message to the user.
      setError(
        err.message || "Unable to save hike. Please try again."
      );
    } finally {
      // Re-enable form submission whether the request succeeds or fails.
      setSubmitting(false);
    }
  }

  // Resets the form and notifies the parent when editing is cancelled.
  function handleCancel() {
    setFormData({ ...EMPTY_FORM });
    setError("");

    if (onCancelEdit) {
      onCancelEdit();
    }
  }

  // Render the form fields and the appropriate add, update, or cancel actions.
  return (
    <section className="hike-form">
      <h2>{isEditing ? "Edit Hike" : "Add New Hike"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Collect the starting location name. */}
        <div>
          <label htmlFor="startLocation">Start Location</label>
          <input
            id="startLocation"
            name="startLocation"
            type="text"
            value={formData.startLocation}
            onChange={handleChange}
            placeholder="e.g. Manali"
            required
          />
        </div>

        {/* Collect the destination location name. */}
        <div>
          <label htmlFor="endLocation">End Location</label>
          <input
            id="endLocation"
            name="endLocation"
            type="text"
            value={formData.endLocation}
            onChange={handleChange}
            placeholder="e.g. Rohtang Pass"
            required
          />
        </div>

        {/* Collect the starting latitude in decimal degrees. */}
        <div>
          <label htmlFor="startLatitude">Start Latitude</label>
          <input
            id="startLatitude"
            name="startLatitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={formData.startLatitude}
            onChange={handleChange}
            placeholder="e.g. 32.2396"
            required
          />
        </div>

        {/* Collect the starting longitude in decimal degrees. */}
        <div>
          <label htmlFor="startLongitude">Start Longitude</label>
          <input
            id="startLongitude"
            name="startLongitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={formData.startLongitude}
            onChange={handleChange}
            placeholder="e.g. 77.1887"
            required
          />
        </div>

        {/* Collect the destination latitude in decimal degrees. */}
        <div>
          <label htmlFor="endLatitude">End Latitude</label>
          <input
            id="endLatitude"
            name="endLatitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={formData.endLatitude}
            onChange={handleChange}
            placeholder="e.g. 32.3716"
            required
          />
        </div>

        {/* Collect the destination longitude in decimal degrees. */}
        <div>
          <label htmlFor="endLongitude">End Longitude</label>
          <input
            id="endLongitude"
            name="endLongitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={formData.endLongitude}
            onChange={handleChange}
            placeholder="e.g. 77.2465"
            required
          />
        </div>

        {/* Allow the user to specify the hike date optionally. */}
        <div>
          <label htmlFor="hikeDate">Hike Date (Optional)</label>
          <input
            id="hikeDate"
            name="hikeDate"
            type="date"
            value={formData.hikeDate}
            onChange={handleChange}
          />
        </div>

        {/* Display validation errors or backend error messages. */}
        {error && (
          <p className="hike-error" role="alert">
            {error}
          </p>
        )}

        {/* Show the relevant action buttons based on the current form mode. */}
        <div className="hike-form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Hike"
                : "Add Hike"}
          </button>

          {/* Show the cancel option only when editing an existing hike. */}
          {isEditing && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

// Export the component so it can be used by the parent application.
export default HikeForm;
