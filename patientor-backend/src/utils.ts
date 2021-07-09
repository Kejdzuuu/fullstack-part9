import { NewPatient, Gender, Entry, HealthCheckRating, Discharge, SickLeave } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (text: unknown, param: string): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${param}`);
  }
  return text;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!rating || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health rating');
  }
  return rating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (discharge: any): discharge is Discharge => {
  if (!discharge.date || !isString(discharge.date)) {
    return false;
  }
  if (!discharge.criteria || !isString(discharge.criteria)) {
    return false;
  }
  return true;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge info');
  }
  return discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (sickLeave: any): sickLeave is SickLeave => {
  if (!sickLeave.startDate || !isString(sickLeave.startDate)) {
    return false;
  }
  if (!sickLeave.endDate || !isString(sickLeave.endDate)) {
    return false;
  }
  return true;
};

const parseSickLeave = (sickLeave: unknown): SickLeave | undefined => {
  if (!sickLeave) {
    return undefined;
  }
  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sick leave info');
  }
  return sickLeave;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDiagnosis = (diagnosis: any): diagnosis is string => {
  if (!diagnosis || !isString(diagnosis)) {
    return false;
  }
  return true;
};

const parseDiagnosisCodes = (diagnoses: Array<unknown> | undefined): Array<string> | undefined => {
  if (!diagnoses) {
    return undefined;
  }
  if (typeof diagnoses === 'string') {
    throw new Error('Incorrect or missing codes');
  }

  const parsedDiagnoses: Array<string> = [];
  for (const diagnosis of diagnoses) {
    if (!isDiagnosis(diagnosis)) {
      throw new Error('Incorrect or missing codes');
    } else {
      parsedDiagnoses.push(diagnosis);
    }
  }
  return parsedDiagnoses;
};

type PatientFields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const parseNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }: PatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, 'name'),
    dateOfBirth: parseString(dateOfBirth, 'dateOfBirth'),
    ssn: parseString(ssn, 'ssn'),
    gender: parseGender(gender),
    occupation: parseString(occupation, 'occupation'),
    entries: []
  };

  return newPatient;
};

type EntryFields =  {
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes?: unknown[];
  type: unknown;
  healthCheckRating: unknown;
  employerName: unknown;
  sickLeave?: unknown;
  discharge: unknown;
};

export const parseNewEntry = (entry: EntryFields): Entry => {
  let newEntry: Entry;

  switch (entry.type) {
  case "HealthCheck":
    newEntry = {
      id: '',
      description: parseString(entry.description, 'description'),
      date: parseString(entry.date, 'date'),
      specialist: parseString(entry.specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
      type: entry.type,
      healthCheckRating: parseHealthCheckRating(entry.healthCheckRating)
    };
    break;
  case "Hospital":
    newEntry = {
      id: '',
      description: parseString(entry.description, 'description'),
      date: parseString(entry.date, 'date'),
      specialist: parseString(entry.specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
      type: entry.type,
      discharge: parseDischarge(entry.discharge)
    };
    break;
  case "OccupationalHealthcare":
    newEntry = {
      id: '',
      description: parseString(entry.description, 'description'),
      date: parseString(entry.date, 'date'),
      specialist: parseString(entry.specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
      type: entry.type,
      employerName: parseString(entry.employerName, 'employer'),
      sickLeave: parseSickLeave(entry.sickLeave)
    };
    break;
  default:
    throw new Error('Incorrect or missing type');
  }

  return newEntry;
};
