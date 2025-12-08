import { requestResponseService } from '../services/requestResponseService.js';

export const requestResponseController = {
  create: async (req, res) => {
    try {
      const adminId = req.user.userId; // admin
      const { requestId, offer } = req.body;
      const response = await requestResponseService.create(requestId, adminId, offer);
      res.status(201).json({ success: true, data: response });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const responses = await requestResponseService.getAll();
      res.json({ success: true, data: responses });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await requestResponseService.getById(id);
      res.json({ success: true, data: response });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const fields = req.body;
      const updated = await requestResponseService.update(id, fields);
      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteMany: async (req, res) => {
    try {
      const { ids } = req.body;
      const result = await requestResponseService.deleteMany(ids);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

