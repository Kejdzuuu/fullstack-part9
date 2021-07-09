import express from 'express';
import patientService from '../services/patientService';
import { parseNewPatient, parseNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getEntry(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = parseNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = parseNewEntry(req.body);
    const postedEntry = patientService.updatePatient(req.params.id, newEntry);
    res.json(postedEntry);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
