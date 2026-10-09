
import { useState } from "react";
import HikeForm from "./components/HikeForm";
import HikeList from "./components/HikeList";
import TotalDistance from "./components/TotalDistance";
import HikeMap from "./components/HikeMap";
import "./styles/App.css";

function App() {
  const [activeTab, setActiveTab] = useState("view");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedHike, setSelectedHike] = useState(null);

  function handleHikeSaved() {
    setRefreshKey((previousKey) => previousKey + 1);
    setSelectedHike(null);
    setActiveTab("view");
  }

  function handleHikeDeleted() {
    setRefreshKey((previousKey) => previousKey + 1);
  }

  function handleEditHike(hike) {
    setSelectedHike(hike);
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setSelectedHike(null);
  }

  function handleTabChange(tab) {
    setActiveTab(tab);

    if (tab === "view") {
      setSelectedHike(null);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Himalaya Hike Tracker</h1>
        <p>Your hiking journey, all in one place.</p>
      </header>

      <nav className="app-tabs" aria-label="Main navigation">
        <button
          type="button"
          className={activeTab === "add" ? "active" : ""}
          aria-pressed={activeTab === "add"}
          onClick={() => handleTabChange("add")}
        >
          {selectedHike ? "Edit Hike" : "Add Hike"}
        </button>

        <button
          type="button"
          className={activeTab === "view" ? "active" : ""}
          aria-pressed={activeTab === "view"}
          onClick={() => handleTabChange("view")}
        >
          View Hikes
        </button>
      </nav>

      {activeTab === "add" && (
        <HikeForm
          key={selectedHike?.id ?? "new-hike"}
          hikeToEdit={selectedHike}
          onHikeAdded={handleHikeSaved}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {activeTab === "view" && (
        <>
          <TotalDistance refreshKey={refreshKey} />

          <HikeMap refreshKey={refreshKey} />

          <HikeList
            refreshKey={refreshKey}
            onEditHike={handleEditHike}
            onHikeDeleted={handleHikeDeleted}
          />
        </>
      )}
    </div>
  );
}

export default App;
