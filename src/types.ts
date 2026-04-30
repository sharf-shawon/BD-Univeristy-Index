/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UniversityCategory {
  PUBLIC = "Public",
  PRIVATE = "Private",
  INTERNATIONAL = "International",
}

export interface Ranking {
  source: "QS" | "THE" | "Webometrics" | "Scopus" | "Other";
  rank: string;
  year: string;
  link?: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  category: UniversityCategory;
  approvalStatus: string;
  website: string | null;
  address: string | null;
  permanentCampus: string | null;
  yearOfEstablishment: string | null;
  viceChancellor: string | null;
  proViceChancellor: string | null;
  treasurer: string | null;
  registrar: string | null;
  phone: string | null;
  email: string | null;
  fax: string | null;
  district: string | null;
  sourceUrl: string;
  lastChecked: string;
  notes: string | null;
  isVerified: boolean;
  rankings?: Ranking[];
}

export interface UniversityApiResponse {
  data: University[];
  total: number;
  categories: UniversityCategory[];
}
