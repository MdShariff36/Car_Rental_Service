package com.autoprime.service;

import com.autoprime.model.ContactMessage;
import com.autoprime.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    /**
     * Save a new contact message
     */
    public ContactMessage saveMessage(ContactMessage message) {
        if (message == null) {
            throw new RuntimeException("Contact message cannot be null");
        }
        
        // Validate required fields
        if (message.getName() == null || message.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        if (message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }
        
        // Set default status if not set
        if (message.getStatus() == null || message.getStatus().trim().isEmpty()) {
            message.setStatus("NEW");
        }
        
        return contactRepository.save(message);
    }
    
    /**
     * Get all contact messages
     */
    public List<ContactMessage> getAllMessages() {
        return contactRepository.findAll();
    }
    
    /**
     * Get contact message by ID
     */
    public ContactMessage getMessageById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
    }
    
    /**
     * Get messages by status (NEW, READ, REPLIED)
     */
    public List<ContactMessage> getMessagesByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Status cannot be empty");
        }
        return contactRepository.findByStatus(status.toUpperCase());
    }
    
    /**
     * Update message status
     */
    public ContactMessage updateStatus(Long id, String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Status cannot be empty");
        }
        
        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
        
        message.setStatus(status.toUpperCase());
        return contactRepository.save(message);
    }
    
    /**
     * Delete a contact message
     */
    public void deleteMessage(Long id) {
        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found with id: " + id));
        contactRepository.delete(message);
    }
    
    /**
     * Search messages by email
     */
    public List<ContactMessage> searchByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        return contactRepository.findByEmailContainingIgnoreCase(email);
    }
}