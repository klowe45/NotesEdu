import { Router } from "express";
import BehavioralReport from "../models/BehavioralReport.js";

const router = Router();

// Create a new behavioral report
router.post("/", async (req, res, next) => {
  try {
    const { client_id, content, author, staff_id } = req.body;

    if (!client_id || !content || !author) {
      return res.status(400).json({
        error: "client_id, content, and author are required"
      });
    }

    const report = await BehavioralReport.create({
      client_id,
      content,
      author,
      staff_id: staff_id || null,
    });

    res.status(201).json(report);
  } catch (e) {
    next(e);
  }
});

// Get all behavioral reports
router.get("/", async (_req, res, next) => {
  try {
    const reports = await BehavioralReport.findAll();
    res.json(reports);
  } catch (e) {
    next(e);
  }
});

// Get behavioral reports for a specific client
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const reports = await BehavioralReport.findByClientId(clientId);
    res.json(reports);
  } catch (e) {
    next(e);
  }
});

// Get a specific behavioral report by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await BehavioralReport.findById(id);

    if (!report) {
      return res.status(404).json({ error: "Behavioral report not found" });
    }

    res.json(report);
  } catch (e) {
    next(e);
  }
});

// Delete a behavioral report
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await BehavioralReport.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Behavioral report not found" });
    }

    res.json({ message: "Behavioral report deleted successfully", id: deleted.id });
  } catch (e) {
    next(e);
  }
});

export default router;
