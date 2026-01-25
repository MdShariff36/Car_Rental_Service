package com.autoprime.repository;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    List<Car> findByStatus(String status);
    
    List<Car> findByType(String type);
    
    List<Car> findByOwner(User owner);
    
    List<Car> findByNameContainingIgnoreCase(String name);
    
    List<Car> findByPricePerDayBetween(Double minPrice, Double maxPrice);
    
    List<Car> findByLocation(String location);
}