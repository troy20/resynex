import { z } from "zod";

export const roles = ["ACADEMIC", "STUDENT", "INDUSTRY", "UNIVERSITY", "STARTUP"] as const;

const genericDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

export function isInstitutionEmail(email: string) {
  const d = email.split("@")[1]?.toLowerCase() || "";
  return !genericDomains.includes(d) && (d.includes(".edu") || d.includes(".ac") || d.endsWith("edu.au") || d.endsWith("ac.uk"));
}

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(roles),
  
  // Academic fields
  institutionName: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
  researchFields: z.string().optional(),
  
  // Student fields
  universityName: z.string().optional(),
  degreeLevel: z.string().optional(),
  major: z.string().optional(),
  
  // Industry fields
  legalCompanyName: z.string().optional(),
  abn: z.string().optional(),
  companyRegistrationNumber: z.string().optional(),
  websiteUrl: z.string().optional(),
  sector: z.string().optional(),
  contactPersonName: z.string().optional(),
  businessEmail: z.string().email().optional(),
  
  // University fields
  officialUniversityName: z.string().optional(),
  institutionalEmail: z.string().email().optional(),
  
  // Startup fields
  startupName: z.string().optional(),
  stage: z.string().optional(),
}).superRefine((v, ctx) => {
  // Academic and University should use institutional email
  if ((v.role === "ACADEMIC" || v.role === "UNIVERSITY") && !isInstitutionEmail(v.email)) {
    ctx.addIssue({
      code: "custom",
      path: ["email"],
      message: "Academic and university accounts should use an institutional email.",
    });
  }
  
  // Industry requires company name
  if (v.role === "INDUSTRY" && !v.legalCompanyName) {
    ctx.addIssue({
      code: "custom",
      path: ["legalCompanyName"],
      message: "Company legal name is required.",
    });
  }
  
  // University requires official name
  if (v.role === "UNIVERSITY" && !v.officialUniversityName) {
    ctx.addIssue({
      code: "custom",
      path: ["officialUniversityName"],
      message: "Official university name is required.",
    });
  }
  
  // Academic requires institution name
  if (v.role === "ACADEMIC" && !v.institutionName) {
    ctx.addIssue({
      code: "custom",
      path: ["institutionName"],
      message: "Institution name is required.",
    });
  }
  
  // Startup requires startup name
  if (v.role === "STARTUP" && !v.startupName) {
    ctx.addIssue({
      code: "custom",
      path: ["startupName"],
      message: "Startup name is required.",
    });
  }
});
