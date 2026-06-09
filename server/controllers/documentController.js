import {
  extractPassport,
} from "../services/passportExtractionService.js";

export async function uploadPassport(
  req,
  res
) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({
          error:
            "No file uploaded",
        });
    }

    const result =
      await extractPassport(
        req.file.buffer
      );

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Passport extraction failed",
    });
  }
}