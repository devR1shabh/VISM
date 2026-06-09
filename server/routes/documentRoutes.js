// server/routes/documentRoutes.js

import express from "express";
import multer from "multer";

import { uploadPassport, uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/passport", upload.single("file"), uploadPassport);

router.post("/verify", upload.single("file"), uploadDocument);

export default router;