// src/data/packages.js
//
// Canonical package tier definitions.
// Imported by Packages.jsx, CaseForm.jsx (Feature 5), RazorpayMockModal (Feature 6),
// and the reporting dashboard (Feature 14).
//
// prices are stored in paise (INR smallest unit) for Razorpay compatibility.
// priceDisplay is the human-readable string shown in the UI.

export const PACKAGES = [
  {
    id:           "self_supported",
    name:         "Self-Supported",
    price:        0,
    priceDisplay: "Free",
    tagline:      "Everything you need to apply on your own",
    badge:        null,
    color:        "default",
    features: [
      "AI visa eligibility analysis",
      "Document checklist (9 mandatory + 6 supporting)",
      "AI-powered document verification",
      "Navi AI assistant (24/7)",
      "Readiness assessment agent",
      "PDF application summary download",
      "Email status notifications",
    ],
    notIncluded: [
      "Processor document review",
      "Priority processing queue",
      "Dedicated case officer",
      "WhatsApp support",
    ],
  },
  {
    id:           "assisted",
    name:         "Assisted",
    price:        199900,
    priceDisplay: "₹1,999",
    tagline:      "Expert review to strengthen your application",
    badge:        "Most Popular",
    color:        "featured",
    features: [
      "Everything in Self-Supported",
      "Processor reviews all your documents",
      "Flags issues before you submit",
      "Written processor remarks & guidance",
      "Priority processing queue",
      "Visa confidence score report",
    ],
    notIncluded: [
      "Dedicated case officer",
      "WhatsApp support",
    ],
  },
  {
    id:           "concierge",
    name:         "Concierge",
    price:        499900,
    priceDisplay: "₹4,999",
    tagline:      "Full-service support from start to approval",
    badge:        "Premium",
    color:        "premium",
    features: [
      "Everything in Assisted",
      "Dedicated case officer assigned",
      "Document preparation guidance",
      "WhatsApp support channel",
      "Highest priority queue",
      "Pre-submission review walkthrough",
    ],
    notIncluded: [],
  },
];

// Helper — find a package by its id string
export function getPackageById(id) {
  return PACKAGES.find((p) => p.id === id) || PACKAGES[0];
}