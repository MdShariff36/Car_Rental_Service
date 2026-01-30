USE car_rental_db;

-- Insert sample cars
INSERT INTO cars (name, type, transmission, seats, price_per_day, weekend_extra, fuel, mileage, engine, boot, airbags, drive, status, location, rating, total_trips, km_limit, extra_km_charge, owner_id, created_at)
VALUES
('Hyundai Creta', 'SUV', 'Automatic', 5, 3500.00, 500.00, 'Petrol', '17 km/l', '1.5L', '433 L', 6, 'FWD', 'AVAILABLE', 'Chennai', 4.6, 120, 200, 10.00, NULL, NOW()),
('Toyota Innova', 'MPV', 'Manual', 7, 4200.00, 600.00, 'Diesel', '15 km/l', '2.4L', '300 L', 3, 'RWD', 'AVAILABLE', 'Chennai', 4.7, 150, 250, 15.00, NULL, NOW()),
('Maruti Swift', 'Hatchback', 'Manual', 5, 1500.00, 300.00, 'Petrol', '22 km/l', '1.2L', '268 L', 2, 'FWD', 'AVAILABLE', 'Chennai', 4.5, 200, 150, 8.00, NULL, NOW()),
('Hyundai i20', 'Hatchback', 'Automatic', 5, 1800.00, 350.00, 'Petrol', '20 km/l', '1.2L', '311 L', 2, 'FWD', 'AVAILABLE', 'Bangalore', 4.4, 180, 150, 8.00, NULL, NOW()),
('Mahindra XUV700', 'SUV', 'Automatic', 7, 4000.00, 700.00, 'Diesel', '16 km/l', '2.0L', '600 L', 6, 'AWD', 'AVAILABLE', 'Mumbai', 4.8, 90, 250, 12.00, NULL, NOW()),
('Tata Nexon', 'SUV', 'Manual', 5, 2500.00, 400.00, 'Petrol', '18 km/l', '1.2L', '350 L', 2, 'FWD', 'AVAILABLE', 'Delhi', 4.3, 160, 180, 10.00, NULL, NOW());

-- Insert car images
INSERT INTO car_images (car_id, image_url) VALUES
(1, 'assets/images/car-images/Hyundai Creta/Hyundai Creta.jfif'),
(2, 'assets/images/car-images/Toyota innova/Toyota innova.jfif'),
(3, 'assets/images/car-images/Maruti Swift/Maruti Swift.jfif'),
(4, 'assets/images/car-images/Hyundai i20/Hyundai i20.jfif'),
(5, 'assets/images/car-images/Mahindra XUV700/Mahindra XUV700.jfif'),
(6, 'assets/images/car-images/Tata Nexon/Tata Nexon.jfif');

-- Insert car features
INSERT INTO car_features (car_id, feature) VALUES
(1, 'Air Conditioning'), (1, 'Bluetooth'), (1, 'Reverse Camera'),
(2, 'Air Conditioning'), (2, 'Rear AC Vents'), (2, 'Bluetooth'),
(3, 'Air Conditioning'), (3, 'Bluetooth'),
(4, 'Air Conditioning'), (4, 'Bluetooth'), (4, 'Reverse Camera'),
(5, 'Air Conditioning'), (5, 'Sunroof'), (5, 'Bluetooth'),
(6, 'Air Conditioning'), (6, 'Bluetooth');

-- Insert car safety features
INSERT INTO car_safety (car_id, safety_feature) VALUES
(1, 'ABS'), (1, 'Airbags'), (1, 'Child Safety Locks'),
(2, 'ABS'), (2, 'Airbags'), (2, 'Parking Sensors'),
(3, 'ABS'), (3, 'Airbags'),
(4, 'ABS'), (4, 'Airbags'),
(5, 'ABS'), (5, 'Airbags'), (5, 'ESP'),
(6, 'ABS'), (6, 'Airbags');