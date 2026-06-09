import express from "express";
import multer from "multer";

import {
  uploadPassport,
} from "../controllers/documentController.js";

const router =
  express.Router();

const upload =
  multer({
    storage:
      multer.memoryStorage(),
  });

router.post(
  "/passport",
  upload.single("file"),
  uploadPassport
);

export default router;