package com.autoprime.controller;

import com.autoprime.dto.CarRequest;
import com.autoprime.model.Car;
import com.autoprime.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping("/all")
    public List<Car> getAllCars() {
        return carService.getCarsByCity(null);
    }

    @GetMapping("/{id}")
    public Car getCar(@PathVariable Long id) {
        return carService.getCarsByCity(null)
                .stream()
                .filter(c -> c.getId().equals(id))
                .findFirst().orElseThrow();
    }

    @PostMapping("/add")
    public ResponseEntity<Car> addCar(@RequestParam("file") MultipartFile file,
                                      @RequestParam("hostId") Long hostId,
                                      @RequestParam String brand,
                                      @RequestParam String name,
                                      @RequestParam String type,
                                      @RequestParam String transmission,
                                      @RequestParam String fuel,
                                      @RequestParam String city,
                                      @RequestParam String pricePerDay) throws IOException {

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        file.transferTo(new File("uploads/cars/" + filename));

        CarRequest request = new CarRequest();
        request.setBrand(brand);
        request.setName(name);
        request.setType(type);
        request.setTransmission(transmission);
        request.setFuel(fuel);
        request.setCity(city);
        request.setPricePerDay(new java.math.BigDecimal(pricePerDay));

        return ResponseEntity.ok(carService.addCar(request, hostId, filename));
    }
}
