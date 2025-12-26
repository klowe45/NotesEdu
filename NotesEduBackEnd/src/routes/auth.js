import { Router } from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";
const router = Router();

const SALT_ROUNDS = 10;

// Signup route - creates a new teacher
router.post("/signup", async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if teacher already exists
    const existingTeacher = await pool.query(
      "SELECT id FROM owners WHERE email = $1",
      [email]
    );

    if (existingTeacher.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new teacher with hashed password
    const { rows } = await pool.query(
      `INSERT INTO owners (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at`,
      [first_name, last_name, email, hashedPassword]
    );

    const newTeacher = rows[0];

    // Initialize default categories for the new teacher
    const defaultCategories = [
      "Money Management",
      "Meal Prep",
      "Medication Management",
      "Housekeeping",
      "Shopping",
      "Transportation",
      "Communication",
      "Health Management",
    ];

    for (const categoryName of defaultCategories) {
      try {
        await pool.query(
          `INSERT INTO categories (teacher_id, name)
           VALUES ($1, $2)`,
          [newTeacher.id, categoryName]
        );
      } catch (catErr) {
        // Log error but don't fail signup if category creation fails
        console.error(`Failed to create default category "${categoryName}":`, catErr);
      }
    }

    res.status(201).json({
      message: "Teacher account created successfully",
      teacher: newTeacher,
    });
  } catch (e) {
    next(e);
  }
});

