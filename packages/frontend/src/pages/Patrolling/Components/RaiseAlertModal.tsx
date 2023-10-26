import React, { ChangeEvent } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody
} from "reactstrap";
import {
  BsPlusCircle,
  BsTrash
} from "react-icons/bs";

import { getCameraImageSnapshot } from "apis/nx-api";
import {
  AlertTypeResponse,
  CameraResponse
} from "@vps/utils/lib/dto";

interface ComponentProps {
  isOpen : boolean;
  camera : CameraResponse,
  data : AlertTypeResponse,
  timeInEpoch : number;
  alertDetected : {
    value : string,
    onChange : (e : ChangeEvent<HTMLInputElement>) => void;
  },
  actionTakens : {
    data : string[],

    //
    newActionTakens : string[],
    onNewActionTakenChange : (e : ChangeEvent<HTMLInputElement>, order : number) => void;

    //
    onActionTakenAdd : () => void;
    onActionTakenRemove : (actionTaken : string | undefined, order : number | undefined) => void;
    onActionTakensReset : () => void;
  },
  onModalClose : () => void;
  onSubmit : () => Promise<void>;
}

const RaiseAlertModal : React.FC<ComponentProps> = ({
  isOpen,
  camera,
  data,
  alertDetected,
  actionTakens,
  timeInEpoch,
  onModalClose,
  onSubmit
} : ComponentProps) : JSX.Element => {

  const canNewActionAdd = actionTakens?.newActionTakens[actionTakens?.newActionTakens.length - 1] !== "";

  return (
    <Modal
      isOpen={ isOpen }
      size="lg"
      centered
      fade={ false }>
      <ModalBody>
        <h5 className="mb-3 text-primary">Raise an issue</h5>
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div
            className="d-flex flex-column gap-3"
            style={ { width : "75%" } }>
            <div className="row align-items-center ">
              <div className="col-sm-3">
                <span>Alert type</span>
              </div>
              <div className="col">
                <div
                  style={ { padding : "0.4rem" } }
                  className="input-disabled">{ data?.type }</div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <span>Alert detected</span>
              </div>
              <div className="col">
                <Input
                  type="textarea"
                  placeholder="Issue detected on {camera name} at {location} on {Datetime}"
                  value={ alertDetected?.value }
                  onChange={ alertDetected?.onChange }
                  style={ {
                    resize : "none",
                    padding : "0.4rem",
                    borderRadius : "7px"
                  } }
                  rows={ 7 }
                />
              </div>
            </div>
          </div>

          <div
            className="alert-modal-camera-image"
            style={ {
              width : "400px",
              height : "172px",
              border : "1px solid gray",
              borderRadius : "8.5px"
            } }>
            <img
              src={ getCameraImageSnapshot(camera?.id, timeInEpoch) }
              style={ { borderRadius : "8px" } } />

            <div className="alert-modal-camera-name">{ camera?.name }</div>
          </div>
        </div>
        <div className="row my-3 mb-1">
          <div className="mb-2">
            <span>Action Takens</span>
            { " " }
            { actionTakens.data.length !== data?.actionTaken.length && <small
              className="text-danger"
              onClick={ actionTakens.onActionTakensReset }
              style={ {
                cursor : "pointer",
                textDecoration : "underline"
              } }>
              <em>Reset predefined action taken</em>
            </small> }
          </div>
          { !!actionTakens && actionTakens?.data?.map((actionTaken : string, index : number) => (
            <div
              className="d-flex gap-2 mb-2"
              key={ index }>
              <Button
                className="border p-2 rounded-3 bg-danger"
                style={ { height : "35px" } }
                onClick={ () : void => actionTakens.onActionTakenRemove(actionTaken, undefined) }><BsTrash
                  color="white"
                  size={ 15 } /></Button>
              <div className="border rounded-3 p-2 w-100">{ actionTaken }</div>
            </div>))
          }
          { !!actionTakens && actionTakens?.newActionTakens?.map((actionTaken : string, index : number) => (
            <div
              className="d-flex gap-2 mb-2"
              key={ index }>
              <Button
                className="border p-2 rounded-3 bg-danger"
                style={ { height : "35px" } }
                onClick={ () : void => actionTakens.onActionTakenRemove(undefined, index) }><BsTrash
                  color="white"
                  size={ 15 } /></Button>
              <Input
                value={ actionTaken }
                onChange={ (e : ChangeEvent<HTMLInputElement>) : void => actionTakens?.onNewActionTakenChange(e, index) }
                bsSize="lg"
                type="text"
                className="bg-white text-black"
                placeholder="Enter new action taken">
              </Input>
            </div>))
          }
        </div>
        <div
          className="row"
          style={ {
            marginLeft : "25px",
            cursor : "pointer"
          } }>
          <div
            className={ `d-flex gap-1 justify-content-start align-items-center ${ canNewActionAdd ? "text-black" : "text-secondary cursor-not-allowed" }` }
            onClick={ () : void => {
              if (canNewActionAdd) actionTakens.onActionTakenAdd();
            } }>
            <BsPlusCircle size={ 12 } />
            <em>
              <small>Add action</small>
            </em>
          </div>
        </div>
      </ModalBody>
      {/* footer */ }
      <div
        style={ {
          display : "flex",
          justifyContent : "end",
          padding : "1rem",
          paddingTop : 0
        } }>
        <div className="d-flex gap-2">
          <Button
            className="rounded rounded-3"
            color="gray"
            onClick={ onModalClose }>Cancel</Button>
          <Button
            className="rounded rounded-3 text-white"
            color="primary"
            disabled={ (alertDetected?.value === "") ||
              ((actionTakens.data.length == 0) && (actionTakens?.newActionTakens.length == 0)) }
            onClick={ () : void => {
              onSubmit();
              onModalClose();
            } }>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RaiseAlertModal;
