package com.autoprime.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    private Long carId;
    private LocalDateTime pickupTime;
    private LocalDateTime dropTime;
}
