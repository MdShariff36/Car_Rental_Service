// PriceCalculator.java
package com.autoprime.util;

import com.autoprime.model.Car;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

public class PriceCalculator {
    
    private static final double GST_RATE = 0.18; // 18%
    
    public static Map<String, Object> calculateBookingPrice(
            Car car, LocalDate startDate, LocalDate endDate) {
        
        Map<String, Object> result = new HashMap<>();
        
        // Calculate number of days
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        result.put("days", days);
        
        // Calculate subtotal with weekend pricing
        double subtotal = 0.0;
        LocalDate currentDate = startDate;
        
        while (!currentDate.isAfter(endDate)) {
            double dayPrice = car.getPricePerDay();
            
            // Add weekend extra if Saturday or Sunday
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
                dayPrice += (car.getWeekendExtra() != null ? car.getWeekendExtra() : 0);
            }
            
            subtotal += dayPrice;
            currentDate = currentDate.plusDays(1);
        }
        result.put("subtotal", subtotal);
        
        // Calculate discount
        double discount = 0.0;
        if (days >= 30) {
            discount = subtotal * 0.10; // 10% for 30+ days
        } else if (days >= 7) {
            discount = subtotal * 0.10; // 10% for 7+ days
        }
        result.put("discount", discount);
        
        // Calculate after discount
        double afterDiscount = subtotal - discount;
        result.put("afterDiscount", afterDiscount);
        
        // Calculate GST
        double gst = afterDiscount * GST_RATE;
        result.put("gst", gst);
        
        // Calculate total
        double total = afterDiscount + gst;
        result.put("total", total);
        
        return result;
    }
    
    public static double calculateDailyRate(Car car, LocalDate date) {
        double baseRate = car.getPricePerDay();
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            baseRate += (car.getWeekendExtra() != null ? car.getWeekendExtra() : 0);
        }
        
        return baseRate;
    }
}

