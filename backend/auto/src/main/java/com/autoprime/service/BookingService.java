package com.autoprime.service;

import com.autoprime.model.Booking;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.repository.BookingRepository;
import com.autoprime.repository.CarRepository;
import com.autoprime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }
    
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }
    
    public List<Booking> getBookingsByCar(Long carId) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        return bookingRepository.findByCar(car);
    }
    
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }
    
    @Transactional
    public Booking createBooking(Booking booking, Long userId, Long carId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        
        // Check if car is available
        if (!"AVAILABLE".equals(car.getStatus())) {
            throw new RuntimeException("Car is not available");
        }
        
        // Check for date conflicts
        List<Booking> conflicts = bookingRepository
                .findByCarAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        car, booking.getEndDate(), booking.getStartDate()
                );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Car is already booked for these dates");
        }
        
        // Calculate days
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        booking.setDays((int) days);
        
        // Calculate price
        double subtotal = calculatePrice(car, booking.getStartDate(), booking.getEndDate());
        booking.setSubtotal(subtotal);
        
        // Apply discount
        double discount = 0.0;
        if (days >= 30) {
            discount = subtotal * 0.10; // 10% for 30+ days
        } else if (days >= 7) {
            discount = subtotal * 0.10; // 10% for 7+ days
        }
        booking.setDiscount(discount);
        
        // Calculate GST
        double afterDiscount = subtotal - discount;
        double gst = afterDiscount * 0.18;
        booking.setGst(gst);
        
        // Calculate total
        double total = afterDiscount + gst;
        booking.setTotal(total);
        
        booking.setUser(user);
        booking.setCar(car);
        booking.setStatus("PENDING");
        
        // Update car status
        car.setStatus("BOOKED");
        carRepository.save(car);
        
        return bookingRepository.save(booking);
    }
    
    private double calculatePrice(Car car, LocalDate startDate, LocalDate endDate) {
        double total = 0.0;
        LocalDate currentDate = startDate;
        
        while (!currentDate.isAfter(endDate)) {
            double dayPrice = car.getPricePerDay();
            
            // Check if weekend
            int dayOfWeek = currentDate.getDayOfWeek().getValue();
            if (dayOfWeek == 6 || dayOfWeek == 7) { // Saturday or Sunday
                dayPrice += (car.getWeekendExtra() != null ? car.getWeekendExtra() : 0);
            }
            
            total += dayPrice;
            currentDate = currentDate.plusDays(1);
        }
        
        return total;
    }
    
    @Transactional
    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        
        // If booking is cancelled or completed, update car status
        if ("CANCELLED".equals(status) || "COMPLETED".equals(status)) {
            Car car = booking.getCar();
            car.setStatus("AVAILABLE");
            carRepository.save(car);
        }
        
        return bookingRepository.save(booking);
    }
    
    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        
        // Update car status if booking was active
        if ("CONFIRMED".equals(booking.getStatus()) || "PENDING".equals(booking.getStatus())) {
            Car car = booking.getCar();
            car.setStatus("AVAILABLE");
            carRepository.save(car);
        }
        
        bookingRepository.delete(booking);
    }
}