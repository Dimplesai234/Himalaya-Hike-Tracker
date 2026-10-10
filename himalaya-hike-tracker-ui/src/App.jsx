/*
  App is the root component of the Himalaya Hike Tracker application.
  It manages login and registration, navigation between tabs, and the
  selected hike being edited. It also coordinates the hike form, saved
  hike list, total distance summary, and interactive map.
 */
import { useState } from "react";
import HikeForm from "./components/HikeForm";
import HikeList from "./components/HikeList";
import TotalDistance from "./components/TotalDistance";
import HikeMap from "./components/HikeMap";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles/App.css";
import "./styles/Auth.css";

function App() {
  // Controls which main section is displayed: adding or viewing hikes.
  const [activeTab, setActiveTab] = useState("view");

  // Triggers child components to refresh their data after hike changes.
  const [refreshKey, setRefreshKey] = useState(0);

  // Stores the hike currently selected for editing, or null when none is selected.
  const [selectedHike, setSelectedHike] = useState(null);

  // Restores the login state for the current browser tab using sessionStorage.
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("hikeTrackerLoggedIn") === "true"
  );

  // Determines whether the login or registration form is displayed.
  const [showLogin, setShowLogin] = useState(true);

  // Updates the application state after a successful login.
  function handleLoginSuccess() {
    // Store a simple login flag for the current browser tab session.
    sessionStorage.setItem("hikeTrackerLoggedIn", "true");

    setIsLoggedIn(true);
    setActiveTab("view");
  }

  // Logs the user out and resets the relevant application state.
  function handleLogout() {
    // Remove the stored login flag from the current browser tab session.
    sessionStorage.removeItem("hikeTrackerLoggedIn");

    setIsLoggedIn(false);
    setShowLogin(true);
    setSelectedHike(null);
    setActiveTab("view");
  }

  // Handles successful hike creation or updating.
  function handleHikeSaved() {
    // Change the refresh key so child components fetch the latest data.
    setRefreshKey((previousKey) => previousKey + 1);

    // Clear the editing selection and return to the saved hikes view.
    setSelectedHike(null);
    setActiveTab("view");
  }

  // Refreshes dependent data after a hike has been deleted.
  function handleHikeDeleted() {
    setRefreshKey((previousKey) => previousKey + 1);
  }

  // Selects a hike for editing and navigates to the form.
  function handleEditHike(hike) {
    setSelectedHike(hike);
    setActiveTab("add");

    // Scroll to the top so the editing form is visible.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Clears the selected hike when the user cancels editing.
  function handleCancelEdit() {
    setSelectedHike(null);
  }

  // Changes the active tab and clears the editing selection when viewing hikes.
  function handleTabChange(tab) {
    setActiveTab(tab);

    if (tab === "view") {
      setSelectedHike(null);
    }
  }

  // Render the application header and the appropriate authenticated interface.
  return (
    <div className="app">
      {/* Display the application name and introductory message. */}
      <header className="app-header">
        <h1>Himalaya Hike Tracker</h1>
        <p>Your hiking journey, all in one place.</p>
      </header>

      {/* Show authentication forms until the user is logged in. */}
      {!isLoggedIn ? (
        <div className="auth-container">
          {showLogin ? (
            // Display the login form and handle successful authentication.
            <Login
              onSwitch={() => setShowLogin(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            // Display registration and allow switching back to login.
            <Register
              onSwitch={() => setShowLogin(true)}
            />
          )}
        </div>
      ) : (
        <>
          {/* Provide the logout action for authenticated users. */}
          <div className="app-toolbar">
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Navigation allows users to switch between adding and viewing hikes. */}
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

          {/* Display the hike form when the Add Hike or Edit Hike tab is active. */}
          {activeTab === "add" && (
            <HikeForm
              // Reset the form when switching between different hikes or a new hike.
              key={selectedHike?.id ?? "new-hike"}
              hikeToEdit={selectedHike}
              onHikeAdded={handleHikeSaved}
              onCancelEdit={handleCancelEdit}
            />
          )}

          {/* Display the summary, map, and saved hikes on the View Hikes tab. */}
          {activeTab === "view" && (
            <>
              {/* Show the combined distance of all recorded hikes. */}
              <TotalDistance refreshKey={refreshKey} />

              {/* Display hike starting and ending points on an interactive map. */}
              <HikeMap refreshKey={refreshKey} />

              {/* List saved hikes and provide edit and delete actions. */}
              <HikeList
                refreshKey={refreshKey}
                onEditHike={handleEditH
