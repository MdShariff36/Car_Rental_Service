// BookingRequest.java
package com.autoprime.dto;

import java.time.LocalDate;

public class BookingRequest {
    
    private Long userId;
    private Long carId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pickupLocation;
    private String dropLocation;
    
    // Constructors
    public BookingRequest() {}
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { 
        this.pickupLocation = pickupLocation; 
    }
    
    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { 
        this.dropLocation = dropLocation; 
    }
}

