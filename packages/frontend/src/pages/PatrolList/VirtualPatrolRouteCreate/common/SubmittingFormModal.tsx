import React from "react";
import { BsCheck2All } from "react-icons/bs";
import {
  RiCheckboxBlankCircleFill,
  RiCloseCircleFill
} from "react-icons/ri";
import {
  Progress,
  Spinner
} from "reactstrap";

const SubmittingFormModal = (props : {
  progressMsg : string[][],
  currentProgress : number,
  errorSteps : Record<number, boolean>
}) : JSX.Element => {
  const {
    progressMsg,
    currentProgress,
    errorSteps
  } = props;

  return (
    <div className="text-primary">
      <h4 className="text-dark">Progress { currentProgress === progressMsg.length && "- Completed" }</h4>
      <hr />
      { progressMsg[0].map((msg : string, index : number) => {
        return (
          <div
            className="d-flex align-items-center gap-2 mb-2"
            key={ index }>
            { currentProgress === index ? (
              <Spinner
                color="primary"
                type="grow"
                size="sm">
                Loading...
              </Spinner>
            ) : currentProgress > index ? (
              !errorSteps[index] ?
                <BsCheck2All
                  size={ 15 }
                  color="green" /> :
                <RiCloseCircleFill
                  size={ 15 }
                  color="red" />
            ) : (
              <RiCheckboxBlankCircleFill size={ 17 } />
            ) }
            <span
              className={ `${ currentProgress >
              index ? (errorSteps[index] ? "text-warning" : "text-success") : "text-primary" }` }>{ msg }</span>
          </div>
        );
      }) }
      { currentProgress < progressMsg.length && (
        <div className="my-3">
          <Progress
            animated
            value="100"
            className="rounded rounded-3 h-3"
            style={ { height : "10px" } } />
        </div>
      ) }
    </div>
  );
};

export default SubmittingFormModal;
