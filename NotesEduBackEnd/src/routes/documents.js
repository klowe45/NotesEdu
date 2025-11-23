import { Router } from "express";
import { pool } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept common document types including macOS iWork files
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png|txt|pages|numbers|key/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    // Check mimetype or extension (Pages files may not have standard mimetypes)
    const allowedMimetypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/vnd.apple.pages',
      'application/vnd.apple.numbers',
      'application/vnd.apple.keynote',
      'application/x-iwork-pages-sffpages',
      'application/x-iwork-numbers-sffnumbers',
      'application/x-iwork-keynote-sffkey',
      'application/octet-stream' // Fallback for unrecognized types
    ];

    const mimetypeAllowed = allowedMimetypes.includes(file.mimetype);

    if (extname || mimetypeAllowed) {
      return cb(null, true);
    } else {
      cb(new Error("Only document files are allowed (PDF, DOC, DOCX, JPG, PNG, TXT, Pages, Numbers, Keynote)"));
    }
  },
});

// Upload document(s)
router.post("/upload", upload.array("files", 10), async (req, res, next) => {
  try {
    const { clientId, author } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: "Client ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Get client information
    const clientResult = await pool.query(
      "SELECT first_name, last_name FROM clients WHERE id = $1",
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const { first_name, last_name } = clientResult.rows[0];

    // Insert document records into database
    const insertPromises = req.files.map((file) => {
      return pool.query(
        `INSERT INTO documents (first_name, last_name, date, filename, file_type, author, file_path)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          first_name,
          last_name,
          new Date().toISOString().split("T")[0], // Current date
          file.originalname,
          path.extname(file.originalname).toLowerCase(),
          author || "Unknown",
          file.path,
        ]
      );
    });

    const results = await Promise.all(insertPromises);
    const insertedDocuments = results.map((r) => r.rows[0]);

    res.status(201).json({
      message: "Documents uploaded successfully",
      documents: insertedDocuments,
    });
  } catch (e) {
    // Clean up uploaded files if database insert fails
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    next(e);
  }
});

// Get documents for a client
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { clientId } = req.params;

    // Get client information
    const clientResult = await pool.query(
      "SELECT first_name, last_name FROM clients WHERE id = $1",
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    const { first_name, last_name } = clientResult.rows[0];

    // Get documents for this client
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, date, filename, file_type, author, file_path
       FROM documents
       WHERE first_name = $1 AND last_name = $2
       ORDER BY date DESC, id DESC`,
      [first_name, last_name]
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get all documents
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, date, filename, file_type, author
       FROM documents
       ORDER BY date DESC, id DESC`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Download/view a specific document by ID
router.get("/download/:documentId", async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Get document information from database
    const { rows } = await pool.query(
      "SELECT filename, file_path, file_type FROM documents WHERE id = $1",
      [documentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = rows[0];

    // Check if file exists
    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Set appropriate headers for download/viewing
    res.setHeader("Content-Disposition", `inline; filename="${document.filename}"`);
    res.setHeader("Content-Type", getContentType(document.file_type));

    // Send the file
    res.sendFile(path.resolve(document.file_path));
  } catch (e) {
    next(e);
  }
});

// Helper function to get content type
function getContentType(fileType) {
  const contentTypes = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".txt": "text/plain",
    ".pages": "application/vnd.apple.pages",
    ".numbers": "application/vnd.apple.numbers",
    ".key": "application/vnd.apple.keynote",
  };
  return contentTypes[fileType.toLowerCase()] || "application/octet-stream";
}

// Generate .eml file for user's email client
router.post("/generate-email", async (req, res, next) => {
  try {
    const { documentId, recipientEmail, recipientName, message, senderName } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required" });
    }

    // Get document information from database
    const { rows } = await pool.query(
      "SELECT filename, file_path, file_type, first_name, last_name FROM documents WHERE id = $1",
      [documentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = rows[0];

    // Check if file exists
    if (!fs.existsSync(document.file_path)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // Read the file and encode as base64
    const fileContent = fs.readFileSync(document.file_path);
    const base64Content = fileContent.toString('base64');

    // Generate boundary for MIME multipart
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Build email body text
    const emailBodyText = `Hello ${recipientName || "there"},

${senderName || "A teacher"} has shared a document with you from NeuroNotes.

Client: ${document.first_name} ${document.last_name}
Document: ${document.filename}
Type: ${document.file_type.toUpperCase().replace('.', '')}

${message ? `Message:\n${message}\n\n` : ''}Please find the document attached to this email.

---
This is an automated message from NeuroNotes. Please do not reply to this email.`;

    // Build .eml file content
    const emlContent = `To: ${recipientEmail || ''}
Subject: Document: ${document.filename}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${emailBodyText}

--${boundary}
Content-Type: ${getContentType(document.file_type)}
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${document.filename}"

${base64Content}

--${boundary}--`;

    // Send the .eml file as a download
    res.setHeader('Content-Type', 'message/rfc822');
    res.setHeader('Content-Disposition', `attachment; filename="NeuroNotes-${document.filename}.eml"`);
    res.send(emlContent);

    console.log(`✅ Generated .eml file for document: ${document.filename}`);
  } catch (e) {
    console.error("Email generation error:", e);
    next(e);
  }
});

export default router;
