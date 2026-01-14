package com.autoprime.service;

import com.autoprime.model.ContactMessage;
import com.autoprime.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    // Fixed: Renamed to match ContactController call "sendMessage"
    public ContactMessage sendMessage(String email, String subject, String message) {
        ContactMessage contact = new ContactMessage();
        contact.setEmail(email);
        contact.setSubject(subject);
        contact.setMessage(message);
        return contactRepository.save(contact);
    }
}