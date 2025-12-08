import { contactModel } from "../models/contactModel.js";
// import NotificationService from "../services/NotificationService.js";
// import { findAdmins } from "../helpers/findAdmins.js";  // si tu as cette fonction

export const contactService = {
  async createContact(data) {
    // Validation minimal
    if (!data.full_name || !data.email || !data.message) {
      throw new Error("full_name, email and message are required");
    }

    // Insert into DB
    const contact = await contactModel.create(data);

    // Notifications aux admins
    // try {
    //   const admins = await findAdmins();   // récupère admins (user.role = 'admin')

    //   await Promise.all(
    //     admins.map(admin =>
    //       NotificationService.notifyAdminNewContact({
    //         adminId: admin.id,
    //         fullName: contact.full_name,
    //         email: contact.email,
    //         message: contact.message
    //       })
    //     )
    //   );
    // } catch (error) {
    //   console.error("Notification contact failed:", error.message);
    // }

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
