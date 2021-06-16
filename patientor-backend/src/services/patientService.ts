import patients from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import {v1 as uuid} from 'uuid';

const getEntries = (): Array<Patient> => {
  return patients;
};

const getNonSensitiveEntries = (): Array<NonSensitivePatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getEntries, getNonSensitiveEntries, addPatient };
