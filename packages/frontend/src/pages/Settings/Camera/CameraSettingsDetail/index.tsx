import _ from "lodash";
import React, {
  memo,
  useEffect,
  useRef,
  useState,
  MouseEvent
} from "react";
import { BsChevronLeft } from "react-icons/bs";
import {
  Button,
  FormGroup,
  Input
} from "reactstrap";
import LoadingSpinner from "components/LoadingSpinner";
import SOPLabel from "../SOPLabel";
import CheckboxList from "components/CheckboxList";
import { FindAndCountResponse } from "@vps/utils/lib/data";
import {
  CameraResponse,
  SiteResponse,
  SopResponse
} from "@vps/utils/lib/dto";
import { OptionData } from "model-type/service";
import { fetchSites } from "services/site";
import { updateCamera } from "services/camera";
import { fetchSops } from "services/sop";

interface CameraSettingsDetailProps {
  camera : CameraResponse,
  onClose : () => void,
  onSuccess : () => void
}

function CameraSettingsDetail(props : CameraSettingsDetailProps) : JSX.Element {
  const {
    camera,
    onClose,
    onSuccess
  } = props;
  const [
    isEditing,
    setIsEditing
  ] = useState<boolean>(false);
  const [
    formError,
    setFormError
  ] = useState<{ invalidName : boolean }>({ invalidName : false });
  const [
    sites,
    setSites
  ] = useState<OptionData<string>[]>([]);
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    selectedSops,
    setSelectedSops
  ] = useState<SopResponse[]>([]);
  const [
    sops,
    setSops
  ] = useState<SopResponse[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const siteInputRef = useRef<HTMLInputElement>(null);

  const loadSiteOptions = () : void => {
    fetchSites().then((result : FindAndCountResponse<SiteResponse>) => {
      if (!!result) {
        const siteOptions : OptionData<string>[] = result.data.map((aSite : SiteResponse) => {
          return {
            name : aSite.name,
            value : aSite.id
          };
        });
        setSites(siteOptions);
      }
    });
  };

  const onInputChange = () : void => {
    setFormError({ invalidName : false });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const name = nameInputRef.current?.value;
    const siteId = siteInputRef.current?.value;
    const sopIds = selectedSops.map((aSop : SopResponse) => aSop.id);
    const {
      data,
      errors
    } = await updateCamera(camera.id, name, siteId, sopIds);
    if (data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({ invalidName : errors["InvalidName"] });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (siteInputRef.current) siteInputRef.current.value = "0";

    setIsEditing(false);
  };

  const onSopSelect = (e : MouseEvent, sop : SopResponse) : void => {
    !!e && e.preventDefault();

    const isChecked = !_.isEmpty(selectedSops.find((aSop : SopResponse) => aSop.id === sop.id));
    if (!isChecked) {
      setSelectedSops((prevChecked : SopResponse[]) => [
        ...prevChecked,
        sop
      ]);
    } else setSelectedSops(selectedSops.filter((aSop : SopResponse) => aSop.id !== sop.id));
  };

  // unselect user
  const onSopRemove = (e : MouseEvent, sop : SopResponse) : void => {
    !!e && e.preventDefault();
    setSelectedSops(selectedSops.filter((aSop : SopResponse) => aSop.id !== sop.id));
  };

  useEffect(() => {
    if (!!camera && isEditing) {
      if (nameInputRef.current) nameInputRef.current.value = camera.name;
      if (siteInputRef.current) siteInputRef.current.value = camera.siteId + "";
      setSelectedSops(camera.sops);
    }
  }, [
    isEditing,
    camera
  ]);

  useEffect(() => {
    loadSiteOptions();
    fetchSops().then((data : FindAndCountResponse<SopResponse>) => setSops(data.data));
  }, []);

  return (
    <div className="table-container position-relative p-4">
      <div className="d-flex align-items-center mb-4">
        <h4 data-test="camera-details-page__heading" className="fw-bold">Camera Detail</h4>
        <div
          className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
          onClick={ () : void => {
            onClose && onClose();
          } }>
          <BsChevronLeft />Return
        </div>

        <div className="ms-auto d-flex align-items-center justify-content-end">
          {
            isEditing ?
              <div>
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
              </div> :
              <div>
                <Button
                  data-test="btn-edit"
                  className="me-1"
                  color="primary"
                  onClick={ () : void => setIsEditing(true) }>
                  Edit
                </Button>
              </div>
          }
        </div>
      </div>

      <div>
        <div className="mb-3">
          <div className="text-small mb-1">Camera</div>
          {
            isEditing ?
              <Input
                data-test="input__name"
                type="text"
                bsSize="lg"
                className="bg-gray-999 text-white"
                innerRef={ nameInputRef }
                invalid={ formError.invalidName }
                onChange={ onInputChange }
                maxLength={ 100 } />
              : <h5 data-test="camera-details__name" className="mt-2">{ camera?.name || "-" }</h5>
          }
        </div>

        <div className="mb-3">
          <div className="text-small mb-1">ID</div>
          {
            isEditing ?
              <Input
                type="text"
                bsSize="lg"
                className="bg-gray-900 text-white"
                value={ camera?.id || "-" }
                disabled
              />
              : <h5 data-test="camera-details__id" className="mt-2">{ camera?.id || "-" }</h5>
          }
        </div>

        <div className="mb-3">
          <div className="text-small mb-1">Site</div>
          {
            isEditing ?
              <Input
                data-test="input-select__site"
                type="select"
                bsSize="lg"
                className="bg-gray-999 text-white"
                innerRef={ siteInputRef }
                onChange={ onInputChange }>
                <option value={ 0 }>Unassigned</option>
                {
                  sites.map((anOpt : OptionData<string>) => {
                    const {
                      name,
                      value
                    } = anOpt;
                    return <option
                      key={ value }
                      value={ value + "" }>{ name }</option>;
                  })
                }
              </Input>
              : <h5 data-test="camera-details__site-name" className="mt-2">{ camera?.siteName || "-" }</h5>
          }
        </div>

        <div className="mb-3">
          <div className="text-small">SOP</div>
          {
            isEditing ? (
              <FormGroup>
                <CheckboxList<SopResponse>
                  maxWidth="400px"
                  selectedItemsShownOnTop={ true }
                  isLoading={ loading }
                  name="name"
                  columns={ ["name"] }
                  items={ sops }
                  checkedItems={ selectedSops }
                  onItemChange={ onSopSelect }
                  onItemRemove={ onSopRemove }
                  search={ {
                    placeholder : "Search by name",
                    searchColumns : ["name"]
                  } }/>
              </FormGroup>
            ) : (
              <div data-test="camera-details__sop-list" className="d-flex align-items-center mt-2">
                {
                  !camera?.sops ? <div className="text-secondary">None</div> : (
                    camera.sops.map((aSop : SopResponse) => {
                      return <SOPLabel
                        key={ aSop.id }
                        sop={ aSop.name } />;
                    })
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      <LoadingSpinner
        full
        active={ loading } />
    </div>
  );
}

export default memo(CameraSettingsDetail);