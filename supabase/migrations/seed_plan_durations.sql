-- Update existing plans with duration types
UPDATE subscription_plans SET duration_type = 'month', duration_value = 1 WHERE name = 'Basic Plan';
UPDATE subscription_plans SET duration_type = 'month', duration_value = 1 WHERE name = 'Premium Plan';
UPDATE subscription_plans SET duration_type = 'month', duration_value = 1 WHERE name = 'Deluxe Plan';

-- Insert sample plans with different durations
INSERT INTO subscription_plans (name, price, description, duration_type, duration_value, quantity_per_day, delivery_frequency)
VALUES 
  ('Daily Fresh', 50, 'Fresh flowers delivered daily', 'day', 1, 1, 'Daily'),
  ('Weekly Bundle', 300, 'Weekly flower bundle subscription', 'week', 1, 7, 'Weekly'),
  ('Monthly Premium', 1200, 'Premium monthly flower subscription', 'month', 1, 30, 'Daily');
