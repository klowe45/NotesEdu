-- Migration: Create notification_targets table
-- This table tracks which staff members should see which notifications

CREATE TABLE IF NOT EXISTS notification_targets (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(notification_id, staff_id)
);

CREATE INDEX idx_notification_targets_notification_id ON notification_targets(notification_id);
CREATE INDEX idx_notification_targets_staff_id ON notification_targets(staff_id);

-- Migration rollback
-- DROP TABLE IF EXISTS notification_targets;
