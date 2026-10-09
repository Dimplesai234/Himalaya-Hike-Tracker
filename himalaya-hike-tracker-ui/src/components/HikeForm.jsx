
import { useEffect, useState } from "react";
import "../styles/HikeForm.css";

const API_URL = "http://localhost:8080/api/hikes";

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
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(hikeToEdit);

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

    setError("");
  }, [hikeToEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const coordinateFields = [
      formData.startLatitude,
      formData.startLongitude,
      formData.endLatitude,
      formData.endLongitude,
    ];

    if (
      coordinateFields.some(
        (value) => String(value).trim() === ""
      )
    ) {
      setError("Please enter all four coordinates.");
      return;
    }

    const coordinates = coordinateFields.map(Number);

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

    const hikeData = {
      startLocation: formData.startLocation.trim(),
      endLocation: formData.endLocation.trim(),
      startLatitude: coordinates[0],
      startLongitude: coordinates[1],
      endLatitude: coordinates[2],
      endLongitude: coordinates[3],
      hikeDate: formData.hikeDate || null,
    };

    if (!hikeData.startLocation || !hikeData.endLocation) {
      setError("Start location and end location are required.");
      return;
    }

    setSubmitting(true);

    try {
      const url = isEditing
        ? `${API_URL}/${hikeToEdit.id}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hikeData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Unable to ${isEditing ? "update" : "add"} hike.`
        );
      }

      setFormData({ ...EMPTY_FORM });

      // Refresh data and return to the View Hikes tab.
      if (onHikeAdded) {
        onHikeAdded();
      }

      window.alert(
        isEditing
          ? "Hike updated successfully!"
          : "Hike added successfully!"
      );
    } catch (err) {
      console.error("Error saving hike:", err);
      setError(
        err.message || "Unable to save hike. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setFormData({ ...EMPTY_FORM });
    setError("");

    if (onCancelEdit) {
      onCancelEdit();
    }
  }

  return (
    <section className="hike-form">
      <h2>{isEditing ? "Edit Hike" : "Add New Hike"}</h2>

      <form onSubmit={handleSubmit}>
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

        {error && (
          <p className="hike-error" role="alert">
            {error}
          </p>
        )}

        <div className="hike-form-actions">
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Hike"
                : "Add Hike"}
          </button>

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

export default HikeForm;
