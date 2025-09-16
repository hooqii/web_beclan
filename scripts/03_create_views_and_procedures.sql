-- Create useful views and stored procedures for the Waste Management System
USE waste_management;

-- View for pickup details with customer and driver information
CREATE VIEW pickup_details AS
SELECT 
    p.id,
    p.total_amount,
    p.status,
    p.scheduled_date,
    p.completed_date,
    p.notes,
    p.created_at,
    u.name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    u.address AS customer_address,
    d.name AS driver_name,
    d.phone AS driver_phone,
    d.vehicle_number
FROM pickups p
JOIN users u ON p.customer_id = u.id
JOIN drivers d ON p.driver_id = d.id;

-- View for schedule details with customer and driver information
CREATE VIEW schedule_details AS
SELECT 
    s.id,
    s.scheduled_date,
    s.time_slot,
    s.status,
    s.notes,
    s.created_at,
    u.name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    u.address AS customer_address,
    d.name AS driver_name,
    d.phone AS driver_phone,
    d.vehicle_number
FROM schedules s
JOIN users u ON s.customer_id = u.id
JOIN drivers d ON s.driver_id = d.id;

-- View for waste input details
CREATE VIEW waste_input_details AS
SELECT 
    wi.id,
    wi.total_amount,
    wi.notes,
    wi.created_at,
    c.name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    c.address AS customer_address,
    o.name AS operator_name
FROM waste_inputs wi
JOIN users c ON wi.customer_id = c.id
JOIN users o ON wi.operator_id = o.id;

-- Stored procedure to get monthly pickup statistics
DELIMITER //
CREATE PROCEDURE GetMonthlyPickupStats(IN target_month INT, IN target_year INT)
BEGIN
    SELECT 
        COUNT(*) as total_pickups,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_pickup_value
    FROM pickups 
    WHERE MONTH(scheduled_date) = target_month 
    AND YEAR(scheduled_date) = target_year 
    AND status = 'completed';
END //
DELIMITER ;

-- Stored procedure to get product quantities for a specific month
DELIMITER //
CREATE PROCEDURE GetMonthlyProductQuantities(IN target_month INT, IN target_year INT)
BEGIN
    SELECT 
        pr.name as product_name,
        pr.icon,
        pr.unit,
        SUM(pi.quantity) as total_quantity,
        SUM(pi.subtotal) as total_value
    FROM pickup_items pi
    JOIN pickups p ON pi.pickup_id = p.id
    JOIN products pr ON pi.product_id = pr.id
    WHERE MONTH(p.scheduled_date) = target_month 
    AND YEAR(p.scheduled_date) = target_year 
    AND p.status = 'completed'
    GROUP BY pr.id, pr.name, pr.icon, pr.unit
    ORDER BY total_quantity DESC;
END //
DELIMITER ;

-- Stored procedure to get driver performance
DELIMITER //
CREATE PROCEDURE GetDriverPerformance(IN target_month INT, IN target_year INT)
BEGIN
    SELECT 
        d.name as driver_name,
        d.vehicle_number,
        COUNT(p.id) as total_pickups,
        SUM(p.total_amount) as total_revenue,
        AVG(p.total_amount) as average_pickup_value,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_pickups,
        COUNT(CASE WHEN p.status = 'cancelled' THEN 1 END) as cancelled_pickups
    FROM drivers d
    LEFT JOIN pickups p ON d.id = p.driver_id 
        AND MONTH(p.scheduled_date) = target_month 
        AND YEAR(p.scheduled_date) = target_year
    WHERE d.status = 'active'
    GROUP BY d.id, d.name, d.vehicle_number
    ORDER BY total_revenue DESC;
END //
DELIMITER ;

-- Function to calculate total waste collected by customer
DELIMITER //
CREATE FUNCTION GetCustomerTotalWaste(customer_id INT) 
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE total_weight DECIMAL(10,2) DEFAULT 0;
    
    SELECT COALESCE(SUM(pi.quantity), 0) INTO total_weight
    FROM pickup_items pi
    JOIN pickups p ON pi.pickup_id = p.id
    WHERE p.customer_id = customer_id AND p.status = 'completed';
    
    RETURN total_weight;
END //
DELIMITER ;

-- Trigger to automatically update pickup total_amount when pickup_items are inserted/updated
DELIMITER //
CREATE TRIGGER update_pickup_total_after_item_insert
AFTER INSERT ON pickup_items
FOR EACH ROW
BEGIN
    UPDATE pickups 
    SET total_amount = (
        SELECT SUM(subtotal) 
        FROM pickup_items 
        WHERE pickup_id = NEW.pickup_id
    )
    WHERE id = NEW.pickup_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_pickup_total_after_item_update
AFTER UPDATE ON pickup_items
FOR EACH ROW
BEGIN
    UPDATE pickups 
    SET total_amount = (
        SELECT SUM(subtotal) 
        FROM pickup_items 
        WHERE pickup_id = NEW.pickup_id
    )
    WHERE id = NEW.pickup_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_pickup_total_after_item_delete
AFTER DELETE ON pickup_items
FOR EACH ROW
BEGIN
    UPDATE pickups 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM pickup_items 
        WHERE pickup_id = OLD.pickup_id
    )
    WHERE id = OLD.pickup_id;
END //
DELIMITER ;

-- Similar triggers for waste_inputs
DELIMITER //
CREATE TRIGGER update_waste_input_total_after_item_insert
AFTER INSERT ON waste_input_items
FOR EACH ROW
BEGIN
    UPDATE waste_inputs 
    SET total_amount = (
        SELECT SUM(subtotal) 
        FROM waste_input_items 
        WHERE waste_input_id = NEW.waste_input_id
    )
    WHERE id = NEW.waste_input_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_waste_input_total_after_item_update
AFTER UPDATE ON waste_input_items
FOR EACH ROW
BEGIN
    UPDATE waste_inputs 
    SET total_amount = (
        SELECT SUM(subtotal) 
        FROM waste_input_items 
        WHERE waste_input_id = NEW.waste_input_id
    )
    WHERE id = NEW.waste_input_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_waste_input_total_after_item_delete
AFTER DELETE ON waste_input_items
FOR EACH ROW
BEGIN
    UPDATE waste_inputs 
    SET total_amount = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM waste_input_items 
        WHERE waste_input_id = OLD.waste_input_id
    )
    WHERE id = OLD.waste_input_id;
END //
DELIMITER ;
