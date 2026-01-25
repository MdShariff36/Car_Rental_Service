// WishlistRepository.java
package com.autoprime.repository;

import com.autoprime.model.Wishlist;
import com.autoprime.model.User;
import com.autoprime.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndCar(User user, Car car);
    boolean existsByUserAndCar(User user, Car car);
}
