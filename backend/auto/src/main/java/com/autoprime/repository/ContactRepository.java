// ContactRepository.java
package com.autoprime.repository;

import com.autoprime.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByStatus(String status);
    List<ContactMessage> findByEmailContainingIgnoreCase(String email);
}
