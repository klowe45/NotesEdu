-- Migration: Create push_subscriptions table
-- This table stores push notification subscriptions for staff members

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, endpoint)
);

CREATE INDEX idx_push_subscriptions_staff_id ON push_subscriptions(staff_id);

-- Migration rollback
-- DROP TABLE IF EXISTS push_subscriptions;
