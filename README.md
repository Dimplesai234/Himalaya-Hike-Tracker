# Himalaya Hike Tracker

A full-stack web application to record, manage, and visualize hiking journeys.

## Features

- User registration and login
- Add, view, edit, and delete hikes
- Calculate total hiking distance
- View hike locations on an interactive map
- Store hike details in a MySQL database

## Technologies Used

**Backend:** Java, Spring Boot, Spring Data JPA, Maven

**Frontend:** React, Vite, JavaScript, CSS

**Database:** MySQL

**Map:** React Leaflet, OpenStreetMap

## Prerequisites

- Java 21
- Node.js and npm
- MySQL
- Maven

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Dimplesai234/Himalaya-Hike-Tracker.git
cd Himalaya-Hike-Tracker
```

### 2. Configure MySQL

Configure the database connection using environment variables before starting the backend:

- `DB_USERNAME`: Your MySQL username (defaults to `root`).
- `DB_PASSWORD`: Your MySQL password.

Create a MySQL database named `hike_tracker` before running the application.

### 3. Run the backend

Navigate to `himalaya-hike-tracker-api` and run:

```bash
mvn spring-boot:run
```

### 4. Run the frontend

Open another terminal, navigate to `himalaya-hike-tracker-ui`, and run:

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Author

Dimple Sai Venkatesh Nandeti
