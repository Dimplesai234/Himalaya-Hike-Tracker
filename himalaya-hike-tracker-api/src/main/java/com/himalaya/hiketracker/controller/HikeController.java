package com.himalaya.hiketracker.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.himalaya.hiketracker.entity.Hike;
import com.himalaya.hiketracker.service.HikeService;

@RestController
@RequestMapping("/api/hikes")
public class HikeController {
    private final HikeService hikeService;

    public HikeController(HikeService hikeService) {
        this.hikeService = hikeService;
    }

    @PostMapping
    public ResponseEntity<Hike> addHike(@RequestBody Hike hike) {
        Hike savedHike = hikeService.addHike(hike);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedHike);
    }

    @GetMapping
    public ResponseEntity<List<Hike>> getAllHikes() {
        return ResponseEntity.ok(hikeService.getAllHikes());
    }

    @GetMapping("/total-distance")
    public ResponseEntity<Map<String, Double>> getTotalDistance() {
        double totalDistance = hikeService.getTotalDistance();
        return ResponseEntity.ok(Map.of("totalDistanceKm", totalDistance));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hike> getHikeById(@PathVariable Long id) {
        return ResponseEntity.ok(hikeService.getHikeById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHike(@PathVariable Long id) {
        hikeService.deleteHike(id);
        return ResponseEntity.noContent().build();
    }
}
