import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useState
} from "react";
import { CgAdd } from "react-icons/cg";
import { FiPlus } from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { TiWarning } from "react-icons/ti";
import { RxDragHandleDots2 } from "react-icons/rx";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  List,
  Row,
  Tooltip
} from "reactstrap";

import CamerasGrid from "../common/CamerasGrid";
import CheckboxList from "components/CheckboxList";
import ConfirmationModal from "components/ConfirmationModal";
import NotifyMessageModal from "components/NotificationModal";
import AddCamerasTableModal from "../common/AddCamerasTableModal";

import { fetchUsers } from "services/user";
import { swapElements } from "utils/swap-elements";
import {
  CHECK_POINTS_IMAGE_LAYOUTS,
  CHECK_POINTS_VIDEO_LAYOUTS,
  PatrolViewModes,
  StartAllowTimeForPatrol
} from "data/common-data";
import {
  ConfirmationModalProps,
  NotificationModalProps
} from "model-type/component-style";
import SelectCustom from "components/SelectCustom";
import { CheckpointsState } from "data/types";
import { SiteResponse } from "@vps/utils/src/dto/site";
import { 
  CameraResponse,
  UserResponse 
} from "@vps/utils/lib/dto";

interface ComponentProps {
  // patrol route name
  patrolName : { name : string; onPatrolNameChange : (e : ChangeEvent<HTMLInputElement>) => void };
  // sites
  sites : SiteResponse[];
  site : { siteId : string; name ?: string; onSiteChange : (value : string) => void };
  // checkpoints
  checkpoints : CheckpointsState[];
  duplicatedCameras : string[];
  // assignees
  checkedUsers : UserResponse[];
  // start allow time
  startAllowTime : { value : number; onStartAllowTimeChange : (value : number) => void; }
  // patrol view mode
  patrolViewMode : { value : string; onPatrolViewModeChange : (value : string) => void; }
  // add cameras table
  addCamerasTable : {
    isOpen : boolean,
    isMaxCheckableCountReached : boolean,
    selectedSite : SiteResponse,
    checkedCameras : CameraResponse[],
    onAddCamerasTableToggle : (order : number, command : string) => void,
    onCameraRowCheckUncheck : (row : CameraResponse) => void,
    onCamerasAdd : () => void,
  }
  // modals
  confirmModal : ConfirmationModalProps,
  notifyModal : NotificationModalProps;
  onNotifyModalClose : () => void;
  // layout
  onLayoutChange : (e : React.ChangeEvent<HTMLInputElement>, order : number) => void;
  // checkpoints
  onCheckpointAdd : () => void;
  onCheckpointRemove : (e : MouseEvent<HTMLButtonElement>, order : number) => void;
  onCheckpointsSort : (sortedCheckpoints : CheckpointsState[]) => void;
  // cameras
  onCameraRemoveFromCheckpoint : (checkpointId : string | undefined, order : number, item : CameraResponse) => void;
  // assignees
  onUserSelect : (e : MouseEvent, user : UserResponse) => void;
  onUserUnselect : (e : React.MouseEvent, user : UserResponse) => void;
}

