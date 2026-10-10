
/* Entity class representing a hike in the application. 
   Each Hike object is mapped to a record in the "hikes" table in the database. 
   It stores the hike locations, coordinates, date, calculated distance, and creation timestamp. */
package com.himalaya.hiketracker.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hikes")
public class Hike {

    /* We define unique identifier for each hike.
      @Id marks this field as the primary key.
      GenerationType.IDENTITY lets the database generate the ID automatically.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name of the hike's starting location.
    private String startLocation;

    // Name of the hike's ending location.
    private String endLocation;

    // Latitude coordinate of the starting location.
    private Double startLatitude;

    // Longitude coordinate of the starting location.
    private Double startLongitude;

    // Latitude coordinate of the ending location.
    private Double endLatitude;

    // Longitude coordinate of the ending location.
    private Double endLongitude;

    // Date on which the hike took place.
    private LocalDate hikeDate;

    // Calculated distance between the start and end coordinates, stored in kilometers.
    private Double distanceKm;

    // Date and time when the hike record was created.
    private LocalDateTime createdAt;

    /*
      Default constructor required by JPA.
      It allows the persistence framework to create Hike objects.
     */
    public Hike() {
    }

    /*
      Getter and Setter methods of each component/variable
      Getter methods retrieve field values.
      Setter methods update field values.
     */
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getStartLocation() {
        return startLocation;
    }
    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }
    public String getEndLocation() {
        return endLocation;
    }
    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }
    public Double getStartLatitude() {
        return startLatitude;
    }
    public void setStartLatitude(Double startLatitude) {
        this.startLatitude = startLatitude;
    }
    public Double getStartLongitude() {
        return startLongitude;
    }
    public void setStartLongitude(Double startLongitude) {
        this.startLongitude = startLongitude;
    }
    public Double getEndLatitude() {
        return endLatitude;
    }
    public void setEndLatitude(Double endLatitude) {
        this.endLatitude = endLatitude;
    }
    public Double getEndLongitude() {
        return endLongitude;
    }
    public void setEndLongitude(Double endLongitude) {
        this.endLongitude = endLongitude;
    }
    public LocalDate getHikeDate() {
        return hikeDate;
    }
    public void setHikeDate(LocalDate hikeDate) {
        this.hikeDate = hikeDate;
    }
    public Double getDistanceKm() {
        return distanceKm;
    }
    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
