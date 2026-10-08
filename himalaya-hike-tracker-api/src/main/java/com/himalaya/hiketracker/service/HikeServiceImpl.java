package com.himalaya.hiketracker.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import com.himalaya.hiketracker.entity.Hike;
import com.himalaya.hiketracker.repository.HikeRepository;

@Service
public class HikeServiceImpl implements HikeService {
	private final HikeRepository hikeRepository;

    public HikeServiceImpl(HikeRepository hikeRepository) {
        this.hikeRepository = hikeRepository;
    }

    @Override
    public Hike addHike(Hike hike) {
        hike.setDistanceKm(calculateDistance(hike.getStartLatitude(),hike.getStartLongitude(),hike.getEndLatitude(),
                        hike.getEndLongitude()));

        hike.setCreatedAt(LocalDateTime.now());
        return hikeRepository.save(hike);
    }

    @Override
    public List<Hike> getAllHikes() {
    	return hikeRepository.findAll();
    }

    @Override
    public Hike getHikeById(Long id) {
    	return hikeRepository.findById(id).orElseThrow(() -> new RuntimeException( "Hike not found with id: " + id));
    }

    @Override
    public void deleteHike(Long id) {
    	if (!hikeRepository.existsById(id)) {
            throw new RuntimeException("Hike not found with id: " + id);
        }
        hikeRepository.deleteById(id);
    }

    @Override
    public double getTotalDistance() {
        return hikeRepository.findAll()
                .stream()
                .mapToDouble(hike -> hike.getDistanceKm() != null ? hike.getDistanceKm(): 0.0)
                .sum();
    }

    private double calculateDistance(double startLatitude, double startLongitude, double endLatitude, double endLongitude) {
        final double EARTH_RADIUS_KM = 6371.0;
        double latDistance = Math.toRadians(endLatitude - startLatitude);
        double lonDistance = Math.toRadians(endLongitude - startLongitude);
        double a = Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(startLatitude))
                        * Math.cos(Math.toRadians(endLatitude))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1 - a));
        return Math.round(EARTH_RADIUS_KM * c * 100.0) / 100.0;
    }
}
