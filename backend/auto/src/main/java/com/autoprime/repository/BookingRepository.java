package com.autoprime.repository;

import com.autoprime.model.Booking;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByCar(Car car);
    
    List<Booking> findByStatus(String status);
    
    List<Booking> findByUserAndStatus(User user, String status);
    
    List<Booking> findByCarAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Car car, LocalDate endDate, LocalDate startDate
    );
}