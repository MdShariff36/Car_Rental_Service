-- data.sql - Sample data for Auto Prime Car Rental
-- This file will be executed automatically by Spring Boot

-- Insert sample users (passwords are BCrypt hashed "password123")
INSERT INTO users (name, email, password, phone, license_number, address, role, created_at) 
VALUES 
('Admin User', 'admin@autoprime.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FZY8fPjr5IwqZ9FZ0CZz5c7F5n7V2e', '9876543210', 'DL1234567890', 'Chennai, Tamil Nadu', 'ADMIN', NOW()),
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FZY8fPjr5IwqZ9FZ0CZz5c7F5n7V2e', '9876543211', 'DL2345678901', 'Mumbai, Maharashtra', 'USER', NOW()),
('Host One', 'host@autoprime.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye6FZY8fPjr5IwqZ9FZ0CZz5c7F5n7V2e', '9876543212', 'DL3456789012', 'Bangalore, Karnataka', 'HOST', NOW());

-- Insert sample cars
INSERT INTO cars (name, type, transmission, seats, price_per_day, weekend_extra, fuel, mileage, engine, boot, airbags, drive, status, location, rating, total_trips, km_limit, extra_km_charge, owner_id, created_at) 
VALUES 
('Hyundai Creta', 'SUV', 'Automatic', 5, 3500.00, 500.00, 'Petrol', '17 km/l', '1.5L', '433 L', 6, 'FWD', 'AVAILABLE', 'Chennai', 4.6, 120, 200, 10.00, 3, NOW()),
('Toyota Innova', 'MPV', 'Manual', 7, 4200.00, 600.00, 'Diesel', '15 km/l', '2.4L', '300 L', 3, 'RWD', 'AVAILABLE', 'Chennai', 4.7, 150, 250, 15.00, 3, NOW()),
('Maruti Swift', 'Hatchback', 'Manual', 5, 1500.00, 300.00, 'Petrol', '22 km/l', '1.2L', '268 L', 2, 'FWD', 'AVAILABLE', 'Chennai', 4.5, 200, 150, 8.00, 3, NOW()),
('Hyundai i20', 'Hatchback', 'Automatic', 5, 1800.00, 350.00, 'Petrol', '20 km/l', '1.2L', '311 L', 2, 'FWD', 'AVAILABLE', 'Bangalore', 4.4, 180, 150, 8.00, 3, NOW()),
('Mahindra XUV700', 'SUV', 'Automatic', 7, 4000.00, 700.00, 'Diesel', '16 km/l', '2.0L', '600 L', 6, 'AWD', 'AVAILABLE', 'Mumbai', 4.8, 90, 250, 12.00, 3, NOW()),
('Tata Nexon', 'SUV', 'Manual', 5, 2500.00, 400.00, 'Petrol', '18 km/l', '1.2L', '350 L', 2, 'FWD', 'AVAILABLE', 'Delhi', 4.3, 160, 180, 10.00, 3, NOW());

-- Insert car images
INSERT INTO car_images (car_id, image_url) VALUES 
(1, 'assets/images/car-images/Hyundai Creta/Hyundai Creta.jfif'),
(1, 'assets/images/car-images/Hyundai Creta/Hyundai Creta.jpg'),
(2, 'assets/images/car-images/Toyota innova/Toyota innova.jfif'),
(2, 'assets/images/car-images/Toyota innova/front.jpg'),
(3, 'assets/images/car-images/Maruti Swift/Maruti Swift.jfif'),
(4, 'assets/images/car-images/Hyundai i20/Hyundai i20.jfif'),
(5, 'assets/images/car-images/Mahindra XUV700/Mahindra XUV700.jfif'),
(6, 'assets/images/car-images/Tata Nexon/Tata Nexon.jfif');

-- Insert car features
INSERT INTO car_features (car_id, feature) VALUES 
(1, 'Air Conditioning'),
(1, 'Bluetooth'),
(1, 'Reverse Camera'),
(1, 'Android Auto'),
(1, 'Fastag'),
(1, 'USB Charging'),
(2, 'Air Conditioning'),
(2, 'Rear AC Vents'),
(2, 'Bluetooth'),
(2, 'Fastag'),
(2, 'USB Charging'),
(3, 'Air Conditioning'),
(3, 'Bluetooth'),
(3, 'USB Charging'),
(4, 'Air Conditioning'),
(4, 'Bluetooth'),
(4, 'Reverse Camera'),
(5, 'Air Conditioning'),
(5, 'Sunroof'),
(5, 'Bluetooth'),
(5, 'Android Auto'),
(6, 'Air Conditioning'),
(6, 'Bluetooth'),
(6, 'USB Charging');

-- Insert car safety features
INSERT INTO car_safety (car_id, safety_feature) VALUES 
(1, 'ABS'),
(1, 'Airbags'),
(1, 'Child Safety Locks'),
(1, 'Seat Belts'),
(2, 'ABS'),
(2, 'Airbags'),
(2, 'Parking Sensors'),
(3, 'ABS'),
(3, 'Airbags'),
(4, 'ABS'),
(4, 'Airbags'),
(5, 'ABS'),
(5, 'Airbags'),
(5, 'ESP'),
(5, 'Hill Assist'),
(6, 'ABS'),
(6, 'Airbags');

-- Insert sample bookings
INSERT INTO bookings (user_id, car_id, start_date, end_date, days, subtotal, discount, gst, total, status, pickup_location, drop_location, created_at) 
VALUES 
(2, 1, '2026-02-01', '2026-02-05', 5, 17500.00, 0.00, 3150.00, 20650.00, 'CONFIRMED', 'Chennai Airport', 'Chennai Airport', NOW()),
(2, 3, '2026-02-10', '2026-02-12', 3, 4500.00, 0.00, 810.00, 5310.00, 'COMPLETED', 'Chennai City', 'Chennai City', NOW());

-- Insert sample payments
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, created_at) 
VALUES 
(1, 20650.00, 'UPI', 'SUCCESS', 'TXN12345ABC67890', NOW()),
(2, 5310.00, 'CARD', 'SUCCESS', 'TXN98765XYZ43210', NOW());

-- Insert sample reviews
INSERT INTO reviews (user_id, car_id, rating, comment, created_at) 
VALUES 
(2, 1, 5, 'Excellent car! Very comfortable and well-maintained.', NOW()),
(2, 3, 4, 'Good car for city driving. Fuel efficient.', NOW());

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, subject, message, status, created_at) 
VALUES 
('Jane Smith', 'jane@example.com', 'general', 'I would like to know about long-term rental discounts.', 'NEW', NOW()),
('Robert Brown', 'robert@example.com', 'booking', 'Can I extend my current booking?', 'NEW', NOW());