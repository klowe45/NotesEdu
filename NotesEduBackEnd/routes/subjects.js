const express = require('express');
const router = express.Router();

// GET /api/subjects
router.get('/', (req, res) => {
  res.json({ message: 'Get all subjects' });
});

// GET /api/subjects/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get subject ${req.params.id}` });
});

// POST /api/subjects
router.post('/', (req, res) => {
  res.json({ message: 'Create new subject' });
});

// PUT /api/subjects/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update subject ${req.params.id}` });
});

// DELETE /api/subjects/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete subject ${req.params.id}` });
});

module.exports = router;