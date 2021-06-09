import patients from '../../data/patients';
import { Patient } from '../types';

const getEntries = (): Array<Patient> => {
    return patients;
};

export default { getEntries };
