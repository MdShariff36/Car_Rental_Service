package com.autoprime.rental.repository;

import com.autoprime.rental.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Car Repository - Database operations for Car entity
 */
@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    List<Car> findByHostId(Long hostId);
    
    Page<Car> findByAvailability(Boolean availability, Pageable pageable);
    
    Page<Car> findByCarType(Car.CarType carType, Pageable pageable);
    
    Page<Car> findByTransmission(Car.Transmission transmission, Pageable pageable);
    
    Page<Car> findByFuelType(Car.FuelType fuelType, Pageable pageable);
    
    @Query("SELECT c FROM Car c WHERE c.availability = true ORDER BY c.rating DESC, c.totalTrips DESC")
    List<Car> findPopularCars(Pageable pageable);
    
    @Query("SELECT c FROM Car c WHERE " +
           "LOWER(c.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Car> searchCars(@Param("keyword") String keyword, Pageable pageable);
    
    Boolean existsByRegistrationNumber(String registrationNumber);
}