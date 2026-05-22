import express from 'express';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCertificates)
  .post(protect, adminOnly, createCertificate);

router.route('/:id')
  .put(protect, adminOnly, updateCertificate)
  .delete(protect, adminOnly, deleteCertificate);

export default router;
