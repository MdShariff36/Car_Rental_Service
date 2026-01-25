// HostController.java
package com.autoprime.controller;

import com.autoprime.service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*")
public class HostController {
    
    @Autowired
    private HostService hostService;
    
    @GetMapping("/dashboard/{hostId}")
    public ResponseEntity<?> getHostDashboard(@PathVariable Long hostId) {
        try {
            Map<String, Object> dashboard = hostService.getHostDashboard(hostId);
            return ResponseEntity.ok(dashboard);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/{hostId}/cars")
    public ResponseEntity<?> getHostCars(@PathVariable Long hostId) {
        try {
            return ResponseEntity.ok(hostService.getHostCars(hostId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/{hostId}/bookings")
    public ResponseEntity<?> getHostBookings(@PathVariable Long hostId) {
        try {
            return ResponseEntity.ok(hostService.getHostBookings(hostId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

