/*
  Service implementation containing the business logic for managing hikes.
  It handles adding, retrieving, updating, deleting hikes, and calculating distances.
 */
package com.himalaya.hiketracker.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import com.himalaya.hiketracker.entity.Hike;
import com.himalaya.hiketracker.repository.HikeRepository;

@Service
public class HikeServiceImpl implements HikeService {

    // Repository used to perform database operations on hikes.
    private final HikeRepository hikeRepository;

    // Constructor injection provides the repository dependency.
    public HikeServiceImpl(HikeRepository hikeRepository) {
        this.hikeRepository = hikeRepository;
    }

    @Override
    public Hike addHike(Hike hike) {

        // Calculate the distance between the start and end coordinates.
        hike.setDistanceKm(calculateDistance(
                hike.getStartLatitude(),
                hike.getStartLongitude(),
                hike.getEndLatitude(),
                hike.getEndLongitude()
        ));

        // Record the date and time when the hike is created.
        hike.setCreatedAt(LocalDateTime.now());

        // Save the hike to the database and return the saved record.
        return hikeRepository.save(hike);
    }

    @Override
    public List<Hike> getAllHikes() {

        // Retrieve all hike records from the database.
        return hikeRepository.findAll();
    }

    @Override
    public Hike getHikeById(Long id) {

        // Find a hike by ID or throw an exception if it does not exist.
        return hikeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hike not found with id: " + id));
    }

    @Override
    public void deleteHike(Long id) {

        // Check whether the hike exists before deleting it.
        if (!hikeRepository.existsById(id)) {
            throw new RuntimeException("Hike not found with id: " + id);
        }

        // Delete the hike record using its ID.
        hikeRepository.deleteById(id);
    }

    @Override
    public double getTotalDistance() {

        // Retrieve all hikes, treat missing distances as zero,
        // and calculate the sum of all hike distances.
        return hikeRepository.findAll()
                .stream()
                .mapToDouble(hike ->
                        hike.getDistanceKm() != null
                                ? hike.getDistanceKm()
                                : 0.0)
                .sum();
    }

    // Calculates the straight-line distance between two coordinates
    // using the Haversine formula and returns the result in kilometers.
    private double calculateDistance(
            double startLatitude,
            double startLongitude,
            double endLatitude,
            double endLongitude) {

        // Approximate mean radius of the Earth in kilometers.
        final double EARTH_RADIUS_KM = 6371.0;

        // Convert coordinate differences from degrees to radians.
        double latDistance = Math.toRadians(endLatitude - startLatitude);
        double lonDistance = Math.toRadians(endLongitude - startLongitude);

        // Apply the Haversine formula to calculate the distance.
        double a = Math.sin(latDistance / 2)
                * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(startLatitude))
                * Math.cos(Math.toRadians(endLatitude))
                * Math.sin(lonDistance / 2)
                * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Round the calculated distance to two decimal places.
        return Math.round(EARTH_RADIUS_KM * c * 100.0) / 100.0;
    }

    @Override
    public Hike updateHike(Long id, Hike hike) {

        // Find the existing hike or throw an exception if it is missing.
        Hike existingHike = hikeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Hike not found with id: " + id));

        // Update the existing hike's location names and coordinates.
        existingHike.setStartLocation(hike.getStartLocation());
        existingHike.setEndLocation(hike.getEndLocation());
        existingHike.setStartLatitude(hike.getStartLatitude());
        existingHike.setStartLongitude(hike.getStartLongitude());
        existingHike.setEndLatitude(hike.getEndLatitude());
        existingHike.setEndLongitude(hike.getEndLongitude());

        // Update the date of the hike.
        existingHike.setHikeDate(hike.getHikeDate());

        // Recalculate the distance using the updated coordinates.
        double distance = calculateDistance(
                hike.getStartLatitude(),
                hike.getStartLongitude(),
                hike.getEndLatitude(),
                hike.getEndLongitude()
        );

        existingHike.setDistanceKm(distance);

        // Save the updated hike and return the saved record.
        return hikeRepository.save(existingHike);
    }
}
