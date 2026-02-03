package com.autoprime.rental.service;

import com.autoprime.rental.entity.Booking;
import com.autoprime.rental.entity.Car;
import com.autoprime.rental.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Booking Service - Business logic for booking operations
 */
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarService carService;

    /**
     * Get all bookings for a user
     */
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    /**
     * Get booking by ID
     */
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    /**
     * Get bookings for a host
     */
    public List<Booking> getHostBookings(Long hostId) {
        return bookingRepository.findByHostId(hostId);
    }

    /**
     * Create new booking
     */
    @Transactional
    public Booking createBooking(Booking booking) {
        // Validate car availability
        Car car = carService.getCarById(booking.getCarId());
        if (!car.getAvailability()) {
            throw new RuntimeException("Car is not available");
        }

        // Check for conflicting bookings
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            booking.getCarId(), booking.getPickupDate(), booking.getDropDate()
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Car is already booked for selected dates");
        }

        // Calculate total days
        long days = ChronoUnit.DAYS.between(booking.getPickupDate(), booking.getDropDate());
        booking.setTotalDays((int) Math.max(1, days));

        // Calculate pricing
        BigDecimal basePrice = car.getPricePerDay().multiply(BigDecimal.valueOf(booking.getTotalDays()));
        booking.setBasePrice(basePrice);

        // Calculate GST (18%)
        BigDecimal gst = basePrice.multiply(BigDecimal.valueOf(0.18));
        booking.setGst(gst);

        // Calculate total amount
        BigDecimal totalAmount = basePrice.add(gst).subtract(booking.getDiscount());
        booking.setTotalAmount(totalAmount);

        // Set initial status
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setPaymentStatus(Booking.PaymentStatus.PENDING);

        return bookingRepository.save(booking);
    }

    /**
     * Update booking
     */
    @Transactional
    public Booking updateBooking(Long bookingId, Booking updatedBooking) {
        Booking booking = getBookingById(bookingId);
        
        // Update allowed fields
        booking.setPickupLocation(updatedBooking.getPickupLocation());
        booking.setDropLocation(updatedBooking.getDropLocation());
        booking.setDriverName(updatedBooking.getDriverName());
        booking.setDriverPhone(updatedBooking.getDriverPhone());
        booking.setDriverLicense(updatedBooking.getDriverLicense());
        booking.setEmergencyContact(updatedBooking.getEmergencyContact());
        booking.setEmergencyPhone(updatedBooking.getEmergencyPhone());
        booking.setNotes(updatedBooking.getNotes());
        
        return bookingRepository.save(booking);
    }

    /**
     * Cancel booking
     */
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed booking");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    /**
     * Confirm booking
     */
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }

    /**
     * Mark booking as ongoing
     */
    @Transactional
    public void startBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(Booking.BookingStatus.ONGOING);
        bookingRepository.save(booking);
    }

    /**
     * Complete booking
     */
    @Transactional
    public void completeBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        
        // Increment car trip count
        carService.incrementTripCount(booking.getCarId());
    }

    /**
     * Update payment status
     */
    @Transactional
    public void updatePaymentStatus(Long bookingId, Booking.PaymentStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setPaymentStatus(status);
        bookingRepository.save(booking);
    }

    /**
     * Get all bookings
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Count bookings by user
     */
    public Long countUserBookings(Long userId) {
        return bookingRepository.countByUserId(userId);
    }

    /**
     * Count bookings by host
     */
    public Long countHostBookings(Long hostId) {
        return bookingRepository.countByHostId(hostId);
    }
}