import webPush from "web-push";
import { pool } from "../db.js";
import "dotenv/config";

// Configure web-push with VAPID details
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Send push notification to specific staff members
 * @param {Array<number>} staffIds - Array of staff IDs to send notifications to
 * @param {Object} payload - Notification payload
 * @param {string} payload.title - Notification title
 * @param {string} payload.body - Notification body
 * @param {string} payload.icon - Optional notification icon URL
 * @param {string} payload.url - Optional URL to open when notification is clicked
 */
export async function sendPushNotifications(staffIds, payload) {
  if (!staffIds || staffIds.length === 0) {
    console.log("No staff IDs provided for push notifications");
    return;
  }

  try {
    // Get all push subscriptions for the specified staff members
    const { rows: subscriptions } = await pool.query(
      `SELECT id, staff_id, endpoint, p256dh_key, auth_key
       FROM push_subscriptions
       WHERE staff_id = ANY($1)`,
      [staffIds]
    );

    if (subscriptions.length === 0) {
      console.log("No push subscriptions found for the specified staff members");
      return;
    }

    // Prepare notification payload
    const notificationPayload = JSON.stringify({
      title: payload.title || "New Notification",
      body: payload.body || "",
      icon: payload.icon || "/logo192.png",
      badge: payload.badge || "/logo192.png",
      url: payload.url || "/",
      timestamp: Date.now(),
    });

    // Send push notification to each subscription
    const sendPromises = subscriptions.map(async (subscription) => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh_key,
          auth: subscription.auth_key,
        },
      };

      try {
        await webPush.sendNotification(pushSubscription, notificationPayload);
        console.log(`Push notification sent to staff ${subscription.staff_id}`);
        return { success: true, staffId: subscription.staff_id };
      } catch (error) {
        console.error(`Failed to send push to staff ${subscription.staff_id}:`, error);

        // If subscription is expired or invalid (410 Gone), remove it
        if (error.statusCode === 410) {
          await pool.query(
            "DELETE FROM push_subscriptions WHERE id = $1",
            [subscription.id]
          );
          console.log(`Removed expired subscription for staff ${subscription.staff_id}`);
        }

        return { success: false, staffId: subscription.staff_id, error: error.message };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `Push notifications sent: ${successCount} succeeded, ${failureCount} failed`
    );

    return { success: true, successCount, failureCount, results };
  } catch (error) {
    console.error("Error sending push notifications:", error);
    throw error;
  }
}

/**
 * Save push subscription for a staff member
 * @param {number} staffId - Staff member ID
 * @param {Object} subscription - Push subscription object from browser
 */
export async function savePushSubscription(staffId, subscription) {
  try {
    const { endpoint, keys } = subscription;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      throw new Error("Invalid subscription object");
    }

    // Insert or update subscription
    await pool.query(
      `INSERT INTO push_subscriptions (staff_id, endpoint, p256dh_key, auth_key, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (staff_id, endpoint)
       DO UPDATE SET
         p256dh_key = EXCLUDED.p256dh_key,
         auth_key = EXCLUDED.auth_key,
         updated_at = NOW()`,
      [staffId, endpoint, keys.p256dh, keys.auth]
    );

    console.log(`Push subscription saved for staff ${staffId}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving push subscription:", error);
    throw error;
  }
}

/**
 * Remove push subscription for a staff member
 * @param {number} staffId - Staff member ID
 * @param {string} endpoint - Subscription endpoint to remove
 */
export async function removePushSubscription(staffId, endpoint) {
  try {
    await pool.query(
      "DELETE FROM push_subscriptions WHERE staff_id = $1 AND endpoint = $2",
      [staffId, endpoint]
    );

    console.log(`Push subscription removed for staff ${staffId}`);
    return { success: true };
  } catch (error) {
    console.error("Error removing push subscription:", error);
    throw error;
  }
}

/**
 * Get all push subscriptions for a staff member
 * @param {number} staffId - Staff member ID
 */
export async function getStaffSubscriptions(staffId) {
  try {
    const { rows } = await pool.query(
      "SELECT endpoint, created_at FROM push_subscriptions WHERE staff_id = $1",
      [staffId]
    );

    return rows;
  } catch (error) {
    console.error("Error getting staff subscriptions:", error);
    throw error;
  }
}
