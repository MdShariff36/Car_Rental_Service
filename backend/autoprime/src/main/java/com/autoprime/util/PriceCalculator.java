package com.autoprime.util;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

public class PriceCalculator {

    public static BigDecimal calculatePrice(BigDecimal pricePerDay, LocalDateTime start, LocalDateTime end) {
        long days = Duration.between(start, end).toDays();
        if (days == 0) days = 1; // minimum 1 day
        return pricePerDay.multiply(BigDecimal.valueOf(days));
    }
}
