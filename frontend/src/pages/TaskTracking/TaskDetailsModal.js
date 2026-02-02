import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaskDetailsModal = ({ show, handleClose, task, handleStatusChange }) => {
  if (!task) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{task.title}</h5>
        <p>{task.description}</p>
        <Form.Group controlId="taskStatus">
          <Form.Label>Estado</Form.Label>
          <Form.Control as="select" value={task.status} onChange={handleStatusChange}>
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskDetailsModal;
