export const KYBStatusFailed = {
  NameFailed: 'name',
  DOBFailed: 'date_of_birth',
  AddressFailed: 'address',
  SSNFailed: 'social_security_number',
  GeneralFailed: 'general',
  IDFailed: 'employer_id_number',
};

// the 1st section in KYC
export const documentsAddressList = [
  { id: 0, name: `State-issued driver's license` },
  { id: 1, name: `Driver's permit` },
  { id: 2, name: `State ID card` },
  { id: 3, name: `Military ID` },
];
//date of birth
export const documentsDOBList = [
  {
    id: 0,
    name: `State Driver's License (front and back, not expired, with photo, and not temporary)`,
  },
  { id: 1, name: `Driver's Permit (front and back, not expired, with photo)` },
  { id: 2, name: `State ID Card (front and back, not expired, with photo)` },
  { id: 3, name: `Please note: we're not able to accept temporary IDs` },
  {
    id: 4,
    name: `US Passport (first and second page, not expired, photo page, signature visible)`,
  },
  { id: 5, name: `US Passport Card (front and back, not expired)` },
  { id: 6, name: `Birth Certificate` },
];

export const documentsNameList = [
  {
    id: 0,
    name: `A current driver's license (front and back)`,
  },
  { id: 1, name: `A current driver's permit with a photo (front and back)` },
  { id: 2, name: `A current state photo ID card (front and back)` },
];

export const documentsSSNList = [
  {
    id: 0,
    name: `State Driver's License (front and back, not expired, with photo, and not temporary)`,
  },
  { id: 1, name: `Driver's Permit (front and back, not expired, with photo)` },
  { id: 2, name: `State ID Card (front and back, not expired, with photo)` },
  {
    id: 3,
    name: `US Passport (first and second page, not expired, photo page, signature visible)`,
  },
  {
    id: 4,
    name: `US Passport Card (front and back, not expired)`,
  },
  { id: 5, name: `Birth Certificate` },
];

export const documentsGeneralList = [
  { id: 0, name: `State-issued driver's license` },
  { id: 1, name: `Driver's permit` },
  { id: 2, name: `State ID card` },
  { id: 3, name: `Military ID` },
  { id: 4, name: `Passport (both pages))` },
];

export const addressDocumentGuide = [
  'Utility bill dated within the past 60 days (please note: we cannot accept mobile phone bills, but we can accept internet or landline bills)',
  'Lease agreement (Negotiated within the past year; month-to-month leases must be negotiated within the past 6 months. Leases must include the terms and be signed by both the lessor and lessee.)',
  'Signed mortgage agreement (signed, and dated within the last 60 days)',
  'NYC ID card',
  'Tuition statement (for college or university students only; must include your dorm address, the date, and the school contact information)',
];

export const nameDocumentGuide = [
  `A current, signed U.S. passport or a U.S. passport card (first and second page of passport, or 
    front and back of card)`,
  `A marriage license or divorce decree (this must have your new legal name printed by the state, 
      and it must show that a name change occurred)`,
  `A court order for the name change`,
  `A Social Security card (front and back)`,
  `An IRS form W-2`,
];

export const SSNDocumentGuide = [
  `Social Security Card (front and back)`,
  `1040 Tax Return, federal or state versions acceptable (must be the most recent calendar year)`,
  `W2 and/or 1099s, includes 1099 MISC, 1099G, 1099R, 1099SSA, 1099DIV, 1099S, 1099INT (must be the most recent calendar year)`,
  `W4 Withholding Allowance Certificate, federal or state versions acceptable.`,
  `1095, includes: 1095A, 1095B, 1095C (must be the most recent calendar year)`,
  `Pay stub documentation (must be the most recent month)`,
  `Social Security Administration documentation (includes 4029)`,
  `Military records: U.S. Military ID card (front and back)`,
  `Military records: Military dependent’s ID card (front and back)`,
  `Unemployment Benefits (Unemployment Benefits Letter)`,
  `Court Order Granting a Name Change, that must have your original first and last name, new first and last name, and SSN`,
  `Divorce decree`,
];

export const generalDocumentGuide = [
  `Obtain a clear selfie from your individual user. The Selfie should include a clear photo of their face 
  and the document of their choice. In other words, the user should hold up their document near 
  their face such that a selfie clearly captures both their face and the document.`,
];

/// the bottom section in KYC
export const documentsAddressRequire = [
  `Clear photos and PDFs are fine; we cannot accept screenshots or scans.`,
  `All documents must be current. IDs cannot be expired, and monthly bills or 
statements should have been issued within the past 60 days.`,
  `We need to see all four corners of the document, and the information we need to 
verify must be clearly visible.`,
  `If you're using a photo ID, please send us images of both the front and the back.`,
  `If the document has a signature requirement, then it must be hand-signed. We cannot 
accept electronic signatures (with the exception of leases, where electronic signatures 
are acceptable).`,
  `Government-issued documents (such as a state-issued ID or passports) must be in 
color. We can accept black-and-white photos or PDFs of other documents, such as 
utility bills.`,
];

export const documentsDOBRequire = [
  `We can only accept clear color photos; we cannot accept scans.`,
  `We need to see all four corners of the document, and the name you are verifying must 
  be clearly visible.`,
];

export const documentsNameRequire = [
  `We can only accept clear color photos; we cannot accept scans.`,
  `We need to see all four corners of the document, and the name you are verifying must 
  be clearly visible.`,
];

export const documentsSSNRequire = [
  `The user must provide images of the front and back of each document they submit`,
  `We can only accept clear color photos; we cannot accept scans or copies.`,
  `We need to see all four corners of the document, and everything must be human 
  readable.`,
];

export const documentsGeneralRequire = [
  `Clear photos only; we cannot accept screenshots or scans.`,
  `All documents must be current. IDs cannot be expired.`,
  `We need to see all four corners of the document, and the information we need to 
  verify must be clearly readable.`,
  `Send us images of both the front and the back of the document.`,
  `If the document has a signature requirement, then it must be hand-signed. We cannot 
  accept electronic signatures (with the exception of leases, where electronic signatures 
  are acceptable).`,
  `Government-issued documents (such as a state-issued ID or passports) must be in 
  color. We can accept black-and-white photos or PDFs of other documents, such as 
  utility bills.`,
];
