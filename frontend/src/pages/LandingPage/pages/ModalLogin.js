import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CustomModal = ({ show, handleClose, modalInfo }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalInfo.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalInfo.text}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;