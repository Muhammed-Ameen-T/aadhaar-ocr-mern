import { parse } from 'date-fns';
import { ParsedAadhaarData } from '../types/PaarsedAadhaar';

/**
 * Parses raw text extracted from Aadhaar card images to find specific data fields.
 * @param frontText Text from the front side of the Aadhaar card.
 * @param backText Text from the back side of the Aadhaar card.
 * @returns An object containing the parsed Aadhaar data.
 */
export const parseAadhaarData = (frontText: string, backText: string): ParsedAadhaarData => {
  const lines = frontText.split('\n').map(line => line.trim()).filter(Boolean);

  const NAME_LABEL_REGEX = /(?:Name[:\-]?)\s*([A-Za-z .]+)/i;
  const DOB_REGEX = /(?:DOB|Date of Birth|जन्म तिथि)\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i;
  const UID_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
  const PINCODE_REGEX = /\b\d{6}\b/;
  const ADDRESS_PREFIX_REGEX = /.*(Address[:\-]?\s*)/i;

  let name = '';
  let dob = '';
  let gender = '';

  const dobMatch = frontText.match(DOB_REGEX);
  if (dobMatch?.[1]) dob = dobMatch[1];

  const nameMatch = frontText.match(NAME_LABEL_REGEX);
  if (nameMatch?.[1]) {
    name = nameMatch[1].trim();
  } else if (dob) {
    const dobLineIndex = lines.findIndex(line => line.includes(dob));
    if (dobLineIndex > 0) {
      const candidate = lines[dobLineIndex - 1];
      if (!/male|female/i.test(candidate) && !candidate.match(UID_REGEX)) {
        name = candidate;
      }
    }
  }

  const genderMatch = frontText.match(/Gender\s*[:\-]?\s*(Male|Female)/i);
  if (genderMatch?.[1]) {
    gender = genderMatch[1].toUpperCase();
  } else {
    const genderLine = lines.find(line => /male|female/i.test(line));
    gender = genderLine?.toLowerCase().includes('female') ? 'FEMALE' : 'MALE';
  }

  const uidFrontMatches = [...frontText.matchAll(UID_REGEX)]
    .map(match => match[0].replace(/\s+/g, ''))
    .filter(uid => uid.length === 12);
  const frontUidRaw = uidFrontMatches[0] || '';

  const rawNumbers = backText.replace(/\D+/g, ' ').trim().split(/\s+/);
  const uidBackMatches: string[] = [];

  for (let i = 0; i <= rawNumbers.length - 4; i++) {
    const chunk = rawNumbers.slice(i, i + 4).join('');
    if (/^\d{16}$/.test(chunk) && chunk.startsWith('1947')) {
      uidBackMatches.push(chunk.slice(4));
    }
  }

  const validUidBacks = uidBackMatches.filter(uid => uid.length === 12 && /^\d{12}$/.test(uid));
  const backUidRaw = validUidBacks.find(uid => uid === frontUidRaw) || validUidBacks[0] || '';

  const uid_front = frontUidRaw;
  const uid_back = backUidRaw;

  let rawAddress = backText.replace(/\n/g, ' ').trim();
  rawAddress = rawAddress.replace(ADDRESS_PREFIX_REGEX, '').trim();

  const pinMatch = rawAddress.match(PINCODE_REGEX);
  const pincode = pinMatch?.[0] || '';
  if (pinMatch) {
    const cutoff = rawAddress.indexOf(pinMatch[0]) + pinMatch[0].length;
    rawAddress = rawAddress.slice(0, cutoff).trim();
  }

  let age_band = 'N/A';
  if (dob) {
    const dobDate = parse(dob, 'dd/MM/yyyy', new Date());
    const age = new Date().getFullYear() - dobDate.getFullYear();
    if (age < 18) age_band = 'Underage';
    else if (age <= 30) age_band = '20-30';
    else if (age <= 50) age_band = '30-50';
    else age_band = 'Senior';
  }

  return {
    name,
    dob,
    gender,
    uid_front: uid_front.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'),
    uid_back: uid_back.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3'),
    address: rawAddress,
    pincode,
    age_band,
  };
};