const Step1AddCheckpoints : React.FC<ComponentProps> = ({
  patrolName,
  sites,
  site,
  checkpoints,
  duplicatedCameras = [],
  checkedUsers,
  startAllowTime,
  patrolViewMode,
  addCamerasTable,
  confirmModal,
  notifyModal,
  onNotifyModalClose,
  onLayoutChange,
  onCheckpointAdd,
  onCheckpointRemove,
  onCheckpointsSort,
  onCameraRemoveFromCheckpoint,
  onUserSelect,
  onUserUnselect
} : ComponentProps) : JSX.Element => {
  // Assignees
  const [users,
    setUsers] = useState<UserResponse[]>([]);
  const [isUserLoading,
    setIsUserLoading] = useState(false);
  // Sortable list by dragging
  const [dragItemIndex,
    setDragItemIndex] = useState<number>(); // old position index
  const [dragOverItemIndex,
    setDragOverItemIndex] = useState<number>(); // new position index

  const layouts = Object.values(patrolViewMode.value ===
  "LiveImage" ? CHECK_POINTS_IMAGE_LAYOUTS : CHECK_POINTS_VIDEO_LAYOUTS).map((layout : string) => ({
    value : layout,
    label : layout
  }));

  // check if layout and checked cameras count match (layout 2x2, cameras count can't be more than 4)
  const checkLayoutAndCheckedCamerasMatch = (
    acceptableCamerasCount : number,
    checkedCamerasCount : number,
    order : number
  ) : JSX.Element | void => {
    let _layout = "";
    const checkpointIndex = checkpoints.findIndex((checkpoint : CheckpointsState) => checkpoint.setOrder === order);
    if (checkpointIndex >= 0)
      _layout = checkpoints[checkpointIndex].layoutRow + "x" + checkpoints[checkpointIndex].layoutCol;

    if (checkedCamerasCount > acceptableCamerasCount)
      return (
        <span className="text-warning">
          According to selected layout ({ _layout }), the maximum acceptable item count is{ " " }
          { acceptableCamerasCount }. Please select more wider layout or remove extra items. Otherwise, extra
          ones will be cut off when creating patrol route.
        </span>
      );
  };

  const getUsers = async () : Promise<void> => {
    const { data } = await fetchUsers(["Admin",
      "Officer"]);
    setUsers(data);
  };

  // --- Sortable List by dragging --- //
  const handleDragStart = (index : number) : void => {
    setDragItemIndex(index);
  };

  const handleDragOver = (e : React.DragEvent<HTMLElement>) : void => {
    !!e && e.preventDefault();
  };

  const handleDrop = () : void => {
    const _checkpoints = [...checkpoints];
    const sortedCheckpoints = swapElements(_checkpoints, dragItemIndex, dragOverItemIndex, "setOrder");
    onCheckpointsSort(sortedCheckpoints);
  };

  const handleDragEnter = (index : number) : void => {
    setDragOverItemIndex(index);
  };

  const handleDragEnd = () : void => {
    setDragItemIndex(undefined);
    setDragOverItemIndex(undefined);
  };

  // --- ⬇︎ UseEffects ⬇︎ --- //
  useEffect(() => {
    setIsUserLoading(true);
    getUsers().then(() => {
      setIsUserLoading(false);
    });
  }, []);

  return (
    <div className="container form-container p-4">
      <Form onSubmit={ () : void => console.log("onSubmit") }>
        {/* --- Patrol and Site --- */ }
        <Row xs="2">
          <FormGroup className="form-group  mb-4">
            <Label className="text-white">Patrol Name</Label>
            <Input
              value={ patrolName.name }
              onChange={ patrolName.onPatrolNameChange }
              bsSize="lg"
              type="text"
              className="bg-gray-999 text-white"
              placeholder="Patrol #1234"></Input>
          </FormGroup>

          <FormGroup className="form-group  mb-4">
            <Label className="text-white">Site</Label>
            <SelectCustom
              styles={{
                backgroundColor : "#343439",
                border : "1px solid #808080",
                width : "100%"
              }}
              popupTheme="dark"
              data={ sites }
              selectedValue={ site.siteId || "all" }
              displayedValue={ site?.name || "Select site" }
              renderOption={(item : SiteResponse) : JSX.Element => (
                <div className="d-flex justify-content-between align-items-center gap-4">
                  <span>{item.name}</span>
                  <span className="text-secondary">({item.noCameras} cameras)</span>
                </div>
              )}
              onChange={ site.onSiteChange } />
          </FormGroup>
        </Row>
        {/* --- End Patrol and Site --- */ }

        {/* --- Start allow time and Patrol view mode --- */ }
        <Row xs="2">
          <FormGroup className="form-group mb-3">
            <Label className="text-white">Patrol Start time Limit</Label>
            <SelectCustom
              styles={{
                backgroundColor : "#343439",
                border : "1px solid #808080",
                width : "100%"
              }}
              popupTheme="dark"
              data={ StartAllowTimeForPatrol }
              selectedValue={ startAllowTime.value.toString() || "all" }
              displayedValue={ StartAllowTimeForPatrol.find((time : { id : number, name : string }) => time.id === startAllowTime.value)?.name || "Select" }
              onChange={ startAllowTime.onStartAllowTimeChange } />
          </FormGroup>

          <FormGroup className="form-group mb-3">
            <Label className="text-white">Patrol View</Label>
            <SelectCustom
              styles={{
                backgroundColor : "#343439",
                border : "1px solid #808080",
                width : "100%"
              }}
              popupTheme="dark"
              data={ PatrolViewModes }
              selectedValue={ patrolViewMode.value.toString() || "all" }
              displayedValue={ PatrolViewModes.find((mode : { id : string, name : string }) => mode.id === patrolViewMode.value)?.name || "Select" }
              onChange={ patrolViewMode.onPatrolViewModeChange } />
          </FormGroup>
        </Row>

        {/* --- Patrol Check Points --- */ }
        <div className="d-flex align-items-center gap-3">
          <Label className="text-white">Patrol Checkpoints</Label>
          { duplicatedCameras.length > 0 ? <DuplicatedCameras data={ duplicatedCameras } /> : "" }
        </div>

        {/* START - Checkpoint rows */ }
        <div className="patrol-check-points-inner">
          <Row>
            <Col xs="auto"></Col>
            <Col md="2">
              <Label
                className="text-white"
                style={ {
                  marginLeft : "14px",
                  marginBottom : 0
                } }>
                Checkpoint
              </Label>
            </Col>
            <Col md="2">
              <Label
                className="text-white"
                style={ {
                  marginLeft : "14px",
                  marginBottom : 0
                } }>
                Layout
              </Label>
            </Col>
            <Col>
              <Label
                className="text-white"
                style={ {
                  marginLeft : "14px",
                  marginBottom : 0
                } }>
                Cameras
              </Label>
            </Col>
          </Row>

          <div className="draggable-container">
            { !!checkpoints &&
              Array.isArray(checkpoints) &&
              checkpoints.map((checkpoint : CheckpointsState, index : number) => {
                return (
                  <Row
                    key={ index }
                    className={ dragOverItemIndex === index ? "draggable-item next-position" : "draggable-item" }
                    draggable={ checkpoints.length > 1 }
                    onDragStart={ () : void => handleDragStart(index) }
                    onDragOver={ handleDragOver }
                    onDrop={ handleDrop }
                    onDragEnter={ () : void => handleDragEnter(index) }
                    onDragEnd={ handleDragEnd }>
                    <Col
                      xs="auto"
                      className="d-flex align-items-start">
                      <RxDragHandleDots2
                        color="white"
                        className="btn-drag"
                        title="Sort by dragging and dropping"
                      />
                    </Col>
                    <Col md="2">
                      <FormGroup className="form-group">
                        <div className="order text-white d-flex align-items-center">{ checkpoint.setOrder }</div>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup className="form-group">
                        <Input
                          bsSize="lg"
                          type="select"
                          className="bg-gray-999 text-white"
                          onChange={ (e : ChangeEvent<HTMLInputElement>) : void => onLayoutChange(e, checkpoint.setOrder) }
                          value={`${ checkpoint.layoutRow }x${ checkpoint.layoutCol }`}>
                          { !!layouts &&
                            Array.isArray(layouts) &&
                            layouts.map((layout : { value : string, label : string }) => (
                              <option
                                key={ layout.value }
                                value={ layout.value }>
                                { layout.label }
                              </option>
                            )) }
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="form-group">
                        <div className="d-flex gap-2 align-items-stretch">
                          <div className="input-cameras d-flex justify-content-between align-items-start gap-2 py-1">
                            <div className="d-flex align-items-center justify-contents-start gap-2">
                              { !!checkpoint.cameras && (
                                <CamerasGrid
                                  order={ checkpoint.setOrder }
                                  row={ checkpoint.layoutRow }
                                  col={ checkpoint.layoutCol }
                                  items={ checkpoint.cameras }
                                  onCameraRemove={ onCameraRemoveFromCheckpoint }
                                />
                              ) }
                            </div>
                            <Button
                              title="Add cameras"
                              onClick={ () : void => {
                                addCamerasTable.onAddCamerasTableToggle(checkpoint.setOrder, "");
                              } }
                              className="btn-open-cameras-table secondary text-white">
                              <FiPlus size={ 15 } />
                            </Button>
                          </div>
                          <div className="d-flex">
                            <Button
                              disabled={ checkpoints.length === 1 }
                              title="Remove checkpoint"
                              onClick={ (e : React.MouseEvent<HTMLButtonElement>) : void => onCheckpointRemove(e, checkpoint.setOrder) }
                              className="btn-remove-checkpoint rounded-3 text-white border border-1 border-gray p-1">
                              <div className="px-1">
                                <TbTrash size={ 15 } />
                              </div>
                            </Button>
                          </div>
                        </div>
                        { checkLayoutAndCheckedCamerasMatch(
                          checkpoint.layoutRow * checkpoint.layoutCol,
                          checkpoint.cameras.length,
                          checkpoint.setOrder
                        ) }
                      </FormGroup>
                    </Col>
                  </Row>
                );
              }) }
          </div>
          {/* END - Checkpoint rows */ }

          <div className="d-inline-block text-white btn-add-checkpoints pt-1">
            <div
              className="d-flex gap-2 align-items-center"
              onClick={ onCheckpointAdd }>
              <CgAdd
                size={ 18 }
                color="white" />
              Add check point
            </div>
          </div>
          {/* --- End Patrol Check Points --- */ }
        </div>

        {/* --- Assign Users  --- */ }
        <Row className="mt-4">
          <FormGroup className="form-group mb-3">
            <Label className="text-white">Assign to:</Label>
            <CheckboxList<UserResponse>
              // maxWidth="517px"
              selectedItemsShownOnTop={ true }
              isLoading={ isUserLoading }
              name="name"
              columns={ ["id",
                "name",
                "email"] }
              items={ users }
              checkedItems={ checkedUsers }
              search={ {
                placeholder : "Search by User name, email",
                searchColumns : [
                  "name",
                  "email"
                ]
              } }
              onItemChange={ onUserSelect }
              onItemRemove={ onUserUnselect }
            />
          </FormGroup>
        </Row>
        {/* --- End Assign Users --- */ }
      </Form>

      <AddCamerasTableModal
        isOpen={ addCamerasTable.isOpen }
        selectedSite={ addCamerasTable.selectedSite }
        isMaxCheckableCountReached={ addCamerasTable.isMaxCheckableCountReached }
        checkedCameras={ addCamerasTable.checkedCameras }
        onRowCheck={ addCamerasTable.onCameraRowCheckUncheck }
        onModalClose={ addCamerasTable.onAddCamerasTableToggle }
        onCamerasAdd={ addCamerasTable.onCamerasAdd }
      />

      <ConfirmationModal
        isOpen={ confirmModal.isOpen }
        message={ confirmModal.message }
        header={ confirmModal.header }
        close={ confirmModal.close }
        confirmBtnText={ confirmModal.confirmBtnText }
        confirm={ confirmModal.confirm }
      />

      <NotifyMessageModal
        isOpen={ notifyModal.isOpen }
        message={ notifyModal.message }
        header={ notifyModal.header }
        close={ onNotifyModalClose }
      />
    </div>
  );
};

