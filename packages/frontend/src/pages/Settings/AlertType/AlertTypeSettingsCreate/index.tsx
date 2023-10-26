import React, {
  ChangeEvent,
  memo,
  useRef,
  useState
} from "react";
import { BsChevronLeft } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

import LoadingSpinner from "components/LoadingSpinner";
import Avatar from "components/Avatar";

import {
  AlertTypeError,
  createAlertType
} from "services/alert-types";

interface CreateAlertTypeSettingsProps {
  onClose : () => void,
  onSuccess : () => void
}

function CreateAlertTypeSettings(props : CreateAlertTypeSettingsProps) : JSX.Element {
  const {
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{
    invalidType : boolean,
    duplicatedType : boolean,
    invalidDescription : boolean
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
    loading,
    setLoading
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
    } = await createAlertType(type, description, actionTaken, imageUrl);
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
    setActionTaken([""]);
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

  return (
    <div className="table-container position-relative">
      <div className="d-flex ms-3 align-items-center mb-5">
        <h4 className="fw-bold">Create Alert Type</h4>
        <div
          className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
          onClick={ () : void => {
            onClose && onClose();
          } }>
          <BsChevronLeft />Return
        </div>
      </div>

      <Form className="mx-3 row">
        <div className="col-auto">
          <FormGroup>
            <Avatar
              id="alert-type-creating"
              avatarUrl={ imageUrl }
              uploadCallback={ setImageUrl }
              imageOnly={ false }
              invalid={ formError.invalidImageUrl }
            />
          </FormGroup>
        </div>
        <div className="col-10">
          <FormGroup>
            <Label className="text-white">Alert Type</Label>
            <Input
              type="text"
              bsSize="lg"
              className="bg-gray-999 text-white"
              innerRef={ typeInputRef }
              invalid={ formError.invalidType || formError.duplicatedType }
              onChange={ onInputChange }
              maxLength={ 100 } />
            { formError.invalidType && <div className="text-small text-danger">Type is required</div> }
            { formError.duplicatedType &&
              <div className="text-small text-danger">This type is used. Please try another type.</div> }
          </FormGroup>
          <FormGroup>
            <div className="text-small mb-1">Description</div>
            <Input
              type="textarea"
              value={ description }
              onChange={ (e : ChangeEvent<HTMLInputElement>) : void => setDescription(e.target.value) }
              className="bg-gray-999 text-white" />
            { formError.invalidDescription && <div className="text-danger">Description is required!</div> }
          </FormGroup>
          <FormGroup>
            <Label className="text-white">Action Taken</Label>
            {
              actionTaken.map((action : string, id : number) => {
                return (
                  <div
                    key={ id }
                    className="d-flex align-items-center mb-1">
                    <Input
                      type="text"
                      bsSize="lg"
                      className="bg-gray-999 text-white"
                      invalid={ formError.invalidActionTaken }
                      value={ action }
                      onChange={ (e : ChangeEvent<HTMLInputElement>) : void => onActionChange(e.target.value, id) }
                      maxLength={ 100 } />
                    { actionTaken.length > 1 && <h5
                      onClick={ () : void => onActionRemove(id) }
                      className="ms-1 text-danger fw-bold cursor-pointer"
                    >X</h5> }
                  </div>
                );
              })
            }
            <div className="d-inline-block text-white cursor-pointer mt-1 text-gray">
              <div
                className="d-flex align-items-center"
                onClick={ onActionAdd }>
                <CgAdd
                  size={ 15 }
                  color="gray" />
                <div className="text-small ms-1">Add action</div>
              </div>
            </div>
            { formError.invalidActionTaken && <div className="text-danger">Actions are required!</div> }
          </FormGroup>
        </div>
        <div className="d-flex align-items-center justify-content-end mt-5 mx-3">
          <Button
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
      <LoadingSpinner
        full
        active={ loading } />
    </div>
  );
}

export default memo(CreateAlertTypeSettings);