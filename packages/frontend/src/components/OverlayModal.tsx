import React from "react";
import {
  Button, Modal, ModalBody, ModalFooter 
} from "reactstrap";

const OverlayModal = (props: {
  isOpen: boolean;
  close: () => void;
  children: string | JSX.Element;
}): JSX.Element => {
  const {
    isOpen, close, children 
  } = props;

  return (
    <Modal isOpen={isOpen} toggle={close} centered>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button color="gray" onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OverlayModal;
