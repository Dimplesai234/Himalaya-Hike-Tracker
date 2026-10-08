package com.himalaya.hiketracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.himalaya.hiketracker.entity.Hike;

public interface HikeRepository extends JpaRepository<Hike, Long> {

}
