import _ from "lodash";
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import { BsChevronLeft } from "react-icons/bs";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import LoadingSpinner from "components/LoadingSpinner";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  MdKeyboardArrowDown, MdKeyboardArrowUp
} from "react-icons/md";

import Badge from "components/Badge";
import AddCamerasTableModal from "pages/PatrolList/VirtualPatrolRouteCreate/common/AddCamerasTableModal";

import {
  SiteError,
  fetchSite,
  updateSite
} from "services/site";
import {
  CameraResponse, SiteResponse
} from "@vps/utils/lib/dto";
import { fetchCameras } from "services/camera";
import { TableSelectAllBehavior } from "data/common-data";

interface SiteSettingsDetailProps {
  siteId: string,
  onClose : () => void,
  onSuccess : () => void
}

function SiteSettingsDetail(props : SiteSettingsDetailProps) : JSX.Element {
  const {
    siteId,
    onClose,
    onSuccess
  } = props;
  const [isSiteLoading,
    setIsSiteLoading] = useState<boolean>(false);
  const [site,
    setSite] = useState<SiteResponse>(null);
  const [cameras,
    setCameras] = useState<CameraResponse[]>([]);
  const [allCameras,
    setAllCameras] = useState<CameraResponse[]>([]);
  const [isCameraModalOpen,
    setIsCameraModalOpen] = useState(false);
  const [checkedCameras,
    setCheckedCameras] = useState<CameraResponse[]>([]);
  const [checkedCamerasInTable,
    setCheckedCamerasInTable] = useState<CameraResponse[]>([]);
  const [
    formError,
    setFormError
  ] = useState<{
    invalidName : boolean,
    invalidDescription : boolean
  }>({
    invalidName : false,
    invalidDescription : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidName : false,
      invalidDescription : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const name = nameInputRef.current?.value;
    const description = descriptionInputRef.current?.value;
    const cameraIds = _.map(checkedCameras, "id");

    if (!!site) {
      const {
        data,
        errors
      } = await updateSite(site.id, name, description, cameraIds);
      if (!!data && !errors) {
        onSuccess && onSuccess();
      } else {
        setFormError({
          invalidName : errors[SiteError.InvalidName],
          invalidDescription : errors[SiteError.InvalidDescription]
        });
      }
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (descriptionInputRef.current) descriptionInputRef.current.value = "";
    onClose && onClose();
  };

  const handleCameraTableRowCheck = (_checkedCamera : CameraResponse, currentPage ?: number, paginatedList ?: CameraResponse[]) : void => {
    const isChecked = !_.isEmpty(checkedCamerasInTable.find((checkedRow : CameraResponse) => checkedRow.id ===
     _checkedCamera.id));

    if (!isChecked) {
      setCheckedCamerasInTable((prevChecked) => {
        const updatedChecked = [...prevChecked,
          _checkedCamera];
        const uniqueChecked = _.uniqBy(updatedChecked, "id");
        return uniqueChecked;
      });

      // i.e: Say current selected items in this page - 9, page size - 10, when select remaining 1 item, the global select should be checked.
      const updatedCheckedCameras = [...checkedCamerasInTable,
        _checkedCamera];
      const areAllArray1ItemsIncludedInArray2 = paginatedList.every(item1 => _.some(updatedCheckedCameras, item2 => item2.id === item1.id));
      if (areAllArray1ItemsIncludedInArray2) {
        onAllRowsInCurrentPageCheck({
          currentPage,
          items : paginatedList,
          status : "select"
        });
      }
    } else {
      setCheckedCamerasInTable(checkedCamerasInTable.filter((__checkedCamera : CameraResponse) => __checkedCamera.id !== _checkedCamera.id));
    }
  };

  // Unselect cameras from Select box view (not from Table)
  const handleCameraUnselect = (e, camera : CameraResponse) : void => {
    !!e && e.preventDefault();
    setCheckedCameras(checkedCameras.filter((checkedCamera : CameraResponse) => checkedCamera.id !== camera.id));
    setCheckedCamerasInTable(checkedCameras.filter((checkedCamera : CameraResponse) => checkedCamera.id !== camera.id));
  };

  const handleCamerasAssign = () : void => {
    const checkedItems = _.uniqBy(checkedCamerasInTable, "id");
    setCheckedCameras(checkedItems);
  };

  const handleCamerasAssignCancel = () : void => {
    setIsCameraModalOpen(!isCameraModalOpen);
  };

  const onAllRowsInCurrentPageCheck = ({
    currentPage, items, status
  }: { currentPage: number; items: any[]; status: "select" | "clear"}): void => {
    if (status === "select") {
      setCheckedCamerasInTable((prevValues) => _.uniqBy([...prevValues,
        ...items], "id"));
    } else if (status === "clear") {
      setCheckedCamerasInTable((prevValues : CameraResponse[]) => _.differenceBy(prevValues, items, "id"));
    }
  };

  const getSitesAndCameras = async () => {
    setIsSiteLoading(true);

    const _site = await fetchSite(siteId);
    if (!!_site) {
      setSite(_site);
      setCheckedCameras(_site?.cameras);
      setCheckedCamerasInTable(_site?.cameras);
      
      if (nameInputRef.current) nameInputRef.current.value = _site.name;
      if (descriptionInputRef.current) descriptionInputRef.current.value = _site.description;
    }

    const { data } = await fetchCameras();
    setCameras(data);
    setAllCameras(data);

    setIsSiteLoading(false);
  };

  useEffect(() => {
    getSitesAndCameras();
  }, [siteId]);

  return (
    <div className="table-container position-relative">
      <div className="d-flex ms-3 align-items-center mb-5">
        <h4 data-test="site-edit-page__heading" className="fw-bold">Site Detail</h4>
        <div
          className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
          onClick={ () : void => {
            onClose && onClose();
          } }>
          <BsChevronLeft />Return
        </div>
      </div>

      <Form>
        <FormGroup className="mx-3">
          <Label className="text-white">Site Name</Label>
          <Input
            data-test="input__name"
            type="text"
            bsSize="lg"
            className="bg-gray-999 text-white"
            innerRef={ nameInputRef }
            invalid={formError.invalidName }
            onChange={ onInputChange }
            maxLength={ 100 }/>
        </FormGroup>
        <FormGroup className="mx-3">
          <Label className="text-white">Site Description</Label>
          <Input
            data-test="input__description"
            type="text"
            bsSize="lg"
            className="bg-gray-999 text-white"
            innerRef={ descriptionInputRef }
            invalid={formError.invalidDescription }
            onChange={ onInputChange }
            maxLength={ 300 } />
        </FormGroup>
        <FormGroup className="mx-3">
          <Label className="text-white">Assigned Cameras</Label>
          <div className="checkbox-list-container text-white" style={{ maxWidth : "400px" }}>
            <div className="d-flex flex-column gap-2 align-items-stretch">
              <div
                className="outer-container">
                <div className="selected-items-container">
                  { checkedCameras?.length === 0 ? (
                    <div onClick={ () => setIsCameraModalOpen(true) }>Select</div>
                  ) : (
                    <PerfectScrollbar options={ {
                      suppressScrollX : true,
                      wheelPropagation : false
                    } }>
                      { checkedCameras.map((item : CameraResponse, index : number) => (
                        <Badge
                          key={ index }
                          text={ item.name }
                          noWrap={ true }
                          variant="secondary"
                          onRemove={ (e) : void => handleCameraUnselect(e, item) }
                        />
                      )) }
                    </PerfectScrollbar>
                  ) }
                </div>
                <div className="arrow-icon-container">
                  <div
                    data-test="input-checkbox-list__toggle"
                    className="btn-select"
                    onClick={ () => setIsCameraModalOpen(true) }>
                    { isCameraModalOpen ? <MdKeyboardArrowUp size={ 20 } /> : <MdKeyboardArrowDown size={ 20 } /> }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormGroup>
        <div className="d-flex align-items-center justify-content-end mt-5 mx-3">
          <Button
            data-test="btn-save"
            className="me-1"
            color="primary"
            onClick={ onSubmit }>
            Save
          </Button>
          <Button
            color="secondary"
            onClick={ onCancel }>
            Cancel
          </Button>
        </div>
      </Form>
      <LoadingSpinner full active={ loading } />

      <AddCamerasTableModal
        isOpen={ isCameraModalOpen }
        isSelectAllEnabled={ true }
        isMaxCheckableCountReached={ false }
        selectAllBehavior={ TableSelectAllBehavior.CURRENT_PAGE }
        checkedCameras={ checkedCamerasInTable }
        selectedSite={ null }
        submitButtonLabel={ "Assign" }
        onRowCheck={ handleCameraTableRowCheck }
        onModalClose={ handleCamerasAssignCancel }
        onCamerasAdd={ handleCamerasAssign }
        onAllRowsInCurrentPageCheck={ onAllRowsInCurrentPageCheck }
      />
    </div>
  );
}

export default memo(SiteSettingsDetail);