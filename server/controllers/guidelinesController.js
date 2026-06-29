// server/controllers/guidelinesController.js
//
// GET /api/guidelines?country=United+Kingdom&visaType=Student+Visa

import { getCountryGuidelines } from "../services/countryGuidelinesService.js";

export async function fetchGuidelines(req, res) {
  const { country, visaType } = req.query;

  if (!country || !visaType) {
    return res.status(400).json({
      error: "Both 'country' and 'visaType' query parameters are required.",
    });
  }

  try {
    const guidelines = await getCountryGuidelines(
      decodeURIComponent(country),
      decodeURIComponent(visaType)
    );
    res.json(guidelines);
  } catch (error) {
    console.error("[guidelinesController]", error);
    res.status(500).json({ error: error.message || "Failed to fetch guidelines." });
  }
}