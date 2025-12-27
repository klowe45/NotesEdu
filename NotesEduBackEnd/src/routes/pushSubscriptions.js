import { Router } from "express";
import {
  savePushSubscription,
  removePushSubscription,
  getStaffSubscriptions,
} from "../services/pushNotificationService.js";

const router = Router();

// Get VAPID public key for client
router.get("/vapid-public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

// Subscribe to push notifications
router.post("/subscribe", async (req, res, next) => {
  try {
    const { staffId, subscription } = req.body;

    if (!staffId || !subscription) {
      return res.status(400).json({
        error: "staffId and subscription are required",
      });
    }

    await savePushSubscription(staffId, subscription);

    res.status(201).json({
      message: "Push subscription saved successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Unsubscribe from push notifications
router.post("/unsubscribe", async (req, res, next) => {
  try {
    const { staffId, endpoint } = req.body;

    if (!staffId || !endpoint) {
      return res.status(400).json({
        error: "staffId and endpoint are required",
      });
    }

    await removePushSubscription(staffId, endpoint);

    res.json({
      message: "Push subscription removed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Get all subscriptions for a staff member
router.get("/subscriptions/:staffId", async (req, res, next) => {
  try {
    const { staffId } = req.params;

    const subscriptions = await getStaffSubscriptions(parseInt(staffId));

    res.json({
      subscriptions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
