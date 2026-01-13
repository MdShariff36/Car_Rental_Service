package com.autoprime.controller;

import com.autoprime.model.ContactMessage;
import com.autoprime.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/send")
    public ContactMessage send(@RequestParam String email,
                               @RequestParam String subject,
                               @RequestParam String message) {
        return contactService.sendMessage(email, subject, message);
    }
}
