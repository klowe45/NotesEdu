const express = require('express');
const router = express.Router();

// GET /api/clients
router.get('/', (req, res) => {
  res.json({ message: 'Get all clients' });
});

// GET /api/clients/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Get client ${req.params.id}` });
});

// POST /api/clients
router.post('/', (req, res) => {
  res.json({ message: 'Create new client' });
});

// PUT /api/clients/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Update client ${req.params.id}` });
});

// DELETE /api/clients/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete client ${req.params.id}` });
});

module.exports = router;