// Signin route
router.post("/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find teacher by email
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, password FROM owners WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const teacher = rows[0];

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return teacher data (in production, return a JWT token)
    res.json({
      message: "Signin successful",
      teacher: {
        id: teacher.id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        email: teacher.email,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Signout route
router.post("/signout", async (_req, res, next) => {
  try {
    // In production, handle session/token invalidation
    res.json({ message: "Signout successful" });
  } catch (e) {
    next(e);
  }
});

// Organization signin route
router.post("/organization/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find organization by email
    const { rows } = await pool.query(
      "SELECT id, name, email, password FROM organizations WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const organization = rows[0];

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, organization.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return organization data
    res.json({
      message: "Signin successful",
      organization: {
        id: organization.id,
        name: organization.name,
        email: organization.email,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Organization signup route
router.post("/organization/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if organization already exists
    const existingOrg = await pool.query(
      "SELECT id FROM organizations WHERE email = $1",
      [email]
    );

    if (existingOrg.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new organization with hashed password
    const { rows } = await pool.query(
      `INSERT INTO organizations (name, email, password)
       VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const newOrg = rows[0];

    // Initialize default categories for the new organization
    const defaultCategories = [
      "Money Management",
      "Meal Prep",
      "Medication Management",
      "Housekeeping",
      "Shopping",
      "Transportation",
      "Communication",
      "Health Management",
    ];

    for (const categoryName of defaultCategories) {
      try {
        await pool.query(
          `INSERT INTO categories (org_id, name)
           VALUES ($1, $2)`,
          [newOrg.id, categoryName]
        );
      } catch (catErr) {
        // Log error but don't fail signup if category creation fails
        console.error(`Failed to create default category "${categoryName}":`, catErr);
      }
    }

    res.status(201).json({
      message: "Organization account created successfully",
      organization: newOrg,
    });
  } catch (e) {
    next(e);
  }
});

// Get all staff members for an organization
router.get("/staff/:orgId", async (req, res, next) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    // Fetch all staff members for the organization
    const { rows } = await pool.query(
      `SELECT id, first_name, middle_name, last_name, date_of_birth, email, role, status, created_at
       FROM staff
       WHERE org_id = $1
       ORDER BY created_at DESC`,
      [orgId]
    );

    res.json({
      staff: rows,
      count: rows.length,
    });
  } catch (e) {
    next(e);
  }
});

// Add staff member route
router.post("/staff/create", async (req, res, next) => {
  try {
    const { firstName, middleName, lastName, dateOfBirth, email, password, isAdmin, orgId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !email || !password || !orgId) {
      return res.status(400).json({ error: "Required fields: firstName, lastName, dateOfBirth, email, password, orgId" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if staff already exists
    const existingStaff = await pool.query(
      "SELECT id FROM staff WHERE email = $1",
      [email]
    );

    if (existingStaff.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Determine role based on isAdmin flag
    const role = isAdmin ? 'admin' : 'staff';

    // Insert new staff member with all fields
    const { rows } = await pool.query(
      `INSERT INTO staff (first_name, middle_name, last_name, date_of_birth, email, password_hash, org_id, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, first_name, middle_name, last_name, date_of_birth, email, role, status, created_at`,
      [firstName, middleName || null, lastName, dateOfBirth, email, hashedPassword, orgId, role, 'active']
    );

    res.status(201).json({
      message: "Staff member created successfully",
      staff: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Get single staff member by ID
router.get("/staff/single/:staffId", async (req, res, next) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({ error: "Staff ID is required" });
    }

    // Fetch staff member by ID
    const { rows } = await pool.query(
      `SELECT id, first_name, middle_name, last_name, date_of_birth, email, role, status, org_id, created_at
       FROM staff
       WHERE id = $1`,
      [staffId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({
      staff: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Update staff member
router.put("/staff/update/:staffId", async (req, res, next) => {
  try {
    const { staffId } = req.params;
    const { firstName, middleName, lastName, dateOfBirth, email, isAdmin } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !email) {
      return res.status(400).json({ error: "Required fields: firstName, lastName, dateOfBirth, email" });
    }

    // Check if staff member exists
    const existingStaff = await pool.query(
      "SELECT id FROM staff WHERE id = $1",
      [staffId]
    );

    if (existingStaff.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Check if email is already taken by another staff member
    const emailCheck = await pool.query(
      "SELECT id FROM staff WHERE email = $1 AND id != $2",
      [email, staffId]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Determine role based on isAdmin flag
    const role = isAdmin ? 'admin' : 'staff';

    // Update staff member
    const { rows } = await pool.query(
      `UPDATE staff
       SET first_name = $1, middle_name = $2, last_name = $3, date_of_birth = $4, email = $5, role = $6
       WHERE id = $7
       RETURNING id, first_name, middle_name, last_name, date_of_birth, email, role, status, created_at`,
      [firstName, middleName || null, lastName, dateOfBirth, email, role, staffId]
    );

    res.json({
      message: "Staff member updated successfully",
      staff: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Get all viewers for an organization
router.get("/viewer/:orgId", async (req, res, next) => {
  try {
    const { orgId } = req.params;

    if (!orgId) {
      return res.status(400).json({ error: "Organization ID is required" });
    }

    // Fetch all viewers for the organization
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, status, created_at
       FROM viewers
       WHERE org_id = $1
       ORDER BY created_at DESC`,
      [orgId]
    );

    res.json({
      viewers: rows,
      count: rows.length,
    });
  } catch (e) {
    next(e);
  }
});

// Add viewer route
router.post("/viewer/create", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, orgId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !orgId) {
      return res.status(400).json({ error: "Required fields: firstName, lastName, email, password, orgId" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if viewer already exists
    const existingViewer = await pool.query(
      "SELECT id FROM viewers WHERE email = $1",
      [email]
    );

    if (existingViewer.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new viewer
    const { rows } = await pool.query(
      `INSERT INTO viewers (first_name, last_name, email, password_hash, org_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, status, created_at`,
      [firstName, lastName, email, hashedPassword, orgId, 'active']
    );

    res.status(201).json({
      message: "Viewer created successfully",
      viewer: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Get single viewer by ID
router.get("/viewer/single/:viewerId", async (req, res, next) => {
  try {
    const { viewerId } = req.params;

    if (!viewerId) {
      return res.status(400).json({ error: "Viewer ID is required" });
    }

    // Fetch viewer by ID
    const { rows } = await pool.query(
      `SELECT id, first_name, last_name, email, status, org_id, created_at
       FROM viewers
       WHERE id = $1`,
      [viewerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Viewer not found" });
    }

    res.json({
      viewer: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Update viewer
router.put("/viewer/update/:viewerId", async (req, res, next) => {
  try {
    const { viewerId } = req.params;
    const { firstName, lastName, email } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Required fields: firstName, lastName, email" });
    }

    // Check if viewer exists
    const existingViewer = await pool.query(
      "SELECT id FROM viewers WHERE id = $1",
      [viewerId]
    );

    if (existingViewer.rows.length === 0) {
      return res.status(404).json({ error: "Viewer not found" });
    }

    // Check if email is already taken by another viewer
    const emailCheck = await pool.query(
      "SELECT id FROM viewers WHERE email = $1 AND id != $2",
      [email, viewerId]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Update viewer
    const { rows } = await pool.query(
      `UPDATE viewers
       SET first_name = $1, last_name = $2, email = $3
       WHERE id = $4
       RETURNING id, first_name, last_name, email, status, created_at`,
      [firstName, lastName, email, viewerId]
    );

    res.json({
      message: "Viewer updated successfully",
      viewer: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

// Get viewer's assigned clients
router.get("/viewer/:viewerId/clients", async (req, res, next) => {
  try {
    const { viewerId } = req.params;

    const { rows } = await pool.query(
      `SELECT client_id FROM viewer_clients WHERE viewer_id = $1`,
      [viewerId]
    );

    res.json({
      clientIds: rows.map(row => row.client_id),
    });
  } catch (e) {
    next(e);
  }
});

// Update viewer's assigned clients
router.put("/viewer/:viewerId/clients", async (req, res, next) => {
  try {
    const { viewerId } = req.params;
    const { clientIds } = req.body;

    // Delete existing assignments
    await pool.query(
      `DELETE FROM viewer_clients WHERE viewer_id = $1`,
      [viewerId]
    );

    // Insert new assignments
    if (clientIds && clientIds.length > 0) {
      const values = clientIds.map((clientId, index) =>
        `($1, $${index + 2})`
      ).join(', ');

      await pool.query(
        `INSERT INTO viewer_clients (viewer_id, client_id) VALUES ${values}`,
        [viewerId, ...clientIds]
      );
    }

    res.json({
      message: "Client assignments updated successfully",
    });
  } catch (e) {
    next(e);
  }
});

// Viewer signin route
router.post("/viewer/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find viewer by email
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, password_hash, org_id FROM viewers WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const viewer = rows[0];

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, viewer.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return viewer data
    res.json({
      message: "Signin successful",
      viewer: {
        id: viewer.id,
        first_name: viewer.first_name,
        last_name: viewer.last_name,
        email: viewer.email,
        org_id: viewer.org_id,
      },
    });
  } catch (e) {
    next(e);
  }
});

// Request password reset
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType) {
      return res.status(400).json({ error: "Email and user type are required" });
    }

    // Check if user exists based on type
    let userExists = false;
    let tableName;

    if (userType === "staff") {
      tableName = "owners";
      const result = await pool.query("SELECT id FROM owners WHERE email = $1", [email]);
      userExists = result.rows.length > 0;
    } else if (userType === "organization") {
      tableName = "organizations";
      const result = await pool.query("SELECT id FROM organizations WHERE email = $1", [email]);
      userExists = result.rows.length > 0;
    } else if (userType === "viewer") {
      tableName = "viewers";
      const result = await pool.query("SELECT id FROM viewers WHERE email = $1", [email]);
      userExists = result.rows.length > 0;
    }

    // Always return success to prevent email enumeration
    if (!userExists) {
      return res.json({
        message: "If an account exists with this email, a reset token has been generated."
      });
    }

    // Generate reset token (6-digit code)
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing unused tokens for this email
    await pool.query(
      "DELETE FROM password_reset_tokens WHERE email = $1 AND used = FALSE",
      [email]
    );

    // Store token in database
    await pool.query(
      `INSERT INTO password_reset_tokens (email, token, user_type, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [email, token, userType, expiresAt]
    );

    // In production, send email here
    // For now, return token in response (remove this in production)
    res.json({
      message: "If an account exists with this email, a reset token has been generated.",
      token: token // Remove this in production
    });
  } catch (e) {
    next(e);
  }
});

// Reset password with token
router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, token, newPassword, userType } = req.body;

    if (!email || !token || !newPassword || !userType) {
      return res.status(400).json({ error: "Email, token, new password, and user type are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Find valid token
    const tokenResult = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE email = $1 AND token = $2 AND user_type = $3 AND used = FALSE AND expires_at > NOW()`,
      [email, token, userType]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password based on user type
    if (userType === "staff") {
      await pool.query(
        "UPDATE owners SET password = $1 WHERE email = $2",
        [hashedPassword, email]
      );
    } else if (userType === "organization") {
      await pool.query(
        "UPDATE organizations SET password = $1 WHERE email = $2",
        [hashedPassword, email]
      );
    } else if (userType === "viewer") {
      await pool.query(
        "UPDATE viewers SET password_hash = $1 WHERE email = $2",
        [hashedPassword, email]
      );
    }

    // Mark token as used
    await pool.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE email = $1 AND token = $2",
      [email, token]
    );

    res.json({ message: "Password reset successful" });
  } catch (e) {
    next(e);
  }
});

export default router;