import React, { useState } from "react";
import { Form, Formik } from "formik";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SwarmConnectionsProvider from "providers/SwarmConnectionsProvider";

interface IFormValues {
  connectionString: string;
  label: string;
}
interface IFormErrors {
  connectionString?: string;
  label?: string;
}

const initialValues = {
  connectionString: "",
  label: ""
};

interface IAddConnectionButtonProps {
  addConnection: (connectionString: string, label?: string) => void;
  variant?:
    | "link"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger";
  size?: "sm" | "md" | "lg";
}
const AddConnectionButton = (props: IAddConnectionButtonProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant={props.variant ? props.variant : "primary"}
        onClick={handleShow}
      >
        Add New Connection
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values: IFormValues) => {
            props.addConnection(values.connectionString, values.label);
            handleClose();
          }}
          validate={(values: IFormValues) => {
            const errors: IFormErrors = {};

            if (!values.connectionString) errors.connectionString = "Required";
            if (
              !(
                values.connectionString.startsWith("ws://") ||
                values.connectionString.startsWith("wss://")
              )
            )
              errors.connectionString =
                "The connection string must start with ws:// or wss://";
            if (!values.label) errors.label = "Required";
            return errors;
          }}
        >
          {({
            values,
            errors,
            handleChange,
            touched,
            isValid,
            isSubmitting
          }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <label>Websocket Connection UR</label>
                  <input
                    onChange={handleChange}
                    value={values.connectionString}
                    name="connectionString"
                    type="text"
                    className="form-control"
                    id="websocketConnection"
                    aria-describedby="websocketHelp"
                  />
                  <small id="websocketHelp" className="form-text text-muted">
                    {errors.connectionString}
                  </small>
                </div>
                <div className="form-group">
                  <label>Connection Label</label>
                  <input
                    onChange={handleChange}
                    value={values.label}
                    name="label"
                    type="text"
                    className="form-control"
                    id="connectionLabel"
                    aria-describedby="labelHelp"
                  />
                  <small id="labelHelp" className="form-text text-muted">
                    {errors.label}
                  </small>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid || !touched}
                >
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

interface IProps {
  variant?:
    | "link"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "outline-primary"
    | "outline-secondary"
    | "outline-success"
    | "outline-danger";
  size?: "sm" | "md" | "lg";
}
export default (props: IProps) => (
  <SwarmConnectionsProvider.Consumer>
    {({ actions: { addConnection } }) => (
      <AddConnectionButton addConnection={addConnection} {...props} />
    )}
  </SwarmConnectionsProvider.Consumer>
);
