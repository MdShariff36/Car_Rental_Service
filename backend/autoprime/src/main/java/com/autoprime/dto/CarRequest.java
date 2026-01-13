package com.autoprime.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CarRequest {
    private String brand;
    private String name;
    private String type;
    private String transmission;
    private String fuel;
    private String city;
    private BigDecimal pricePerDay;
}
