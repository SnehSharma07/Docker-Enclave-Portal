import { Router } from "express";

import {
  getAllContacts,
  getContactById,
  updateContact,
  updateContactStatus,
  deleteContact,
} from "../controllers/contact.controller.js";

import validate from "../middlewares/validate.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { updateContactSchema, statusSchema } from "../schemas/contact.schema.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET ALL CONTACTS
|--------------------------------------------------------------------------
*/

router.get("/contacts", getAllContacts);

/*
|--------------------------------------------------------------------------
| GET SINGLE CONTACT
|--------------------------------------------------------------------------
*/

router.get("/contacts/:id", getContactById);

/*
|--------------------------------------------------------------------------
| UPDATE CONTACT (details + optional image upload)
|--------------------------------------------------------------------------
*/

router.put(
  "/contacts/:id",
  upload.single("image"),
  validate(updateContactSchema),
  updateContact
);

/*
|--------------------------------------------------------------------------
| UPDATE CONTACT STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  "/contacts/:id/status",
  validate(statusSchema),
  updateContactStatus
);

/*
|--------------------------------------------------------------------------
| DELETE CONTACT
|--------------------------------------------------------------------------
*/

router.delete("/contacts/:id", deleteContact);

export default router;
