// CarRequest.java
package com.autoprime.dto;

import java.util.List;

public class CarRequest {
    
    private String name;
    private String type;
    private String transmission;
    private Integer seats;
    private Double pricePerDay;
    private Double weekendExtra;
    private String fuel;
    private String location;
    private List<String> images;
    private List<String> features;
    private List<String> safetyFeatures;
    
    // Constructors
    public CarRequest() {}
    
    // Getters and Setters
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
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    
    public List<String> getSafetyFeatures() { return safetyFeatures; }
    public void setSafetyFeatures(List<String> safetyFeatures) { 
        this.safetyFeatures = safetyFeatures; 
    }
}
