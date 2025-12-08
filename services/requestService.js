import { requestModel } from '../models/requestModel.js';
import { NotificationService } from './notificationServer.js';
import { findUserById } from '../models/userModel.js';

export const requestService = {
  create: async (userId, category, details) => {
    try {
      if (!category || !details) throw new Error("Category and details are required");

      const request = await requestModel.create(userId, category, details);

      // Notification aux admins
      const user = await findUserById(userId);
      await NotificationService.notifyAllAdmins('ADMIN_NEW_CONTACT', {
        userName: `${user.prenom} ${user.nom}`,
        category,
        requestId: request.id
      });

      return request;
    } catch (err) {
      throw new Error("Failed to create request: " + err.message);
    }
  },

  getById: async (id) => {
    try {
      if (!id) throw new Error("Request ID is required");
      const requests = await requestModel.getById(id);
      if (!requests || requests.length === 0) throw new Error("Request not found");
      return requests;
    } catch (err) {
      throw new Error("Failed to get request: " + err.message);
    }
  },

  getAll: async () => {
    try {
      return await requestModel.getAll();
    } catch (err) {
      throw new Error("Failed to get requests: " + err.message);
    }
  },

  update: async (id, fields) => {
    try {
      if (!id) throw new Error("Request ID is required");
      if (!fields || Object.keys(fields).length === 0) throw new Error("No fields to update");

      const updated = await requestModel.update(id, fields);
      if (!updated) throw new Error("Request not found or not updated");

      return updated;
    } catch (err) {
      throw new Error("Failed to update request: " + err.message);
    }
  },

  deleteMany: async (ids) => {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) throw new Error("No IDs provided");
      return await requestModel.deleteMany(ids);
    } catch (err) {
      throw new Error("Failed to delete requests: " + err.message);
    }
  }
};
