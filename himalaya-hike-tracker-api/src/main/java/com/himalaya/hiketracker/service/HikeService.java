package com.himalaya.hiketracker.service;

import java.util.List;
import com.himalaya.hiketracker.entity.Hike;

public interface HikeService {
    Hike addHike(Hike hike);
    List<Hike> getAllHikes();
    Hike getHikeById(Long id);
    void deleteHike(Long id);
    double getTotalDistance();
	Hike updateHike(Long id, Hike hike);
}
