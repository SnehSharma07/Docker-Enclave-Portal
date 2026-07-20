import Contact from "../models/Contact.js";
import logger from "../utils/logger.js";
import { deleteImageFile } from "../middlewares/upload.middleware.js";

/**
 * @desc    Create Contact Message
 * @route   POST /api/contact
 */
export const createContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    logger.info(`New contact submitted by ${contact.email}`);

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Contacts
 * @route   GET /api/contact
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Single Contact
 * @route   GET /api/admin/contacts/:id
 */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Contact (details, status, image)
 * @route   PUT /api/admin/contacts/:id
 */
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    const { name, email, subject, message, status, removeImage } = req.body;

    if (name !== undefined) contact.name = name;
    if (email !== undefined) contact.email = email;
    if (subject !== undefined) contact.subject = subject;
    if (message !== undefined) contact.message = message;
    if (status !== undefined) contact.status = status;

    const wantsRemoval = removeImage === "true" || removeImage === true;

    // A new image was uploaded - replace the old one.
    if (req.file) {
      if (contact.image?.filename) {
        deleteImageFile(contact.image.filename);
      }

      contact.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
      };
    } else if (wantsRemoval) {
      if (contact.image?.filename) {
        deleteImageFile(contact.image.filename);
      }

      contact.image = { url: null, filename: null };
    }

    await contact.save();

    logger.info(`Contact updated : ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Contact updated successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Contact Status Only
 * @route   PATCH /api/admin/contacts/:id/status
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    logger.info(`Contact status updated to ${contact.status} : ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: `Contact marked as ${contact.status}.`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Contact
 * @route   DELETE /api/contact/:id
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    if (contact.image?.filename) {
      deleteImageFile(contact.image.filename);
    }

    logger.info(`Contact deleted : ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};