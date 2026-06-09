import axios from "axios";
import FormData from "form-data";

const OCR_SPACE_URL =
  "https://api.ocr.space/parse/image";

export async function extractTextFromImage(
  imageBuffer
) {
  const form = new FormData();

  form.append(
    "file",
    imageBuffer,
    {
      filename:
        "passport.jpg",
      contentType:
        "image/jpeg",
    }
  );

  form.append(
    "OCREngine",
    "2"
  );

  form.append(
    "scale",
    "true"
  );

  form.append(
    "detectOrientation",
    "true"
  );

  form.append(
    "language",
    "eng"
  );

  const response =
    await axios.post(
      OCR_SPACE_URL,
      form,
      {
        headers: {
          ...form.getHeaders(),
          apikey:
            process.env
              .OCR_SPACE_API_KEY,
        },
      }
    );

  const parsedResults =
    response.data
      ?.ParsedResults || [];

  return parsedResults
    .map(
      (item) =>
        item.ParsedText
    )
    .join("\n");
}