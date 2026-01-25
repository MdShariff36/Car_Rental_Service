// ReviewRepository.java
package com.autoprime.repository;

import com.autoprime.model.Review;
import com.autoprime.model.Car;
import com.autoprime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCar(Car car);
    List<Review> findByUser(User user);
    List<Review> findByCarOrderByCreatedAtDesc(Car car);
}