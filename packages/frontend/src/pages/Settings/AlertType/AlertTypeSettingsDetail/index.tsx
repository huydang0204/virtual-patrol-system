import React, {
  ChangeEvent,
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import { BsChevronLeft } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import {
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import LoadingSpinner from "components/LoadingSpinner";
import Avatar from "components/Avatar";

import { AlertTypeResponse } from "@vps/utils/lib/dto";
import {
  AlertTypeError,
  updateAlertType
} from "services/alert-types";

interface AlertTypeSettingsDetailProps {
  alertType : AlertTypeResponse,
  onClose : () => void,
  onSuccess : () => void
}

function AlertTypeSettingsDetail(props : AlertTypeSettingsDetailProps) : JSX.Element {
  const {
    alertType,
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{
    invalidType : boolean,
    duplicatedType : boolean,
    invalidDescription : boolean,
    invalidActionTaken : boolean,
    invalidImageUrl : boolean
  }>({
    invalidType : false,
    duplicatedType : false,
    invalidDescription : false,
    invalidActionTaken : false,
    invalidImageUrl : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    actionTaken,
    setActionTaken
  ] = useState<string[]>([""]);
  const [
    description,
    setDescription
  ] = useState<string>("");
  const [
    imageUrl,
    setImageUrl
  ] = useState<string>(null);
  const [
    isEditing,
    setIsEditing
  ] = useState<boolean>(false);

  const typeInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidType : false,
      duplicatedType : false,
      invalidDescription : false,
      invalidActionTaken : false,
      invalidImageUrl : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const type = typeInputRef.current?.value;

    const {
      data,
      errors
    } = await updateAlertType(alertType.id, type, description, actionTaken, imageUrl);
    if (!!data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({
        invalidType : errors[AlertTypeError.InvalidType],
        duplicatedType : errors[AlertTypeError.DuplicatedType],
        invalidDescription : errors[AlertTypeError.InvalidDescription],
        invalidActionTaken : errors[AlertTypeError.InvalidActionTaken],
        invalidImageUrl : errors[AlertTypeError.InvalidImageUrl]
      });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (typeInputRef.current) typeInputRef.current.value = "";
    setActionTaken([]);
    setIsEditing(false);
    onClose && onClose();
  };

  const onActionChange = (value : string, index : number) : void => {
    setActionTaken((prevActions : string[]) => {
      prevActions[index] = value;
      return [...prevActions];
    });
  };

  const onActionAdd = () : void => {
    setActionTaken((prevActions : string[]) => {
      return [
        ...prevActions,
        ""
      ];
    });
  };

  const onActionRemove = (id : number) : void => {
    setActionTaken((prevActions : string[]) => {
      prevActions.splice(id, 1);
      return [...prevActions];
    });
  };

  useEffect(() => {
    onInputChange();
  }, [
    isEditing
  ]);

  useEffect(() => {
    if (!!alertType) {
      setActionTaken([...alertType.actionTaken]);
      setDescription(alertType.description);
      setImageUrl(alertType.imageUrl);
      if (isEditing) {
        if (typeInputRef.current) typeInputRef.current.value = alertType.type;
      }
    }
  }, [
    isEditing,
    alertType
  ]);

  return (
    <div className="table-container position-relative">
      <div className="d-flex mx-3 align-items-center mb-5">
        <h4 data-test="alert-type-details-page__heading" className="fw-bold">Alert Type Detail</h4>
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

      <Form className="mx-3 row">
        <div className="col-auto">
          <FormGroup>
            <Avatar
              id={ alertType?.id }
              avatarUrl={ imageUrl }
              uploadCallback={ setImageUrl }
              imageOnly={ !isEditing }
              invalid={ formError.invalidImageUrl }
            />
          </FormGroup>
        </div>
        <div className="col-10">
          <FormGroup>
            <div className="text-small mb-1">Alert Type</div>
            {
              isEditing ? <Input
                data-test="alert-type-input__type"
                type="text"
                bsSize="lg"
                className="bg-gray-999 text-white"
                disabled={ !isEditing }
                innerRef={ typeInputRef }
                invalid={ formError.invalidType || formError.duplicatedType }
                onChange={ onInputChange }
                maxLength={ 100 } />
                : <h5 data-test="alert-type-details__name" className="mt-2">{ alertType?.type || "-" }</h5>
            }
            { isEditing && formError.invalidType && <div className="text-small text-danger">Type is required</div> }
            { isEditing && formError.duplicatedType &&
              <div className="text-small text-danger">This type is used. Please try another type.</div> }
          </FormGroup>
          <FormGroup>
            <div className="text-small mb-1">Description</div>
            {
              isEditing ?
                <Input
                  data-test="alert-type-input__description"
                  type="textarea"
                  value={ description }
                  onChange={ (e : ChangeEvent<HTMLInputElement>) : void => setDescription(e.target.value) }
                  className="bg-gray-999 text-white" />
                :
                <h5 data-test="alert-type-details__description" className="mt-2">{ alertType?.description || "-" }</h5>
            }
            { isEditing && formError.invalidDescription && <div className="text-danger">Description is required!</div> }
          </FormGroup>
          <FormGroup>
            <div data-test="alert-type-details__action-taken" className="text-small mb-2">Action taken</div>
            {
              actionTaken.map((checklist : string, id : number) => {
                return isEditing ? (
                  <div
                    key={ id }
                    className="d-flex align-items-center mb-1">
                    <Input
                      data-test={`alert-type-input__check-list-${id}`}
                      type="text"
                      bsSize="lg"
                      className="bg-gray-999 text-white"
                      value={ checklist }
                      invalid={ formError.invalidActionTaken }
                      onChange={ (e : ChangeEvent<HTMLInputElement>) : void => onActionChange(e.target.value, id) }
                      maxLength={ 100 } />
                    { actionTaken.length > 1 && <h5
                      onClick={ () : void => onActionRemove(id) }
                      className="ms-1 text-danger cursor-pointer"
                    >X</h5> }
                  </div>
                ) : (
                  <div
                    key={ id }
                    className="mt-1">
                    &#8226;
                    { " " }
                    { checklist }
                  </div>
                );
              })
            }
            {
              isEditing && <div className="d-inline-block text-white cursor-pointer mt-1 text-gray">
                <div
                  className="d-flex align-items-center"
                  onClick={ onActionAdd }>
                  <CgAdd
                    size={ 15 }
                    color="gray" />
                  <div data-test="alert-type-input__add-action" className="text-small ms-1">Add action</div>
                </div>
              </div>
            }
            { isEditing && formError.invalidActionTaken && <div className="text-danger">Actions are required!</div> }
          </FormGroup>
        </div>
      </Form>
      <LoadingSpinner
        full
        active={ loading } />
    </div>
  );
}

export default memo(AlertTypeSettingsDetail);