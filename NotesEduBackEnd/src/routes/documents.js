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
    const { studentId, author } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Get student information
    const studentResult = await pool.query(
      "SELECT first_name, last_name FROM students WHERE id = $1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { first_name, last_name } = studentResult.rows[0];

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

// Get documents for a student
router.get("/student/:studentId", async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Get student information
    const studentResult = await pool.query(
      "SELECT first_name, last_name FROM students WHERE id = $1",
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { first_name, last_name } = studentResult.rows[0];

    // Get documents for this student
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

// Send document via email
router.post("/send-email", async (req, res, next) => {
  try {
    const { documentId, recipientEmail, recipientName, message, senderName } = req.body;

    if (!documentId || !recipientEmail) {
      return res.status(400).json({ error: "Document ID and recipient email are required" });
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

    // Create transporter based on environment
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use real SMTP credentials if provided
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Generate test account for development/testing
      try {
        console.log("📧 Creating test email account...");
        const testAccount = await Promise.race([
          nodemailer.createTestAccount(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout creating test account")), 10000)
          )
        ]);
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log("✅ Test email account created:", testAccount.user);
      } catch (testAccountError) {
        console.error("⚠️ Failed to create test account:", testAccountError.message);
        return res.status(503).json({
          error: "Email service temporarily unavailable. Please try again or configure SMTP credentials in .env file."
        });
      }
    }

    // Send email with attachment
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"NotesEdu System" <noreply@notesedu.com>',
      to: recipientEmail,
      subject: `Document: ${document.filename}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Document Shared with You</h2>
          <p>Hello ${recipientName || "there"},</p>
          <p>${senderName || "A teacher"} has shared a document with you from NotesEdu.</p>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Student:</strong> ${document.first_name} ${document.last_name}</p>
            <p style="margin: 5px 0;"><strong>Document:</strong> ${document.filename}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${document.file_type.toUpperCase().replace('.', '')}</p>
          </div>

          ${message ? `<p><strong>Message:</strong></p><p style="padding: 10px; background-color: #f9fafb; border-left: 4px solid #2563eb;">${message}</p>` : ''}

          <p>Please find the document attached to this email.</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">This is an automated message from NotesEdu. Please do not reply to this email.</p>
        </div>
      `,
      attachments: [
        {
          filename: document.filename,
          path: document.file_path,
          contentType: getContentType(document.file_type),
        },
      ],
    });

    console.log("✅ Email sent successfully! Message ID: %s", info.messageId);

    // Generate preview URL for test emails
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 View email preview at: %s", previewUrl);
    }

    res.json({
      message: "Email sent successfully",
      messageId: info.messageId,
      previewUrl: previewUrl, // URL to view test email in browser
      isTestEmail: !process.env.SMTP_HOST
    });
  } catch (e) {
    console.error("Email error:", e);
    next(e);
  }
});

export default router;