export default Step1AddCheckpoints;

interface DuplicatedCamerasProps {
  data : string[]
}

const DuplicatedCameras : React.FC<DuplicatedCamerasProps> = ({ data } : DuplicatedCamerasProps) : JSX.Element => {
  const [isCheckpointWarningOpen,
    setIsCheckpointWarningOpen] = useState(false);
  const checkpointWarningToggle = () : void => setIsCheckpointWarningOpen(!isCheckpointWarningOpen);

  return (
    <div
      className="d-flex align-items-center gap-1 text-danger"
      style={ {
        cursor : "pointer",
        marginBottom : "0.5rem"
      } }>
      <TiWarning />
      <span
        style={ {
          textDecoration : "underline",
          textDecorationStyle : "dotted"
        } }
        id="checkpoint-warning">
        Duplicated cameras present!
      </span>
      <Tooltip
        placement="right"
        isOpen={ isCheckpointWarningOpen }
        target="checkpoint-warning"
        toggle={ checkpointWarningToggle }
        className="custom-tooltip">
        <div className="text-left">
          <List>
            Cannot add one or more of cameras into same layout of checkpoints.
            <ul>
              { data.map((d : string) : JSX.Element => <li key={ d }>{ d }</li>) }
            </ul>
          </List>
        </div>
      </Tooltip>
    </div>
  );
};
