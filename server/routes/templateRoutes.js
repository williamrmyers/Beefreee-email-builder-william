import express from "express";
import sql from "../db.client.js";

const router = express.Router();

// 1 Save a new template
router.post("/templates", async (req, res) => {
  try {
    const { name, data } = req.body;
    if (!name || !data)
      return res.status(400).json({ error: "Missing name or data" });

    const result = await sql`
      INSERT INTO email_templates (name, data)
      VALUES (${name}, ${JSON.stringify(data)})
      RETURNING id, name, created_at;
    `;

    res.status(201).json(result[0]);
  } catch (err) {
    console.error("Error saving template:", err);
    res.status(500).json({ error: "Failed to save template" });
  }
});

//  Get all template UUIDs + names
router.get("/templates", async (req, res) => {
  try {
    const templates = await sql`
      SELECT id, name, created_at
      FROM email_templates
      ORDER BY created_at DESC;
    `;
    res.json(templates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Get a single template by ID
router.get("/templates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const template = await sql`
      SELECT * FROM email_templates WHERE id = ${id};
    `;
    if (template.length === 0)
      return res.status(404).json({ error: "Template not found" });
    res.json(template[0]);
  } catch (err) {
    console.error("Error fetching template:", err);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

export default router;
