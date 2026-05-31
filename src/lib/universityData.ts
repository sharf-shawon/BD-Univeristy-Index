import registry from "../../registry/universities.json";
import { University, UniversityApiResponse, UniversityCategory } from "../types";

const universities = registry as University[];

export function getUniversityDirectory(): UniversityApiResponse {
  return {
    data: universities,
    total: universities.length,
    categories: Object.values(UniversityCategory),
  };
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find((university) => university.slug === slug);
}

export function validateEmailAgainstDirectory(email: string, directory: University[]) {
  const emailDomain = email.split("@")[1]?.toLowerCase();

  if (!emailDomain) {
    return { isValid: false, message: "Please enter a complete email address." };
  }

  const match = directory.find((university) => {
    if (!university.website) return false;

    try {
      const universityDomain = new URL(university.website).hostname.replace("www.", "").toLowerCase();
      return emailDomain === universityDomain || emailDomain.endsWith(`.${universityDomain}`);
    } catch {
      return false;
    }
  });

  if (match) {
    return {
      isValid: true,
      message: `Verified institution: ${match.name}`,
    };
  }

  return {
    isValid: false,
    message: "No matching institutional record found.",
  };
}