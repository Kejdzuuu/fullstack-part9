import React, { FC } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Entry, Patient, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { getPatientDetails, updatePatientEntries, useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Header, Icon, List, Segment } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import HealthRatingBar from "../components/HealthRatingBar";
import AddEntryModal from "../AddEntryModal";
import { Button } from 'semantic-ui-react';
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";


const PatientDetailsPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const isPatientDataFetched = (): boolean => {
    if (!patients || !patients[id] || !patients[id].ssn) {
      return false;
    } else {
      return true;
    }
  };

  const getGenderIconName = (gender: string): SemanticICONS => {
    switch (gender) {
      case "male":
        return "mars";
      case "female":
        return "venus";
      default:
        return "question";
    }
  };

  const PatientEntries = () => {

    const Diagnoses = (entry: Entry) => {

      const DiagnosisCodeDescription: FC<{code: string}> = (props) => {
        const diagnosis = diagnoses[props.code];

        if (!diagnosis) {
          return null;
        }

        return (
          <div>
            <b>{props.code}</b> {diagnosis.name}
          </div>
        );
      };

      if (!entry.diagnosisCodes) {
        return null;
      }

      return (
        <List bulleted>
          {Object.values(entry.diagnosisCodes).map((code: string, index: number) => (
            <List.Item key={index}>
              <DiagnosisCodeDescription code={code} />
            </List.Item>
          ))}
        </List>
      );
    };

    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };

    const HealthCheckEntry: FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
      return (
        <div>
          <Header as="h3">
            {entry.date}
            <Icon name="doctor" />
          </Header>
          <p><i>{entry.description}</i></p>
          <Diagnoses {...entry} />
          <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
        </div>
      );
    };

    const HospitalEntry: FC<{ entry: HospitalEntry }> = ({ entry }) => {
      return (
        <div>
          <Header as="h3">
            {entry.date}
            <Icon name="hospital" />
          </Header>
          <p><i>{entry.description}</i></p>
          <Diagnoses {...entry} />
          <Header as="h4">
            Discharge:
          </Header>
          <p>
            <b>{entry.discharge.date}</b> {entry.discharge.criteria}
          </p>
        </div>
      );
    };

    const OccupationalHealthcareEntry: FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {

      const SickLeaveDetails = () => {
        if (!entry.sickLeave) {
          return null;
        }

        return (
          <div>
            <Header as="h4">
              Sick Leave:
            </Header>
            <p>
              {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
            </p>
          </div>
        );
      };

      return (
        <div>
          <Header as="h3">
            {entry.date}
            <Icon name="building" />
            {entry.employerName}
          </Header>
          <p><i>{entry.description}</i></p>
          <Diagnoses {...entry} />
          <SickLeaveDetails />
        </div>
      );
    };

    const EntryDetails: FC<{ entry: Entry }> = ({ entry }) => {
      switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckEntry entry={entry} />;
      case "Hospital":
        return <HospitalEntry entry={entry} />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntry entry={entry} />;
      default:
        return assertNever(entry);
      }
    };

    return (
      <div>
        {Object.values(patients[id].entries as Entry[]).map((entry: Entry, index: number) => (
          <Segment key={index}>
            <EntryDetails entry={entry} />
          </Segment>
        ))}
      </div>
    );
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(updatePatientEntries(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  React.useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const { data: patientDetails } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(getPatientDetails(patientDetails));
      } catch (e) {
        console.error(e);
      }
    };
  
    if (!isPatientDataFetched()) {
      void fetchPatientDetails();
    }
  }, [dispatch]);

  if (!isPatientDataFetched()) {
    return (
      <div>
        Fetching data...
      </div>
    );
  }

  return (
    <div>
      <Header as="h2">
        {patients[id].name}
        <Icon name={getGenderIconName(patients[id].gender)} />
      </Header>
      <List>
        <List.Item>ssn: {patients[id].ssn}</List.Item>
        <List.Item>occupation: {patients[id].occupation}</List.Item>
      </List>
      <Header as="h3">
        entries
      </Header>
      <PatientEntries />
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientDetailsPage;
