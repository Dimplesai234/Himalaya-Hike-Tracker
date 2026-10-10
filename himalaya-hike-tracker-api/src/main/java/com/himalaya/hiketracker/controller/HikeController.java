/*
  REST controller for managing hikes through HTTP requests.
  It receives client requests and delegates business operations to HikeService.
 */
package com.himalaya.hiketracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.himalaya.hiketracker.entity.Hike;
import com.himalaya.hiketracker.service.HikeService;

@RestController
@RequestMapping("/api/hikes")
@CrossOrigin(origins = "http://localhost:5173")
public class HikeController {

    // Service used to perform hike-related business operations.
    private final HikeService hikeService;

    // Constructor injection provides the service dependency.
    public HikeController(HikeService hikeService) {
        this.hikeService = hikeService;
    }

    // Creates a new hike and returns the saved hike with HTTP 201 Created.
    @PostMapping
    public ResponseEntity<Hike> addHike(@RequestBody Hike hike) {
        Hike savedHike = hikeService.addHike(hike);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHike);
    }

    // Retrieves all hikes and returns them with HTTP 200 OK.
    @GetMapping
    public ResponseEntity<List<Hike>> getAllHikes() {
        return ResponseEntity.ok(hikeService.getAllHikes());
    }

    // Calculates the total distance and returns it as a JSON response.
    @GetMapping("/total-distance")
    public ResponseEntity<Map<String, Double>> getTotalDistance() {
        double totalDistance = hikeService.getTotalDistance();
        return ResponseEntity.ok(Map.of("totalDistanceKm", totalDistance));
    }

    // Retrieves a specific hike using its ID from the URL.
    @GetMapping("/{id}")
    public ResponseEntity<Hike> getHikeById(@PathVariable Long id) {
        return ResponseEntity.ok(hikeService.getHikeById(id));
    }

    // Deletes a hike by ID and returns HTTP 204 No Content on success.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHike(@PathVariable Long id) {
        hikeService.deleteHike(id);
        return ResponseEntity.noContent().build();
    }

    // Updates an existing hike using its ID and the request body.
    @PutMapping("/{id}")
    public ResponseEntity<Hike> updateHike(@PathVariable Long id, @RequestBody Hike hike) {
        Hike updatedHike = hikeService.updateHike(id, hike);
        return ResponseEntity.ok(updatedHike);
    }
}
