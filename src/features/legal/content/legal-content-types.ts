export type LegalContentSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  effectiveDate: string;
  contactEmail: string;
  jurisdiction: string;
  governingLaw: string;
  sections: LegalContentSection[];
};

