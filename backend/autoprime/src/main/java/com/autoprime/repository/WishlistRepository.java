package com.autoprime.repository;

import com.autoprime.model.Wishlist;
import com.autoprime.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
}
