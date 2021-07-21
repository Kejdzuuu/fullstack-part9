import React, { useState } from 'react';
import { Dropdown, DropdownProps, Form, Modal, Segment } from 'semantic-ui-react';
import { AddEntryForm, EntryFormValues } from "./AddEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const dropdownOptions = [
  {
    key: "HealthCheck",
    text: "Health Check",
    value: "HealthCheck",
  },
  {
    key: "OccupationalHealthcare",
    text: "Occupational Healthcare",
    value: "OccupationalHealthcare",
  },
  {
    key: "Hospital",
    text: "Hospital",
    value: "Hospital",
  }
];

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  
  const [entry, setEntry] = useState<string>('');

  const handleEntryTypeSelection = ( _event: React.SyntheticEvent<HTMLElement, Event>, {value}: DropdownProps) => {
    setEntry(value as string);
  };

  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new entry</Modal.Header>
      <Modal.Content>
        <Form className="form ui">
          <Form.Field>
            <label>Entry type</label>
            <Dropdown
              placeholder={"Entry type"}
              fluid
              selection
              options={dropdownOptions}
              value={entry}
              onChange={handleEntryTypeSelection}
            />
          </Form.Field>
        </Form>
        <br />
        {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} entryType={entry} />
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;
