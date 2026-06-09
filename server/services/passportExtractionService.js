import { extractTextFromImage } from "./ocrSpaceService.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const {
  parseMrz,
} = require("../utils/mrzParser.cjs");

export async function extractPassport(
  imageBuffer
) {
  try {
    const extractedText =
      await extractTextFromImage(
        imageBuffer
      );

    const mrzResult =
      parseMrz(extractedText);

    return {
      documentType:
        "Passport",

      valid:
        mrzResult.success,

      confidence:
        mrzResult.confidence,

      extractedText,

      passportData:
        mrzResult.passportData,
    };
  } catch (error) {
    console.error(
      "Passport Extraction Error:",
      error
    );

    return {
      documentType:
        "Passport",

      valid: false,

      confidence: 0,

      extractedText: "",

      passportData: {},

      error:
        error.message,
    };
  }
}