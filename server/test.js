import {
  generateVisaAnalysisAI,
} from "./services/geminiService.js";

const result =
  await generateVisaAnalysisAI(
    "Student Visa",
    "Canada",
    "Master's degree in Computer Science"
  );

console.log(result);