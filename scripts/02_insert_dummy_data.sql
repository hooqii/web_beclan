-- Insert dummy data for Waste Management System
USE waste_management;

-- Insert admin and operator users
INSERT INTO users (name, email, phone, address, role, password_hash) VALUES
('Admin System', 'admin@wastemanagement.com', '081234567890', 'Kantor Pusat Waste Management', 'admin', '$2b$10$dummy_hash_admin'),
('Operator 1', 'operator@wastemanagement.com', '081234567891', 'Kantor Cabang Jakarta', 'operator', '$2b$10$dummy_hash_operator');

-- Insert customer users
INSERT INTO users (name, email, phone, address, role, password_hash) VALUES
('Budi Santoso', 'budi@email.com', '081234567892', 'Jl. Merdeka No. 123, Jakarta Pusat', 'customer', '$2b$10$dummy_hash_customer1'),
('Siti Nurhaliza', 'siti@email.com', '081234567893', 'Jl. Sudirman No. 456, Jakarta Selatan', 'customer', '$2b$10$dummy_hash_customer2'),
('Ahmad Wijaya', 'ahmad@email.com', '081234567894', 'Jl. Thamrin No. 789, Jakarta Barat', 'customer', '$2b$10$dummy_hash_customer3'),
('Dewi Sartika', 'dewi@email.com', '081234567895', 'Jl. Gatot Subroto No. 321, Jakarta Timur', 'customer', '$2b$10$dummy_hash_customer4'),
('Rudi Hermawan', 'rudi@email.com', '081234567896', 'Jl. Kuningan No. 654, Jakarta Selatan', 'customer', '$2b$10$dummy_hash_customer5');

-- Insert drivers
INSERT INTO drivers (name, phone, license_number, vehicle_number, status) VALUES
('Joko Susilo', '081234567897', 'B1234567890', 'B 1234 ABC', 'active'),
('Andi Pratama', '081234567898', 'B1234567891', 'B 5678 DEF', 'active'),
('Rudi Hermawan', '081234567899', 'B1234567892', 'B 9012 GHI', 'active'),
('Bambang Sutrisno', '081234567800', 'B1234567893', 'B 3456 JKL', 'inactive');

-- Insert waste products
INSERT INTO products (name, price, icon, unit, description) VALUES
('Sampah Organik', 2000.00, '🥬', 'kg', 'Sampah organik seperti sisa makanan, daun, dan bahan organik lainnya'),
('Sampah Plastik', 3000.00, '♻️', 'kg', 'Sampah plastik yang dapat didaur ulang seperti botol, kantong plastik'),
('Sampah Kertas', 1500.00, '📄', 'kg', 'Sampah kertas dan kardus yang dapat didaur ulang'),
('Sampah Logam', 5000.00, '🔩', 'kg', 'Sampah logam seperti kaleng, besi, aluminium'),
('Sampah Kaca', 2500.00, '🍶', 'kg', 'Sampah kaca seperti botol, pecahan kaca yang dapat didaur ulang');

-- Insert schedules
INSERT INTO schedules (driver_id, customer_id, scheduled_date, time_slot, status, notes) VALUES
(1, 3, CURDATE(), '08:00-10:00', 'scheduled', 'Sampah organik dan plastik'),
(2, 4, CURDATE(), '10:00-12:00', 'in-progress', 'Sampah kertas banyak'),
(1, 5, CURDATE(), '13:00-15:00', 'scheduled', 'Sampah logam dan organik'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00-10:00', 'scheduled', 'Penjemputan rutin'),
(2, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00-16:00', 'scheduled', 'Sampah campuran');

-- Insert pickups (completed ones for statistics)
INSERT INTO pickups (customer_id, driver_id, total_amount, status, scheduled_date, completed_date, notes) VALUES
(3, 1, 19000.00, 'completed', DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Penjemputan lancar'),
(4, 2, 15000.00, 'completed', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Sampah kertas banyak'),
(5, 1, 18000.00, 'completed', DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Sampah logam dan organik'),
(3, 2, 21000.00, 'completed', DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Penjemputan rutin'),
(4, 1, 24000.00, 'completed', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Sampah campuran'),
(5, 3, 12000.00, 'in-progress', CURDATE(), NULL, 'Sedang dalam perjalanan'),
(3, 2, 16000.00, 'scheduled', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, 'Dijadwalkan besok');

-- Insert pickup items for completed pickups
INSERT INTO pickup_items (pickup_id, product_id, quantity, price, subtotal) VALUES
-- Pickup 1 (ID: 1)
(1, 1, 5.0, 2000.00, 10000.00),  -- Sampah Organik 5kg
(1, 2, 3.0, 3000.00, 9000.00),   -- Sampah Plastik 3kg

-- Pickup 2 (ID: 2)
(2, 3, 10.0, 1500.00, 15000.00), -- Sampah Kertas 10kg

-- Pickup 3 (ID: 3)
(3, 4, 2.0, 5000.00, 10000.00),  -- Sampah Logam 2kg
(3, 1, 4.0, 2000.00, 8000.00),   -- Sampah Organik 4kg

-- Pickup 4 (ID: 4)
(4, 2, 7.0, 3000.00, 21000.00),  -- Sampah Plastik 7kg

-- Pickup 5 (ID: 5)
(5, 1, 6.0, 2000.00, 12000.00),  -- Sampah Organik 6kg
(5, 3, 8.0, 1500.00, 12000.00),  -- Sampah Kertas 8kg

-- Pickup 6 (ID: 6) - in progress
(6, 1, 3.0, 2000.00, 6000.00),   -- Sampah Organik 3kg
(6, 5, 2.4, 2500.00, 6000.00),   -- Sampah Kaca 2.4kg

-- Pickup 7 (ID: 7) - scheduled
(7, 2, 4.0, 3000.00, 12000.00),  -- Sampah Plastik 4kg
(7, 3, 2.7, 1500.00, 4000.00);   -- Sampah Kertas 2.7kg

-- Insert some waste inputs (operator input data)
INSERT INTO waste_inputs (customer_id, operator_id, total_amount, notes) VALUES
(3, 2, 15000.00, 'Sampah diantar langsung ke kantor'),
(4, 2, 12000.00, 'Sampah kertas dan plastik'),
(5, 2, 18000.00, 'Campuran berbagai jenis sampah');

-- Insert waste input items
INSERT INTO waste_input_items (waste_input_id, product_id, quantity, price, subtotal) VALUES
-- Waste Input 1
(1, 1, 4.0, 2000.00, 8000.00),   -- Sampah Organik 4kg
(1, 2, 2.3, 3000.00, 7000.00),   -- Sampah Plastik 2.3kg

-- Waste Input 2
(2, 3, 6.0, 1500.00, 9000.00),   -- Sampah Kertas 6kg
(2, 2, 1.0, 3000.00, 3000.00),   -- Sampah Plastik 1kg

-- Waste Input 3
(3, 1, 5.0, 2000.00, 10000.00),  -- Sampah Organik 5kg
(3, 4, 1.6, 5000.00, 8000.00);   -- Sampah Logam 1.6kg
