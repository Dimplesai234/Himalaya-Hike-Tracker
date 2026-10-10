/*
  Service interface defining the business operations for managing hikes.
  The implementation of these methods is provided by HikeServiceImpl.
 */
package com.himalaya.hiketracker.service;

import java.util.List;
import com.himalaya.hiketracker.entity.Hike;

public interface HikeService {

    // Adds a new hike to the database.
    Hike addHike(Hike hike);

    // Retrieves all hikes from the database.
    List<Hike> getAllHikes();

    // Retrieves a specific hike using its ID.
    Hike getHikeById(Long id);

    // Deletes a hike using its ID.
    void deleteHike(Long id);

    // Calculates and returns the total distance of all hikes in kilometers.
    double getTotalDistance();

    // Updates an existing hike using its ID and the new hike details.
    Hike updateHike(Long id, Hike hike);
}
