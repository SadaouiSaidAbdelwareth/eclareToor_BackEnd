import { contactModel } from "../models/contactModel.js";
import { NotificationService } from './notificationServer.js';

export const contactService = {
  async createContact(data) {
    // Validation minimal
    if (!data.full_name || !data.email || !data.message) {
      throw new Error("full_name, email and message are required");
    }

    // Insert into DB
    const contact = await contactModel.create(data);
    try {
          await NotificationService.notifyAdminsNewContact(contact);

        } catch (e) {
          console.error('❌ Notification contact échouée:', e.message);
        }
    return contact;
  },

  async getAllContacts() {
    return await contactModel.getAll();
  },

  // contactService.js
async deleteMany(ids) {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error("No IDs provided");
  }

  const deleted = [];

  for (const id of ids) {
    const item = await contactModel.delete(id);
    if (item) {
      deleted.push(item);
    }
  }

  if (deleted.length === 0) {
    throw new Error("No contact messages deleted");
  }

  return deleted;
}

};
