import Contact from "../model/contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error in createContact:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    // Sort by newest first
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error in getContacts:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Unread', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedContact) return res.status(404).json({ success: false, message: "Message not found" });

    return res.status(200).json({ success: true, message: "Status updated", data: updatedContact });
  } catch (error) {
    console.error("Error in updateContactStatus:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) return res.status(404).json({ success: false, message: "Message not found" });
    
    return res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteContact:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};