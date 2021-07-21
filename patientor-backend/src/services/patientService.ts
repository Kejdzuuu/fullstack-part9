import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, Entry } from '../types';
import {v1 as uuid} from 'uuid';

const getEntries = (): Array<Patient> => {
  return patients;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }));
};

const getEntry = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const updatePatient = (id: string, newEntry: Entry): Patient => {
  const entry = {
    ...newEntry,
    id: uuid()
  };

  const patientIndex = patients.findIndex(patient => patient.id === id);
  patients[patientIndex].entries.push(entry);

  return patients[patientIndex];
};

export default { getEntries, getNonSensitiveEntries, addPatient, getEntry, updatePatient };
