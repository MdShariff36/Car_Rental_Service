package com.autoprime.controller;

import com.autoprime.model.Car;
import com.autoprime.service.HostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/host")
@RequiredArgsConstructor
public class HostController {

    private final HostService hostService;

    @GetMapping("/cars")
    public List<Car> getHostCars(@RequestParam Long hostId) {
        return hostService.getHostCars(hostId);
    }
}
