

// AdminController.java
package com.autoprime.controller;

import com.autoprime.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            Map<String, Object> dashboard = adminService.getAdminDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/reports/{reportType}")
    public ResponseEntity<?> getReports(@PathVariable String reportType) {
        try {
            Map<String, Object> report = adminService.getReports(reportType);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}