/**
 * @typedef {Object} ParsedAadhaarData
 * @property {string} name - The extracted name.
 * @property {string} dob - The extracted date of birth.
 * @property {string} gender - The extracted gender.
 * @property {string} uid_front - The extracted UID from the front side.
 * @property {string} uid_back - The extracted UID from the back side.
 * @property {string} address - The extracted address.
 * @property {string} pincode - The extracted pincode.
 * @property {string} age_band - The calculated age band.
 */
export type ParsedAadhaarData = {
  name: string;
  dob: string;
  gender: string;
  uid_front: string;
  uid_back: string;
  address: string;
  pincode: string;
  age_band: string;
};