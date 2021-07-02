import React, { FC } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Entry, Patient } from "../types";
import { getPatientDetails, useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Container, Header, Icon, List } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";


const PatientDetailsPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

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

    const DiagnosisCodes = (entry: Entry) => {

      const DiagnosisCodeDescription: FC<{code: string}> = (props) => {
        const diagnosis = diagnoses[props.code];

        if (!diagnosis) {
          return null;
        }

        return (
          <div>
            {props.code} {diagnosis.name}
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

    return (
      <div>
        {Object.values(patients[id].entries as Entry[]).map((entry: Entry, index: number) => (
          <Container key={index}>
            <p>{entry.date} <i>{entry.description}</i></p>
            <DiagnosisCodes {...entry} />
          </Container>
        ))}
      </div>
    );
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
    </div>
  );
};

export default PatientDetailsPage;
