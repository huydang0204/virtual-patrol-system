import React, { memo } from "react";
import {
  Button,
  Modal,
  ModalBody
} from "reactstrap";
import { IoAlertCircleOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { NotificationModalProps } from "model-type/component-style";

const DefaultIconsType = {
  "success" : <IoIosCheckmarkCircleOutline
    size={ 100 }
    className="mb-3" />,
  "notify" : <IoAlertCircleOutline
    size={ 100 }
    className="mb-3" />
};

function NotifyMessageModal(props : NotificationModalProps) : JSX.Element {
  const {
    color = "primary",
    iconType = "notify",
    Icon,
    header,
    message,
    isOpen,
    close,
    size,
    closeButtonLabel = "Close"
  } = props;

  return (
    <Modal
      data-test="notify-modal"
      isOpen={ isOpen }
      toggle={ close }
      centered
      size={ size || "sm" }
      fade={ false }>
      <ModalBody>
        <div className={ `d-flex flex-column align-items-center text-${ color }` }>
          {/* icon */ }
          { DefaultIconsType[iconType] }
          { !iconType && !!Icon && Icon }

          {/* header */ }
          <h4 className={ `mb-1 text-${ color }` }>{ !!header ? header : "Notice!" }</h4>

          <span data-test="notify-modal__message">{ message }</span>

          {/* footer */ }
          <Button
            data-test="notify-modal__btn-close"
            className="mt-4"
            color="gray"
            onClick={ close }>{ closeButtonLabel }</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default memo(NotifyMessageModal);
