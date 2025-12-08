import { contactService } from "../services/contactService.js";

export const contactController = {
  async create(req, res) {
    try {
      const contact = await contactService.createContact(req.body);
      res.status(201).json({ message: "Contact message sent", data: contact });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async getAll(req, res) {
    try {
      const contacts = await contactService.getAllContacts();
      res.status(200).json({ data: contacts });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  // contactController.js
async deleteMany(req, res) {
  try {
    const ids = req.body.ids; // [id1, id2, id3]
    const deleted = await contactService.deleteMany(ids);

    res.status(200).json({
      message: "Contact messages deleted",
      count: deleted.length,
      data: deleted
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

};
