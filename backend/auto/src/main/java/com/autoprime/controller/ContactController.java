// ContactController.java
package com.autoprime.controller;

import com.autoprime.model.ContactMessage;
import com.autoprime.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage message) {
        try {
            ContactMessage saved = contactService.saveMessage(message);
            return ResponseEntity.ok(Map.of(
                "message", "Message sent successfully!",
                "id", saved.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to send message"));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllMessages() {
        return ResponseEntity.ok(contactService.getAllMessages());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getMessagesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(contactService.getMessagesByStatus(status));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            ContactMessage updated = contactService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
