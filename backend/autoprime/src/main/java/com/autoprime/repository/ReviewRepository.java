package com.autoprime.repository;

import com.autoprime.model.Review;
import com.autoprime.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCar(Car car);
}
