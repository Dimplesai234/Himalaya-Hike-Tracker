import { useState } from "react";

function HikeForm() {

    const [formData, setFormData] = useState({
        startLocation: "",
        endLocation: "",
        startLatitude: "",
        startLongitude: "",
        endLatitude: "",
        endLongitude: "",
        hikeDate: ""
    });

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        const hikeData = {
            startLocation: formData.startLocation,
            endLocation: formData.endLocation,
            startLatitude: Number(formData.startLatitude),
            startLongitude: Number(formData.startLongitude),
            endLatitude: Number(formData.endLatitude),
            endLongitude: Number(formData.endLongitude),
            hikeDate: formData.hikeDate
        };

        console.log("Hike data:", hikeData);

        try {

            const response = await fetch(
                "http://localhost:8080/api/hikes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(hikeData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add hike");
            }

            const savedHike = await response.json();

            console.log("Hike saved successfully:", savedHike);

            alert("Hike added successfully!");

            setFormData({
                startLocation: "",
                endLocation: "",
                startLatitude: "",
                startLongitude: "",
                endLatitude: "",
                endLongitude: "",
                hikeDate: ""
            });

        } catch (error) {

            console.error("Error adding hike:", error);

            alert("Failed to add hike. Please check whether the backend is running.");
        }
    };

    return (
        <div>

            <h2>Add New Hike</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Start Location</label>
                    <input
                        type="text"
                        name="startLocation"
                        value={formData.startLocation}
                        onChange={handleChange}
                        placeholder="e.g. Manali"
                        required
                    />
                </div>

                <div>
                    <label>End Location</label>
                    <input
                        type="text"
                        name="endLocation"
                        value={formData.endLocation}
                        onChange={handleChange}
                        placeholder="e.g. Rohtang Pass"
                        required
                    />
                </div>

                <div>
                    <label>Start Latitude</label>
                    <input
                        type="number"
                        name="startLatitude"
                        value={formData.startLatitude}
                        onChange={handleChange}
                        step="any"
                        placeholder="e.g. 32.2396"
                        required
                    />
                </div>

                <div>
                    <label>Start Longitude</label>
                    <input
                        type="number"
                        name="startLongitude"
                        value={formData.startLongitude}
                        onChange={handleChange}
                        step="any"
                        placeholder="e.g. 77.1887"
                        required
                    />
                </div>

                <div>
                    <label>End Latitude</label>
                    <input
                        type="number"
                        name="endLatitude"
                        value={formData.endLatitude}
                        onChange={handleChange}
                        step="any"
                        placeholder="e.g. 32.3656"
                        required
                    />
                </div>

                <div>
                    <label>End Longitude</label>
                    <input
                        type="number"
                        name="endLongitude"
                        value={formData.endLongitude}
                        onChange={handleChange}
                        step="any"
                        placeholder="e.g. 77.2495"
                        required
                    />
                </div>

                <div>
                    <label>Hike Date</label>
                    <input
                        type="date"
                        name="hikeDate"
                        value={formData.hikeDate}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    Add Hike
                </button>

            </form>

        </div>
    );
}

export default HikeForm;