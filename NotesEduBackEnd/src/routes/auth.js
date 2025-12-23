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
      "SELECT id FROM teachers WHERE email = $1",
      [email]
    );

    if (existingTeacher.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new teacher with hashed password
    const { rows } = await pool.query(
      `INSERT INTO teachers (first_name, last_name, email, password)
       VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, created_at`,
      [first_name, last_name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Teacher account created successfully",
      teacher: rows[0],
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
      "SELECT id, first_name, last_name, email, password FROM teachers WHERE email = $1",
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

    res.status(201).json({
      message: "Organization account created successfully",
      organization: rows[0],
    });
  } catch (e) {
    next(e);
  }
});

export default router;