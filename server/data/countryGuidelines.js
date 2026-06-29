// server/data/countryGuidelines.js
//
// Static visa guidelines for the 15 most common destination countries.
// Lookup key: GUIDELINES[country][visaType]
// For any country not listed here, countryGuidelinesService falls back to Groq.
//
// Data is intentionally kept current as of 2025-2026.
// Update this file when fees or requirements change officially.

export const GUIDELINES = {

  // ── United Kingdom ──────────────────────────────────────────────────────────
  "United Kingdom": {
    "Student Visa": {
      processingTime: "3–8 weeks",
      applicationFee: "£490",
      financialRequirement: "£1,334/month for London, £1,023/month outside London (held for 28 consecutive days)",
      keyRequirements: [
        "Confirmation of Acceptance for Studies (CAS) from your university",
        "IELTS score of 6.0 or equivalent English proficiency proof",
        "Valid passport with at least 6 months remaining",
        "Proof of funds in a regulated bank for 28 consecutive days",
        "Tuberculosis test results (required for certain countries including India)",
      ],
      importantDates: [
        "Apply no earlier than 6 months before your course start date",
        "Submit at least 6–8 weeks before course start to account for biometrics",
      ],
      embassyWebsite: "https://www.gov.uk/student-visa",
      notes: "All applications must be made online via UKVI. Biometrics required at VFS Global centre. Immigration Health Surcharge (IHS) must be paid upfront.",
    },
    "Work Visa": {
      processingTime: "3–8 weeks (Skilled Worker Visa)",
      applicationFee: "£610–£1,235 depending on salary and duration",
      financialRequirement: "Minimum salary of £38,700 per year (or the going rate for your occupation, whichever is higher)",
      keyRequirements: [
        "Certificate of Sponsorship (CoS) from UK employer",
        "Job offer at or above minimum salary threshold",
        "English language proof (B1 level minimum)",
        "Valid passport",
        "Proof of maintenance funds (£1,270 held for 28 days, if not exempt)",
      ],
      importantDates: [
        "Apply up to 3 months before your intended start date",
        "Employer must hold a valid sponsor licence before issuing CoS",
      ],
      embassyWebsite: "https://www.gov.uk/skilled-worker-visa",
      notes: "Healthcare workers and education staff may qualify for lower salary thresholds. Immigration Health Surcharge applies.",
    },
    "Tourist Visa": {
      processingTime: "3–6 weeks",
      applicationFee: "£115 (Standard Visitor Visa)",
      financialRequirement: "Sufficient funds to cover your stay — no fixed amount but typically £100/day is used as a benchmark",
      keyRequirements: [
        "Valid passport",
        "Proof of accommodation (hotel bookings or host letter)",
        "Return flight tickets",
        "Bank statements for the last 3–6 months",
        "Letter from employer confirming leave and salary",
      ],
      importantDates: [
        "Apply at least 6–8 weeks before your trip",
        "Visa is valid for up to 6 months per visit",
      ],
      embassyWebsite: "https://www.gov.uk/standard-visitor-visa",
      notes: "You cannot work, study, or receive public funds on a Standard Visitor Visa. Multiple trips allowed within the validity period.",
    },
    "Business Visa": {
      processingTime: "3–6 weeks",
      applicationFee: "£115 (Standard Visitor — Business)",
      financialRequirement: "Sufficient funds to cover your stay and expenses",
      keyRequirements: [
        "Letter from your company explaining purpose of visit",
        "Invitation letter from UK business partner",
        "Valid passport",
        "Proof of business activities and financial standing",
      ],
      importantDates: [
        "Apply at least 6 weeks before your planned travel date",
      ],
      embassyWebsite: "https://www.gov.uk/standard-visitor-visa/business",
      notes: "Business activities permitted: meetings, conferences, training. Signing contracts or paid work requires a different visa.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–8 months (Indefinite Leave to Remain)",
      applicationFee: "£2,885",
      financialRequirement: "No minimum income — proof of continuous lawful residence required",
      keyRequirements: [
        "5 years continuous lawful residence in the UK (on Skilled Worker/equivalent visa)",
        "Pass the Life in the UK Test",
        "English language proof (B1 level)",
        "No absences exceeding 180 days in any 12-month period",
        "Valid passport",
      ],
      importantDates: [
        "Apply after completing 5 years of continuous qualifying residence",
        "Apply while your current visa has at least 28 days remaining",
      ],
      embassyWebsite: "https://www.gov.uk/indefinite-leave-to-remain",
      notes: "ILR allows you to live, work, and study in the UK without time restrictions. Eligible for British citizenship after 12 months of ILR.",
    },
  },

  // ── United States ───────────────────────────────────────────────────────────
  "United States": {
    "Student Visa": {
      processingTime: "2–8 weeks (F-1 Visa)",
      applicationFee: "$185 (MRV fee) + $350 SEVIS fee",
      financialRequirement: "Proof of funds sufficient for the entire duration — typically 1 year of tuition + living costs",
      keyRequirements: [
        "Form I-20 from your US institution (SEVIS)",
        "DS-160 online non-immigrant visa application",
        "SEVIS fee payment receipt",
        "Valid passport",
        "Strong ties to home country (evidence of intent to return)",
        "Financial proof — bank statements, sponsor letters",
      ],
      importantDates: [
        "Apply for F-1 visa up to 120 days before your program start date",
        "You can enter the US no earlier than 30 days before your program start",
        "SEVIS fee must be paid at least 3 days before interview",
      ],
      embassyWebsite: "https://travel.state.gov/content/travel/en/us-visas/study.html",
      notes: "Interview required at US Embassy/Consulate. Appointment wait times vary — book early. CPT/OPT work authorization available during and after studies.",
    },
    "Work Visa": {
      processingTime: "3–6 months (H-1B, lottery in April for October start)",
      applicationFee: "$730 base (H-1B) plus employer fees — total typically $3,000–$5,000",
      financialRequirement: "Employer-sponsored — salary must meet prevailing wage requirements",
      keyRequirements: [
        "Job offer from US employer willing to sponsor",
        "Employer files Form I-129 Petition for Non-immigrant Worker",
        "Bachelor's degree or equivalent in specialty occupation",
        "Selected in H-1B annual lottery (cap: 65,000 + 20,000 advanced degree)",
      ],
      importantDates: [
        "H-1B lottery registration: March each year",
        "If selected, employer files petition April–June",
        "Visa valid from 1 October (start of US fiscal year)",
      ],
      embassyWebsite: "https://travel.state.gov/content/travel/en/us-visas/employment.html",
      notes: "L-1 (intra-company transfer) and O-1 (extraordinary ability) are alternatives to H-1B. STEM OPT extension available for F-1 graduates.",
    },
    "Tourist Visa": {
      processingTime: "2–6 weeks (B-2 Visa)",
      applicationFee: "$185 (MRV fee)",
      financialRequirement: "Sufficient funds for the duration of stay — no fixed amount",
      keyRequirements: [
        "DS-160 non-immigrant visa application",
        "Valid passport",
        "Proof of ties to home country (employment, property, family)",
        "Bank statements and financial proof",
        "Return flight confirmation",
      ],
      importantDates: [
        "Interview required — book well in advance due to high demand",
        "Maximum stay: 6 months per entry (determined by CBP at port of entry)",
      ],
      embassyWebsite: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit.html",
      notes: "Indian citizens do not qualify for ESTA/Visa Waiver Program. B-2 visa allows multiple entries and can be valid for up to 10 years.",
    },
    "Business Visa": {
      processingTime: "2–6 weeks (B-1 Visa)",
      applicationFee: "$185",
      financialRequirement: "Employer/company covering expenses — proof of business purpose required",
      keyRequirements: [
        "Invitation letter from US business partner",
        "Letter from Indian employer explaining purpose",
        "Proof of business activities",
        "Valid passport and DS-160",
      ],
      importantDates: [
        "Book interview appointment well in advance",
      ],
      embassyWebsite: "https://travel.state.gov/content/travel/en/us-visas/business.html",
      notes: "B-1 for business activities; B-2 for tourism. Often issued together as B-1/B-2 visa.",
    },
    "Permanent Residency Visa": {
      processingTime: "1–10+ years depending on country of birth and category",
      applicationFee: "$1,440 (Form I-485 adjustment of status) or $325 (consular processing)",
      financialRequirement: "Sponsor's income must be at least 125% of the Federal Poverty Level",
      keyRequirements: [
        "Valid immigrant visa petition (I-140 for employment, I-130 for family)",
        "Priority date must be current in the Visa Bulletin",
        "Medical examination (Form I-693)",
        "Affidavit of Support from sponsor",
        "Background check and biometrics",
      ],
      importantDates: [
        "Check the monthly Visa Bulletin for priority date cutoffs",
        "EB-2 and EB-3 wait times for India-born applicants: 10–50+ years due to backlog",
      ],
      embassyWebsite: "https://www.uscis.gov/green-card",
      notes: "Green card holders can live and work permanently in the US. Eligible for citizenship after 5 years (3 years if married to US citizen).",
    },
  },

  // ── Canada ──────────────────────────────────────────────────────────────────
  "Canada": {
    "Student Visa": {
      processingTime: "4–12 weeks (Study Permit)",
      applicationFee: "CAD $150",
      financialRequirement: "Tuition fees + CAD $10,000/year for living costs (CAD $11,000 for Quebec)",
      keyRequirements: [
        "Letter of Acceptance from Designated Learning Institution (DLI)",
        "Proof of financial support for tuition and living expenses",
        "Valid passport",
        "English/French proficiency proof (IELTS, TOEFL, etc.)",
        "Statement of Purpose explaining study plans",
        "Immigration medical examination (if required)",
      ],
      importantDates: [
        "Apply as early as possible — at least 3 months before program start",
        "Student Direct Stream (SDS) available for faster processing (2–3 weeks) for Indian students",
      ],
      embassyWebsite: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada.html",
      notes: "Post-Graduation Work Permit (PGWP) allows work in Canada after graduation. SDS is strongly recommended for Indian students applying from India.",
    },
    "Work Visa": {
      processingTime: "2–27 weeks depending on stream",
      applicationFee: "CAD $155 (open work permit) + employer compliance fee",
      financialRequirement: "Salary as per LMIA or Express Entry requirements",
      keyRequirements: [
        "Job offer from Canadian employer OR Express Entry profile (no job offer needed for some streams)",
        "Labour Market Impact Assessment (LMIA) from employer in most cases",
        "Educational credentials and work experience documentation",
        "Language proficiency (IELTS CLB 7+ for most NOCs)",
      ],
      importantDates: [
        "Express Entry draws happen bi-weekly — track CRS score cutoffs",
        "Provincial Nominee Programs (PNP) have their own intake dates",
      ],
      embassyWebsite: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html",
      notes: "Express Entry (CRS score system) is the fastest pathway. International Experience Canada (IEC) available for ages 18–35.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Visitor Visa / eTA not applicable for Indian passport)",
      applicationFee: "CAD $100 (single entry) or CAD $500 (multiple entry)",
      financialRequirement: "Approximately CAD $100/day of stay — proof of funds required",
      keyRequirements: [
        "Valid passport",
        "Proof of ties to home country",
        "Bank statements for 3–6 months",
        "Travel itinerary and hotel bookings",
        "Travel insurance (recommended)",
        "Employment letter and leave approval",
      ],
      importantDates: [
        "Apply at least 8 weeks before travel date",
        "Multiple-entry visa typically valid for 10 years or passport expiry",
      ],
      embassyWebsite: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
      notes: "Indian citizens require a visitor visa — eTA does not apply. Multiple-entry visa strongly recommended for flexibility.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "CAD $100",
      financialRequirement: "Business trip expenses covered by employer/company",
      keyRequirements: [
        "Invitation letter from Canadian business host",
        "Letter from Indian employer",
        "Business registration proof",
        "Valid passport and financial documents",
      ],
      importantDates: ["Apply at least 6 weeks before your travel date"],
      embassyWebsite: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
      notes: "Business activities allowed: meetings, conferences, trade shows. No direct employment or paid work permitted.",
    },
    "Permanent Residency Visa": {
      processingTime: "6 months (Express Entry) to 2 years (PNP/Family)",
      applicationFee: "CAD $1,325 (principal applicant) + CAD $1,325 (spouse) + CAD $225 (per child)",
      financialRequirement: "Settlement funds: CAD $13,757 for single applicant (higher for families)",
      keyRequirements: [
        "Express Entry CRS score above current draw cutoff",
        "CLB 7+ English proficiency (IELTS or CELPIP)",
        "Minimum 1 year skilled work experience (NOC TEER 0, 1, 2, or 3)",
        "Educational Credential Assessment (ECA)",
        "Police clearance from all countries of residence",
        "Medical examination",
      ],
      importantDates: [
        "Express Entry draws happen approximately every 2 weeks",
        "ITA (Invitation to Apply) must be responded to within 60 days",
      ],
      embassyWebsite: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html",
      notes: "Canada is one of the most accessible PR pathways globally. Provincial Nominee Programs (PNPs) can fast-track the process for specific provinces.",
    },
  },

  // ── Australia ───────────────────────────────────────────────────────────────
  "Australia": {
    "Student Visa": {
      processingTime: "4–8 weeks (Subclass 500)",
      applicationFee: "AUD $710",
      financialRequirement: "AUD $24,505/year (tuition) + AUD $21,041/year living costs (2024 Genuine Student threshold)",
      keyRequirements: [
        "Confirmation of Enrolment (CoE) from registered Australian institution",
        "Genuine Student (GS) requirement — written statement of purpose",
        "English proficiency: IELTS 6.0+ or equivalent",
        "Overseas Student Health Cover (OSHC) for duration of study",
        "Financial capacity evidence",
        "Valid passport",
      ],
      importantDates: [
        "Apply as soon as you receive your CoE",
        "GS requirement replaces old GTE — ensure statement is detailed and honest",
      ],
      embassyWebsite: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500",
      notes: "Post-study work rights: 2–4 years depending on study level and location. Biometrics may be required.",
    },
    "Work Visa": {
      processingTime: "2–8 weeks (Temporary Skill Shortage — Subclass 482)",
      applicationFee: "AUD $3,115 (primary applicant)",
      financialRequirement: "Minimum salary: AUD $73,150 (Temporary Skilled Migration Income Threshold, 2024)",
      keyRequirements: [
        "Employer must be an approved sponsor",
        "Occupation must be on relevant skilled occupation list",
        "At least 2 years relevant work experience",
        "English proficiency proof",
        "Skills assessment (for some occupations)",
      ],
      importantDates: [
        "Employer must hold sponsorship approval before nominating you",
      ],
      embassyWebsite: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482",
      notes: "Pathway to Employer Nomination Scheme (Subclass 186) for permanent residence after 2–3 years.",
    },
    "Tourist Visa": {
      processingTime: "1–4 weeks (Visitor Visa — Subclass 600)",
      applicationFee: "AUD $190",
      financialRequirement: "Approximately AUD $5,000 for short stays — demonstrated funds required",
      keyRequirements: [
        "Valid passport",
        "Proof of financial means",
        "Return flight bookings",
        "Evidence of ties to home country",
        "Travel health insurance (strongly recommended)",
      ],
      importantDates: [
        "Apply at least 6–8 weeks before travel",
        "Maximum stay: 3 months per visit (6 months with sponsor)",
      ],
      embassyWebsite: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600",
      notes: "Biometrics may be required. Multiple entry available. Cannot work on a tourist visa.",
    },
    "Business Visa": {
      processingTime: "1–4 weeks",
      applicationFee: "AUD $190",
      financialRequirement: "Business expenses covered by company/employer",
      keyRequirements: [
        "Invitation letter from Australian business",
        "Evidence of business activities",
        "Valid passport and financial documents",
      ],
      importantDates: ["Apply at least 6 weeks before travel"],
      embassyWebsite: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600/business-visitor-stream",
      notes: "Business visitor stream of the Visitor Visa. Permitted: meetings, conferences, exploring business opportunities.",
    },
    "Permanent Residency Visa": {
      processingTime: "8–18 months (Skilled Independent — Subclass 189)",
      applicationFee: "AUD $4,640 (primary applicant)",
      financialRequirement: "No minimum funds — but demonstrated settlement capacity expected",
      keyRequirements: [
        "Points score of 65 or more in SkillSelect EOI",
        "Occupation on the Medium and Long-term Strategic Skills List (MLTSSL)",
        "Skills assessment from relevant authority",
        "IELTS 6.0+ (Competent English minimum)",
        "Under 45 years of age at time of invitation",
        "Health and character checks",
      ],
      importantDates: [
        "Submit Expression of Interest (EOI) through SkillSelect",
        "Invitations issued monthly — score cutoffs vary",
      ],
      embassyWebsite: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189",
      notes: "State nomination (Subclass 190) adds 5 extra points and has different occupation lists. Regional visas (Subclass 491) also available.",
    },
  },

  // ── Germany ─────────────────────────────────────────────────────────────────
  "Germany": {
    "Student Visa": {
      processingTime: "4–12 weeks",
      applicationFee: "€75",
      financialRequirement: "€11,208/year (€934/month) — typically shown via blocked account",
      keyRequirements: [
        "Admission letter from German university",
        "Blocked account (Sperrkonto) with €11,208",
        "Health insurance proof",
        "German or English proficiency (depending on course language)",
        "Motivation letter",
        "Valid passport",
      ],
      importantDates: [
        "Apply at least 3 months before semester start",
        "German universities have two intakes: Winter (October) and Summer (April)",
      ],
      embassyWebsite: "https://www.make-it-in-germany.com/en/visa-residence/types/students",
      notes: "Students can work 120 full or 240 half days per year. Fintiba and Expatrio offer blocked account services. Many top universities are tuition-free.",
    },
    "Work Visa": {
      processingTime: "4–12 weeks",
      applicationFee: "€75",
      financialRequirement: "Salary as per German collective agreements — minimum €43,800/year for skilled workers (2024)",
      keyRequirements: [
        "Recognised German or equivalent foreign qualification",
        "Job offer from German employer",
        "Qualification recognition (Anerkennung) certificate if required",
        "German language skills (B1 recommended; not always required for specialists)",
        "Health insurance",
      ],
      importantDates: [
        "Opportunity Card (Chancenkarte) now allows job-seeking for up to 1 year",
        "EU Blue Card for high earners: minimum €48,300/year",
      ],
      embassyWebsite: "https://www.make-it-in-germany.com/en/visa-residence/types/work",
      notes: "Germany has significant skilled worker shortages — processing is prioritized. Skilled Immigration Act (2023) expanded eligible qualifications.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen Visa)",
      applicationFee: "€80",
      financialRequirement: "€45–€50/day of stay",
      keyRequirements: [
        "Valid passport (at least 3 months beyond return date)",
        "Travel insurance with €30,000 minimum cover for Schengen area",
        "Return flight bookings",
        "Hotel/accommodation bookings",
        "Bank statements for 3 months",
        "Employment proof and leave letter",
      ],
      importantDates: [
        "Apply no earlier than 6 months and no later than 15 days before travel",
        "Schengen visa allows 90 days in 180-day period across all Schengen states",
      ],
      embassyWebsite: "https://germany.diplo.de/in-en/visa-service",
      notes: "German Schengen visa is valid for travel across all 27 Schengen countries. Appointment booking can take 4–6 weeks during peak season.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Expenses covered by company — invitation letter required",
      keyRequirements: [
        "Invitation letter from German company",
        "Business registration documents",
        "Travel insurance",
        "Valid passport and financial proof",
      ],
      importantDates: ["Apply at least 4 weeks before travel"],
      embassyWebsite: "https://germany.diplo.de/in-en/visa-service",
      notes: "Permitted: meetings, trade fairs, contract signings. Stay up to 90 days in 180-day period.",
    },
    "Permanent Residency Visa": {
      processingTime: "1–3 months after eligibility (Settlement Permit — Niederlassungserlaubnis)",
      applicationFee: "€113",
      financialRequirement: "Sufficient income to support yourself (approx. €1,500+/month net)",
      keyRequirements: [
        "5 years of legal residence in Germany (33 months for EU Blue Card holders)",
        "Adequate German language skills (B1 level minimum)",
        "Sufficient pension contributions",
        "No criminal record",
        "Adequate housing",
      ],
      importantDates: [
        "Apply at your local Ausländerbehörde (immigration office) before current visa expires",
      ],
      embassyWebsite: "https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Migrathek/Niederlassung/niederlassung-node.html",
      notes: "EU Blue Card holders can apply for settlement after just 21–33 months. German citizenship possible after 8 years of residence (5 years for special cases).",
    },
  },

  // ── UAE ─────────────────────────────────────────────────────────────────────
  "UAE": {
    "Student Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "AED 1,000–3,000 depending on institution",
      financialRequirement: "Tuition fees + AED 3,000–5,000/month for living expenses",
      keyRequirements: [
        "Admission letter from UAE-accredited institution",
        "Valid passport (6 months validity)",
        "Passport-size photos",
        "Medical fitness certificate and Emirates ID application",
        "Sponsor (usually the institution) requirement",
      ],
      importantDates: [
        "Apply at least 2 months before course start",
        "Student visa must be renewed annually",
      ],
      embassyWebsite: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/student-residence-visa",
      notes: "UAE student visa is typically sponsored by your educational institution. No separate student work permit — limited work allowed under student visa.",
    },
    "Work Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "AED 2,000–5,000 (employer typically covers)",
      financialRequirement: "No minimum salary requirement — but employment contract required",
      keyRequirements: [
        "Employment offer from UAE employer",
        "Employer initiates visa process through UAE immigration (MOHRE)",
        "Valid passport",
        "Medical fitness test",
        "Emirates ID registration",
        "Educational certificate attestation",
      ],
      importantDates: [
        "Visa must be stamped within 30 days of entry permit",
        "Typically 2-year residence visa renewable",
      ],
      embassyWebsite: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/employment-residence-visa",
      notes: "Golden Visa (10-year) available for professionals earning AED 30,000+/month and specialists in priority sectors. All documents must be attested.",
    },
    "Tourist Visa": {
      processingTime: "24–72 hours",
      applicationFee: "AED 300–600 (30-day single entry)",
      financialRequirement: "Approximately AED 400/day — no fixed requirement",
      keyRequirements: [
        "Valid passport (6 months validity)",
        "Return flight tickets",
        "Hotel bookings or host details",
        "Bank statement showing sufficient funds",
        "Passport photos",
      ],
      importantDates: [
        "Visa-on-arrival available for Indian passport holders with US/UK/EU/Australia/Canada visa",
        "30-day tourist visa extendable once",
      ],
      embassyWebsite: "https://u.ae/en/information-and-services/visa-and-emirates-id/do-you-need-entry-visa",
      notes: "Indian nationals holding valid US, UK, EU, Australian, or Canadian visas can get visa on arrival (14 days, extendable). Otherwise apply online through Emirates or other airlines.",
    },
    "Business Visa": {
      processingTime: "24–72 hours",
      applicationFee: "AED 300–600",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation letter from UAE company",
        "Company registration documents",
        "Valid passport",
      ],
      importantDates: ["Extendable if needed"],
      embassyWebsite: "https://u.ae/en/information-and-services/visa-and-emirates-id",
      notes: "UAE is very business-friendly with fast processing. Free Zone companies can also sponsor business visitors.",
    },
    "Permanent Residency Visa": {
      processingTime: "2–4 weeks (Golden Visa — 10 years)",
      applicationFee: "AED 2,800–4,000",
      financialRequirement: "Depends on category — investors need AED 2M+ in property or business",
      keyRequirements: [
        "Eligibility: investors, entrepreneurs, specialists (doctors, engineers, scientists), talented individuals, top students",
        "Property investment of AED 2M+ (for investor category)",
        "OR employment in a specialty earning AED 30,000+/month",
        "OR outstanding academic achievement",
        "Valid passport",
      ],
      importantDates: [
        "Apply through relevant authority (GDRFA Dubai or ICP for other emirates)",
      ],
      embassyWebsite: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
      notes: "UAE Golden Visa provides 10-year renewable residency. No requirement to physically live in UAE to maintain the visa.",
    },
  },

  // ── Singapore ───────────────────────────────────────────────────────────────
  "Singapore": {
    "Student Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "SGD $30 (Student's Pass)",
      financialRequirement: "Tuition fees + SGD $1,500–$2,500/month for living expenses",
      keyRequirements: [
        "In-Principal Approval (IPA) letter from Singapore institution",
        "SOLAR application through institution",
        "Valid passport",
        "Financial proof",
        "Academic transcripts",
      ],
      importantDates: [
        "Institution submits SOLAR application on your behalf",
        "Report to ICA within 2 weeks of IPA collection",
      ],
      embassyWebsite: "https://www.ica.gov.sg/reside/STP/apply",
      notes: "Students can work 16 hours/week during term time and full-time during vacations. Singapore universities have globally recognized rankings.",
    },
    "Work Visa": {
      processingTime: "3–8 weeks (Employment Pass)",
      applicationFee: "SGD $105 (application) + SGD $225 (issuance)",
      financialRequirement: "Minimum salary: SGD $5,000/month for Employment Pass (SGD $5,500 for financial services sector)",
      keyRequirements: [
        "Job offer from Singapore employer",
        "Degree from recognised university",
        "Minimum salary threshold met",
        "Employer submits EP application through MOM",
        "COMPASS framework score (for new applications)",
      ],
      importantDates: [
        "COMPASS (Complementarity Assessment Framework) applies to all new EP applications from September 2023",
      ],
      embassyWebsite: "https://www.mom.gov.sg/passes-and-permits/employment-pass",
      notes: "S Pass for mid-skilled workers (min. SGD $3,150). Levy applies to S Pass holders. Fair Consideration Framework — employer must advertise job locally first.",
    },
    "Tourist Visa": {
      processingTime: "1–3 days",
      applicationFee: "SGD $30",
      financialRequirement: "Approximately SGD $100/day — bank statement required",
      keyRequirements: [
        "Valid passport",
        "Return flight tickets",
        "Hotel bookings",
        "Financial proof",
        "Yellow fever certificate (if arriving from endemic country)",
      ],
      importantDates: [
        "Apply online up to 30 days before arrival",
        "Visa valid 30 days from entry; can be extended once",
      ],
      embassyWebsite: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore",
      notes: "Indian passport holders require a visa. Social visit pass usually granted for 30 days on arrival once visa is approved.",
    },
    "Business Visa": {
      processingTime: "1–3 days",
      applicationFee: "SGD $30",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation letter from Singapore company",
        "Business registration documents",
        "Valid passport",
      ],
      importantDates: ["Apply at least 1 week before travel"],
      embassyWebsite: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore",
      notes: "Business activities: meetings, conferences, exploring partnerships. Fast processing makes Singapore attractive for business visits.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–12 months",
      applicationFee: "SGD $100",
      financialRequirement: "No minimum income — based on overall contribution assessment",
      keyRequirements: [
        "Minimum 6 months continuous employment in Singapore on EP/S Pass",
        "Good track record of tax compliance",
        "Age, educational qualifications, economic contributions considered",
        "Family ties to Singapore citizens/PRs considered",
      ],
      importantDates: [
        "No fixed application windows — apply anytime via e-PR portal",
      ],
      embassyWebsite: "https://www.ica.gov.sg/reside/pr/apply",
      notes: "Singapore PR is highly competitive. Strong employment history and tax contributions significantly improve chances. ICA does not give reasons for rejection.",
    },
  },

  // ── Ireland ─────────────────────────────────────────────────────────────────
  "Ireland": {
    "Student Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "€60 (single journey) or €100 (multi-journey)",
      financialRequirement: "€7,000–€10,000/year for living costs + tuition fees",
      keyRequirements: [
        "Offer letter from registered Irish institution",
        "Proof of funds (own funds or sponsor)",
        "English proficiency proof",
        "Travel insurance",
        "Valid passport",
      ],
      importantDates: [
        "Apply at least 8 weeks before intended travel",
        "Register with GNIB/IRP within 90 days of arrival for stays over 3 months",
      ],
      embassyWebsite: "https://www.irishimmigration.ie/coming-to-study-in-ireland/",
      notes: "Post-study stay right of 12–24 months available. Ireland is English-speaking with a strong tech sector — popular for Indian students.",
    },
    "Work Visa": {
      processingTime: "4–12 weeks (Critical Skills Employment Permit)",
      applicationFee: "€1,000 (2-year permit)",
      financialRequirement: "Minimum salary: €38,000/year (Critical Skills) or €30,000/year (General Employment Permit)",
      keyRequirements: [
        "Job offer from Irish employer",
        "Occupation on Critical Skills or eligible occupations list",
        "Degree qualification relevant to the role",
        "Employer registered with DETE",
      ],
      importantDates: [
        "Critical Skills Permit holders can apply for PR after 2 years",
        "Immediate family reunification available for Critical Skills holders",
      ],
      embassyWebsite: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/",
      notes: "Ireland has booming tech and pharma sectors. Critical Skills Permit (for high-demand roles) is the fastest pathway to PR.",
    },
    "Tourist Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "€60 (single entry) or €100 (multiple entry)",
      financialRequirement: "€50/day minimum — bank statements required",
      keyRequirements: [
        "Valid passport",
        "Return flight tickets",
        "Proof of accommodation",
        "Bank statements for 6 months",
        "Employment letter and leave approval",
        "Travel insurance",
      ],
      importantDates: [
        "Apply at least 8 weeks before travel",
        "Ireland is NOT in the Schengen Area — separate visa required",
      ],
      embassyWebsite: "https://www.irishimmigration.ie/coming-to-visit-ireland/",
      notes: "Ireland and the UK have a Common Travel Area (CTA) — a UK visa does not automatically cover Ireland and vice versa.",
    },
    "Business Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "€60–€100",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation letter from Irish company",
        "Proof of business purpose",
        "Valid passport and financial documents",
      ],
      importantDates: ["Apply at least 8 weeks before travel"],
      embassyWebsite: "https://www.irishimmigration.ie/coming-to-visit-ireland/",
      notes: "Ireland hosts European HQs of many US tech companies — popular destination for business travel.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–12 months",
      applicationFee: "€500",
      financialRequirement: "Demonstrated ability to support oneself in Ireland",
      keyRequirements: [
        "5 years of lawful continuous residence in Ireland",
        "Valid immigration stamp (Stamp 1, 4, etc.) throughout",
        "No criminal record",
        "Good character references",
      ],
      importantDates: [
        "Apply 3–4 months before your current permission expires",
      ],
      embassyWebsite: "https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/long-term-residency/",
      notes: "After 5 years PR, eligible to apply for Irish citizenship (naturalisation). Ireland allows dual citizenship.",
    },
  },

  // ── France ──────────────────────────────────────────────────────────────────
  "France": {
    "Student Visa": {
      processingTime: "3–6 weeks",
      applicationFee: "€99",
      financialRequirement: "€615/month minimum (approx. €7,380/year)",
      keyRequirements: [
        "Admission letter from French institution",
        "Campus France registration and interview (mandatory for Indian students)",
        "Proof of financial resources",
        "Health insurance",
        "Accommodation proof",
        "Valid passport",
      ],
      importantDates: [
        "Campus France procedure is mandatory for Indian applicants — start 3–4 months early",
        "French universities: September intake (applications Dec–March) and January/February intake",
      ],
      embassyWebsite: "https://www.campusfrance.org/en",
      notes: "Campus France (VFS Global process) is mandatory for Indian students. Many top universities offer programs in English. Post-study APS permit allows 12 months job-seeking.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen)",
      applicationFee: "€80",
      financialRequirement: "€65/day in France",
      keyRequirements: [
        "Valid passport",
        "Schengen travel insurance (€30,000 min coverage)",
        "Return flight tickets",
        "Accommodation bookings",
        "Bank statements (3 months)",
        "Employment letter",
      ],
      importantDates: [
        "Apply at least 15 days before travel (max 6 months before)",
        "90 days in 180-day period across Schengen",
      ],
      embassyWebsite: "https://france-visas.gouv.fr",
      notes: "French Schengen visa covers all Schengen countries. Paris is one of the most visited cities globally — book VFS appointments early.",
    },
    "Work Visa": {
      processingTime: "2–3 months",
      applicationFee: "€99 plus OFII tax (employer usually covers)",
      financialRequirement: "Minimum wage (SMIC): €1,767 gross/month (2024)",
      keyRequirements: [
        "Work contract from French employer",
        "Employer approval from DREETS (regional employment authority)",
        "Qualification recognition",
        "French language skills (B1+ for most roles)",
      ],
      importantDates: ["Process starts with employer work permit application"],
      embassyWebsite: "https://france-visas.gouv.fr/en_US/web/france-visas/work-visa",
      notes: "Tech Visa (French Tech Visa) is available for startup founders and tech employees — faster processing of 2 weeks.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation from French company",
        "Proof of business purpose",
        "Valid passport and insurance",
      ],
      importantDates: ["Apply at least 3 weeks before travel"],
      embassyWebsite: "https://france-visas.gouv.fr",
      notes: "Schengen business visa — valid for all Schengen states.",
    },
    "Permanent Residency Visa": {
      processingTime: "3–6 months",
      applicationFee: "€200–€400",
      financialRequirement: "Stable income (at least SMIC level)",
      keyRequirements: [
        "5 years of legal residence in France",
        "French language proficiency (A2 minimum, B1 recommended)",
        "Integration into French society",
        "No serious criminal record",
      ],
      importantDates: ["Apply at the prefecture while your current permit is still valid"],
      embassyWebsite: "https://www.service-public.fr/particuliers/vosdroits/F2212",
      notes: "10-year resident card (carte de résident) grants the right to work and live in France without annual renewal. Leads to French nationality after 5 years.",
    },
  },

  // ── New Zealand ─────────────────────────────────────────────────────────────
  "New Zealand": {
    "Student Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "NZD $375",
      financialRequirement: "NZD $15,000/year (approx.) for living costs + tuition",
      keyRequirements: [
        "Offer of place from New Zealand institution",
        "Proof of funds for tuition and living",
        "Health and character certificates",
        "Travel and medical insurance",
        "Valid passport",
      ],
      importantDates: ["Apply at least 2–3 months before course start"],
      embassyWebsite: "https://www.immigration.govt.nz/new-zealand-visas/options/study",
      notes: "Students can work 20 hours/week during term. Post-study work visa (1–3 years) available. Pathway to residence via Skilled Migrant Category.",
    },
    "Tourist Visa": {
      processingTime: "5–15 working days",
      applicationFee: "NZD $211",
      financialRequirement: "NZD $1,000/month of stay",
      keyRequirements: [
        "Valid passport",
        "Return flights",
        "Proof of funds",
        "Accommodation details",
        "Good health and character",
      ],
      importantDates: ["Apply at least 6 weeks before travel"],
      embassyWebsite: "https://www.immigration.govt.nz/new-zealand-visas/options/visit",
      notes: "Visitor visa allows up to 9 months. Cannot work or study. eVisa system — apply online.",
    },
    "Work Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "NZD $495",
      financialRequirement: "Salary at or above NZD median wage (NZD $29.66/hour in 2024)",
      keyRequirements: [
        "Job offer from New Zealand employer (for employer-assisted visa)",
        "Skills and qualifications relevant to role",
        "Health and police clearance",
      ],
      importantDates: ["Check Accredited Employer Work Visa (AEWV) requirements"],
      embassyWebsite: "https://www.immigration.govt.nz/new-zealand-visas/options/work",
      notes: "Accredited Employer Work Visa (AEWV) requires employer to be accredited. Skilled Migrant Category for pathway to residence.",
    },
    "Business Visa": {
      processingTime: "5–15 working days",
      applicationFee: "NZD $211",
      financialRequirement: "Business expenses covered",
      keyRequirements: ["Invitation from NZ company", "Valid passport", "Proof of business purpose"],
      importantDates: ["Apply at least 6 weeks before travel"],
      embassyWebsite: "https://www.immigration.govt.nz/new-zealand-visas/options/visit",
      notes: "Visitor visa with business purpose. Meetings and conferences permitted.",
    },
    "Permanent Residency Visa": {
      processingTime: "12–18 months (Skilled Migrant Category)",
      applicationFee: "NZD $3,190",
      financialRequirement: "No minimum income — points-based assessment",
      keyRequirements: [
        "Expression of Interest (EOI) meeting 160+ points threshold",
        "Skilled employment in NZ or overseas",
        "Qualifications and work experience",
        "Age under 56 years",
        "Health and police clearance",
      ],
      importantDates: ["EOI ballots are drawn every 2 weeks"],
      embassyWebsite: "https://www.immigration.govt.nz/new-zealand-visas/options/live-permanently",
      notes: "NZ residence is a step toward citizenship (after 5 years). Pathway also available through partnership or family sponsorship.",
    },
  },

  // ── Netherlands ─────────────────────────────────────────────────────────────
  "Netherlands": {
    "Student Visa": {
      processingTime: "4–8 weeks (MVV + Residence Permit)",
      applicationFee: "€207",
      financialRequirement: "€900/month for living costs (€10,800/year)",
      keyRequirements: [
        "Admission letter from Dutch institution (which sponsors the visa)",
        "Proof of financial means (usually verified by institution)",
        "Valid passport",
        "TB test (required for Indian applicants)",
        "Health insurance",
      ],
      importantDates: [
        "Institution submits IND application on your behalf",
        "Collect residence permit within 3 days of arrival",
      ],
      embassyWebsite: "https://www.government.nl/topics/residence-permit/study-in-the-netherlands",
      notes: "Most Dutch master's programs are in English. Orientation Year permit allows 1 year of job-seeking after graduation.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen)",
      applicationFee: "€80",
      financialRequirement: "€34/day + accommodation costs",
      keyRequirements: [
        "Valid passport",
        "Schengen travel insurance",
        "Return flights and accommodation",
        "Bank statements",
        "Employment letter",
      ],
      importantDates: ["Apply no earlier than 6 months before travel"],
      embassyWebsite: "https://www.netherlandsandyou.nl/your-country-and-the-netherlands/india/you-in-the-netherlands/visas-for-the-netherlands",
      notes: "Netherlands Schengen visa valid across all Schengen area. Amsterdam is a major tourism hub — book VFS early.",
    },
    "Work Visa": {
      processingTime: "2–5 weeks (Highly Skilled Migrant)",
      applicationFee: "€207",
      financialRequirement: "Minimum gross salary: €5,008/month (2024, under 30) or €6,245/month (30+)",
      keyRequirements: [
        "Recognized sponsor (employer must be IND-recognized)",
        "Employment contract meeting salary threshold",
        "Valid passport",
      ],
      importantDates: ["Employer applies to IND for recognition before sponsoring"],
      embassyWebsite: "https://ind.nl/en/work/working_in_the_Netherlands",
      notes: "Highly Skilled Migrant visa (Kennismigrant) is fastest work visa — processed in 2 weeks by IND. 30% tax ruling benefit for the first 5 years.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation from Dutch company",
        "Proof of business activities",
        "Valid passport and Schengen insurance",
      ],
      importantDates: ["Apply at least 4 weeks before travel"],
      embassyWebsite: "https://www.netherlandsandyou.nl",
      notes: "Schengen business visa — valid across all Schengen countries.",
    },
    "Permanent Residency Visa": {
      processingTime: "3–6 months",
      applicationFee: "€207",
      financialRequirement: "Stable income (at or above social assistance level)",
      keyRequirements: [
        "5 years of continuous legal residence",
        "Dutch language proficiency (A2 level, civic integration exam)",
        "Sufficient income",
        "No serious criminal record",
      ],
      importantDates: ["Apply before current permit expires"],
      embassyWebsite: "https://ind.nl/en/residence-permit-permanent",
      notes: "Dutch permanent residence (verblijfsvergunning voor onbepaalde tijd) grants indefinite stay and work rights. Eligible for Dutch citizenship after 5 years.",
    },
  },

  // ── Japan ───────────────────────────────────────────────────────────────────
  "Japan": {
    "Student Visa": {
      processingTime: "3–6 months (Certificate of Eligibility + visa)",
      applicationFee: "¥3,000 (approximately)",
      financialRequirement: "¥200,000–¥300,000/month for living costs + tuition",
      keyRequirements: [
        "Certificate of Eligibility (CoE) issued by Japanese institution via JISCO",
        "Acceptance letter from Japanese school/university",
        "Proof of financial support",
        "Valid passport",
        "Japanese language proficiency (N4–N2 for language schools; English programs available at some universities)",
      ],
      importantDates: [
        "CoE application is submitted to immigration 3–5 months before intake",
        "Japanese universities: April intake (applications September–November) and October intake",
      ],
      embassyWebsite: "https://www.mofa.go.jp/j_info/visit/visa/long/visa6.html",
      notes: "Japan is rapidly opening to international students. JLPT N2 or higher greatly improves employment prospects. Students can work 28 hours/week.",
    },
    "Tourist Visa": {
      processingTime: "3–5 working days",
      applicationFee: "₹540 (approximately) for single entry",
      financialRequirement: "Approximately ¥10,000/day",
      keyRequirements: [
        "Valid passport",
        "Return flight tickets",
        "Accommodation proof",
        "Bank statements",
        "Proof of employment and income",
        "Detailed travel itinerary",
      ],
      importantDates: [
        "Apply 3–4 weeks before travel through Japan Embassy",
        "Visa valid for 15 or 30 days",
      ],
      embassyWebsite: "https://www.in.emb-japan.go.jp/itpr_en/visa.html",
      notes: "Japan is easing visa requirements for Indian tourists. Multiple-entry tourist visa introduced. Book early during peak seasons (cherry blossom: March–April; autumn: October–November).",
    },
    "Work Visa": {
      processingTime: "1–3 months",
      applicationFee: "¥6,000 (for single entry stamp)",
      financialRequirement: "Salary as per industry standards — no fixed minimum for most categories",
      keyRequirements: [
        "Certificate of Eligibility from Japanese employer",
        "Employment contract",
        "Relevant academic qualifications and work experience",
        "Japanese language skills (N3–N1 for most roles; English OK for some tech jobs)",
      ],
      importantDates: [
        "Certificate of Eligibility process takes 1–3 months",
        "Specified Skilled Worker (SSW) program for specific industries — no Japanese degree required",
      ],
      embassyWebsite: "https://www.moj.go.jp/isa/index.html",
      notes: "Japan is actively recruiting foreign workers. Highly Skilled Professional (HSP) visa for points-based candidates offers priority processing and longer stays.",
    },
    "Business Visa": {
      processingTime: "3–5 working days",
      applicationFee: "¥3,000",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation letter from Japanese company",
        "Business registration proof",
        "Valid passport",
      ],
      importantDates: ["Apply at least 2–3 weeks before travel"],
      embassyWebsite: "https://www.in.emb-japan.go.jp/itpr_en/visa.html",
      notes: "Temporary Visitor visa for business: up to 90 days. Japan is cautious about business activities — ensure invitation letter is detailed.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–12 months",
      applicationFee: "¥8,000",
      financialRequirement: "Stable income; tax compliance; no social welfare dependence",
      keyRequirements: [
        "10 years of continuous residence (can be reduced to 5 years for Highly Skilled Professionals)",
        "Good conduct and no criminal record",
        "Financial stability",
        "National health insurance and pension contributions",
        "Japanese language skills (not officially required but expected)",
      ],
      importantDates: ["Apply at your regional immigration office"],
      embassyWebsite: "https://www.moj.go.jp/isa/applications/procedures/16-4.html",
      notes: "Japan permanent residency has no expiry. Highly Skilled Professional (HSP) visa holders with 80+ points can apply after just 1–3 years.",
    },
  },

  // ── Sweden ──────────────────────────────────────────────────────────────────
  "Sweden": {
    "Student Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "SEK 1,000 (approx. ₹7,800)",
      financialRequirement: "SEK 8,514/month (2024) for living costs + tuition (most programs free for EU students, but international students pay €7,000–€30,000/year)",
      keyRequirements: [
        "Admission letter from Swedish university",
        "Proof of funds for living costs",
        "Valid passport",
        "Health insurance",
        "Residence permit applied before arrival (not a visa stamp)",
      ],
      importantDates: [
        "Apply as early as possible — residence permit, not Schengen visa",
        "Swedish universities use Antagning.se for applications (January 15 deadline for autumn intake)",
      ],
      embassyWebsite: "https://www.migrationsverket.se/en/Private-individuals/Studying-in-Sweden.html",
      notes: "Sweden has no tuition fees for PhD programs. Strong tech ecosystem (Spotify, Klarna, Ericsson). Post-study work permit: 12 months.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen)",
      applicationFee: "€80",
      financialRequirement: "€45/day of stay",
      keyRequirements: [
        "Valid passport",
        "Schengen travel insurance",
        "Return flights and accommodation",
        "Bank statements",
      ],
      importantDates: ["Apply at least 15 days before travel"],
      embassyWebsite: "https://www.swedenabroad.se/en/",
      notes: "Schengen visa — valid across all Schengen states. Sweden is famous for Northern Lights (best October–February) and midnight sun (June–July).",
    },
    "Work Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "SEK 2,000",
      financialRequirement: "Minimum SEK 13,000/month gross salary",
      keyRequirements: [
        "Job offer from Swedish employer",
        "Salary meeting collective agreement rates",
        "Union notification by employer",
        "Health insurance",
      ],
      importantDates: ["Employer must advertise role in EU/EEA for 10 days before offering to non-EU nationals"],
      embassyWebsite: "https://www.migrationsverket.se/en/Private-individuals/Working-in-Sweden.html",
      notes: "Sweden has one of the world's most straightforward work permit systems. Highly skilled workers in tech and engineering are in high demand.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation from Swedish company",
        "Proof of business purpose",
        "Valid passport and Schengen insurance",
      ],
      importantDates: ["Apply at least 3 weeks before travel"],
      embassyWebsite: "https://www.swedenabroad.se",
      notes: "Schengen business visa valid across all Schengen countries.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–12 months",
      applicationFee: "SEK 1,000",
      financialRequirement: "Self-sufficiency demonstrated",
      keyRequirements: [
        "4 years of continuous residence with work permit (or 3 years for Establishment permit holders)",
        "Employment income throughout",
        "No criminal record",
      ],
      importantDates: ["Apply before current permit expires"],
      embassyWebsite: "https://www.migrationsverket.se/en/Private-individuals/Becoming-a-Swedish-citizen/Permanent-residence.html",
      notes: "Permanent residence (PUT) allows indefinite stay. Swedish citizenship possible after 5 years of PR. Sweden allows dual citizenship.",
    },
  },

  // ── Italy ───────────────────────────────────────────────────────────────────
  "Italy": {
    "Student Visa": {
      processingTime: "4–12 weeks",
      applicationFee: "€50",
      financialRequirement: "€5,905/year minimum (as per 2023 INPS threshold for student support)",
      keyRequirements: [
        "Admission letter from Italian university",
        "Proof of financial support",
        "Health insurance",
        "Accommodation proof",
        "Valid passport",
        "Italian language proficiency (for Italian-medium courses) or English (for international programs)",
      ],
      importantDates: [
        "Apply at least 3 months before course start",
        "Pre-enrolment through Universitaly portal required",
        "Italian universities: October intake",
      ],
      embassyWebsite: "https://vistoperitalia.esteri.it/",
      notes: "Many Italian universities are among the world's oldest. Universitaly pre-enrolment is mandatory. Post-study permit available after degree completion.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen)",
      applicationFee: "€80",
      financialRequirement: "€54.19/day solo traveler",
      keyRequirements: [
        "Valid passport",
        "Schengen travel insurance",
        "Return flights",
        "Accommodation bookings",
        "Bank statements",
      ],
      importantDates: ["Apply 15 days to 6 months before travel"],
      embassyWebsite: "https://vistoperitalia.esteri.it/",
      notes: "Italian Schengen visa valid across all Schengen countries. Italy is one of the most visited countries globally — book VFS/consulate appointments early.",
    },
    "Work Visa": {
      processingTime: "3–6 months (flows quota system)",
      applicationFee: "€150",
      financialRequirement: "Salary as per CCNL collective agreements (varies by sector)",
      keyRequirements: [
        "Entry within annual immigration quota (Decreto Flussi)",
        "Job offer from Italian employer",
        "Employer applies for Nulla Osta (work clearance)",
        "Qualifications relevant to role",
      ],
      importantDates: [
        "Decreto Flussi (annual quota) announced each year — apply immediately when it opens",
        "Quota fills up extremely quickly — often within hours",
      ],
      embassyWebsite: "https://www.lavoro.gov.it/",
      notes: "Italy's quota system (Decreto Flussi) is extremely competitive — applications must be submitted the moment the quota opens. Tech sector quotas have separate provisions.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation from Italian company",
        "Proof of business purpose",
        "Valid passport and Schengen insurance",
      ],
      importantDates: ["Apply at least 4 weeks before travel"],
      embassyWebsite: "https://vistoperitalia.esteri.it/",
      notes: "Schengen business visa for Italy — valid across all Schengen area.",
    },
    "Permanent Residency Visa": {
      processingTime: "6–12 months",
      applicationFee: "€200",
      financialRequirement: "Income above social allowance threshold (approx. €8,500/year)",
      keyRequirements: [
        "5 years of legal continuous residence in Italy",
        "Italian language knowledge (A2 level)",
        "Sufficient income",
        "Adequate housing",
        "No criminal record",
      ],
      importantDates: ["Apply at your local Questura (police headquarters)"],
      embassyWebsite: "https://www.interno.gov.it/",
      notes: "Italian long-term residence permit (permesso CE per soggiornanti di lungo periodo) is recognized across all EU member states.",
    },
  },

  // ── Portugal ────────────────────────────────────────────────────────────────
  "Portugal": {
    "Student Visa": {
      processingTime: "4–8 weeks",
      applicationFee: "€90",
      financialRequirement: "€760/month (IAS × 1) for living costs",
      keyRequirements: [
        "Acceptance from Portuguese institution",
        "Proof of financial means",
        "Health insurance",
        "Clean criminal record (police clearance)",
        "Valid passport",
      ],
      importantDates: [
        "Apply at least 3 months before course start",
        "Register with SEF (now AIMA) within 30 days of arrival",
      ],
      embassyWebsite: "https://vistos.mne.gov.pt/en/",
      notes: "Portugal is increasingly popular for international students due to lower costs and English-medium programs. Post-study job-seeker visa available for 12 months.",
    },
    "Tourist Visa": {
      processingTime: "2–4 weeks (Schengen)",
      applicationFee: "€80",
      financialRequirement: "€40/day of stay minimum",
      keyRequirements: [
        "Valid passport",
        "Schengen travel insurance",
        "Return flights",
        "Accommodation bookings",
        "Bank statements",
      ],
      importantDates: ["Apply 15 days to 6 months before travel"],
      embassyWebsite: "https://vistos.mne.gov.pt/en/",
      notes: "Portugal Schengen visa valid across all Schengen states. Lisbon and Porto are increasingly popular — apply early especially for summer travel.",
    },
    "Work Visa": {
      processingTime: "2–4 months",
      applicationFee: "€90",
      financialRequirement: "Minimum wage: €820/month gross (2024)",
      keyRequirements: [
        "Job offer or employment contract from Portuguese employer",
        "Employer registers with Social Security",
        "Qualifications proof",
        "Clean criminal record",
      ],
      importantDates: ["Portugal has simplified work visa process for high-demand occupations"],
      embassyWebsite: "https://vistos.mne.gov.pt/en/",
      notes: "Tech Visa (Visto Tech) for tech professionals — faster processing. Portugal's Digital Nomad Visa is also an option for remote workers earning €3,040/month+.",
    },
    "Business Visa": {
      processingTime: "2–4 weeks",
      applicationFee: "€80",
      financialRequirement: "Business expenses covered",
      keyRequirements: [
        "Invitation from Portuguese company",
        "Proof of business activities",
        "Valid passport and Schengen insurance",
      ],
      importantDates: ["Apply at least 4 weeks before travel"],
      embassyWebsite: "https://vistos.mne.gov.pt/en/",
      notes: "Schengen business visa valid across all Schengen states.",
    },
    "Permanent Residency Visa": {
      processingTime: "3–6 months",
      applicationFee: "€300",
      financialRequirement: "Annual income of at least €760/month (IAS)",
      keyRequirements: [
        "5 years of legal continuous residence",
        "Portuguese language (A2 level)",
        "Financial self-sufficiency",
        "No criminal record",
      ],
      importantDates: ["Apply at AIMA office before current permit expires"],
      embassyWebsite: "https://www.aima.gov.pt/",
      notes: "Portugal PR leads to citizenship after 5 years of legal residence. Portugal allows dual citizenship. Golden Visa program has been modified — property investment no longer qualifies.",
    },
  },
};

/**
 * Look up guidelines for a specific country and visa type.
 * Returns null if the country or visa type is not in the static data.
 *
 * @param {string} country  — e.g. "United Kingdom"
 * @param {string} visaType — e.g. "Student Visa"
 * @returns {object|null}
 */
export function lookupGuidelines(country, visaType) {
  return GUIDELINES[country]?.[visaType] || null;
}

/** List all countries with static data available. */
export const COVERED_COUNTRIES = Object.keys(GUIDELINES);