package com.autoprime.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
public class Car {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type; // SUV, Sedan, Hatchback, MPV
    
    @Column(nullable = false)
    private String transmission; // Manual, Automatic
    
    @Column(nullable = false)
    private Integer seats;
    
    @Column(nullable = false)
    private Double pricePerDay;
    
    private Double weekendExtra;
    
    private String fuel; // Petrol, Diesel, Electric
    
    private String mileage;
    
    private String engine;
    
    private String boot;
    
    private Integer airbags;
    
    private String drive; // FWD, RWD, AWD
    
    @ElementCollection
    @CollectionTable(name = "car_images", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "car_safety", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "safety_feature")
    private List<String> safetyFeatures = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @Column(nullable = false)
    private String status; // AVAILABLE, BOOKED, MAINTENANCE
    
    private String location;
    
    private Double rating;
    
    private Integer totalTrips;
    
    @Column(name = "km_limit")
    private Integer kmLimit;
    
    @Column(name = "extra_km_charge")
    private Double extraKmCharge;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructors
    public Car() {
        this.createdAt = LocalDateTime.now();
        this.status = "AVAILABLE";
        this.rating = 0.0;
        this.totalTrips = 0;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { 
        this.transmission = transmission; 
    }
    
    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }
    
    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { 
        this.pricePerDay = pricePerDay; 
    }
    
    public Double getWeekendExtra() { return weekendExtra; }
    public void setWeekendExtra(Double weekendExtra) { 
        this.weekendExtra = weekendExtra; 
    }
    
    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }
    
    public String getMileage() { return mileage; }
    public void setMileage(String mileage) { this.mileage = mileage; }
    
    public String getEngine() { return engine; }
    public void setEngine(String engine) { this.engine = engine; }
    
    public String getBoot() { return boot; }
    public void setBoot(String boot) { this.boot = boot; }
    
    public Integer getAirbags() { return airbags; }
    public void setAirbags(Integer airbags) { this.airbags = airbags; }
    
    public String getDrive() { return drive; }
    public void setDrive(String drive) { this.drive = drive; }
    
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { 
        this.features = features; 
    }
    
    public List<String> getSafetyFeatures() { return safetyFeatures; }
    public void setSafetyFeatures(List<String> safetyFeatures) { 
        this.safetyFeatures = safetyFeatures; 
    }
    
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getTotalTrips() { return totalTrips; }
    public void setTotalTrips(Integer totalTrips) { 
        this.totalTrips = totalTrips; 
    }
    
    public Integer getKmLimit() { return kmLimit; }
    public void setKmLimit(Integer kmLimit) { this.kmLimit = kmLimit; }
    
    public Double getExtraKmCharge() { return extraKmCharge; }
    public void setExtraKmCharge(Double extraKmCharge) { 
        this.extraKmCharge = extraKmCharge; 
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { 
        this.updatedAt = updatedAt; 
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}