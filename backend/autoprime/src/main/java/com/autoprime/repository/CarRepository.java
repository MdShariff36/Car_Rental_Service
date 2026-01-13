package com.autoprime.repository;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByCity(String city);
    List<Car> findByHost(User host);
}
