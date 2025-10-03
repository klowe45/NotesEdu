const Client = require('../models/Client');

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true })
      .populate('subjects')
      .populate('createdBy', 'username email');

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('subjects')
      .populate('createdBy', 'username email');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const { firstName, lastName, grade, subjects } = req.body;

    const client = new Client({
      firstName,
      lastName,
      grade,
      subjects: subjects || [],
      createdBy: req.user.userId
    });

    await client.save();
    await client.populate('subjects');

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('subjects');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};