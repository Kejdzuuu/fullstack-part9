import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { getPatientDetails, useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Header, Icon, List } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";


const PatientDetailsPage = () => {
  const [{ patients }, dispatch] = useStateValue();
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
    </div>
  );
};

export default PatientDetailsPage;
