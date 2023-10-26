import React, { memo } from "react";
import {
  Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner 
} from "reactstrap";

function ConfirmationModal(props: {
  header: string | JSX.Element;
  message: string | JSX.Element;
  footerMessage?: string | JSX.Element;
  isOpen: boolean;
  close: () => void;
  confirm: () => void;
  confirmBtnText: string;
  cancelBtnText?: string;
  danger?: boolean;
  size?: "md" | "sm" | "lg";
}): JSX.Element {
  const {
    message, footerMessage, isOpen, danger, confirmBtnText, cancelBtnText = "Cancel", header, size = "md", confirm, close
  } = props;

  const confirmationBtnColor = !danger ? "primary" : "danger";
  const isConfirmButtonEnabled = !footerMessage;

  return (
    <Modal isOpen={isOpen} size={size} centered fade={false}>
      <ModalBody>
        {/* header */}
        <h4 className={`text-${confirmationBtnColor} mb-2`}>{!!header ? header : "Nofification"}</h4>

        {/* body */}
        {message}

        {/* footer */}
        <div 
          style={{
            display : "flex",
            justifyContent : footerMessage !== "" ? "space-between" : "flex-end",
            marginTop : "10px"
          }}>
          <div className="text-danger">{footerMessage}</div>
          <div className="d-flex gap-2">
            <Button data-test="confirm-modal__btn-cancel" className="rounded rounded-3" color="gray" onClick={close}>
              {cancelBtnText}
            </Button>
            <Button
              data-test="confirm-modal__btn-confirm"
              className="rounded rounded-3"
              color={confirmationBtnColor}
              style={{
                opacity : isConfirmButtonEnabled ? 1 : 0.5,
                cursor : isConfirmButtonEnabled ? "pointer" : "not-allowed"
              }}
              onClick={() => {
                if (!footerMessage) confirm();
              }}>
              {confirmBtnText}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default memo(ConfirmationModal);
