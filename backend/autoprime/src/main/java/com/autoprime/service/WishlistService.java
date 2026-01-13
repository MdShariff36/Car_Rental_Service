package com.autoprime.service;

import com.autoprime.model.Car;
import com.autoprime.model.User;
import com.autoprime.model.Wishlist;
import com.autoprime.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public Wishlist addToWishlist(User user, Car car) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setCar(car);
        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getUserWishlist(User user) {
        return wishlistRepository.findByUser(user);
    }
}
