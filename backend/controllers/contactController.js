import ContactMessage from '../models/ContactMessage.js';
import { sendContactEmail } from '../services/emailService.js';

export const submitContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    const savedMessage = await contactMessage.save();

    // Trigger email notification asynchronously
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error('Failed to dispatch notification email:', emailErr.message);
      // Don't fail the API call if email notification fails, as the message is saved in MongoDB.
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been received successfully!',
      data: savedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      message.read = !message.read;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (message) {
      await message.deleteOne();
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
