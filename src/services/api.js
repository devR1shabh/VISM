const API_URL =
  "http://localhost:5000/api";

export async function generateAnalysis(
  visaType,
  country,
  description
) {
  const response =
    await fetch(
      `${API_URL}/analysis`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          visaType,
          country,
          description,
        }),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Failed to generate analysis"
    );
  }

  return response.json();
}