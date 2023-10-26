import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Button,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import { BsChevronLeft } from "react-icons/bs";

import LoadingSpinner from "components/LoadingSpinner";
import Avatar from "components/Avatar";

import {
  UserError, createUser
} from "services/user";
import { SYSTEM_ROLE_ID } from "@vps/utils/lib/data";

interface UserDetailsProps {
  onClose : () => void,
  onSuccess : () => void
}

function UserCreate(props : UserDetailsProps) : JSX.Element {
  const {
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{ 
    invalidName : boolean, 
    invalidEmail : boolean,
    duplicatedEmail : boolean,
  }>({
    invalidName : false,
    invalidEmail : false,
    duplicatedEmail : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    name,
    setName
  ] = useState<string>(null);
  const [
    avatar,
    setAvatar
  ] = useState<string>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const callingCodeInputRef = useRef<HTMLInputElement>(null);
  const phoneNoInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidName : false,
      invalidEmail : false,
      duplicatedEmail : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);

    const name = nameInputRef.current?.value || "";
    const email = emailInputRef.current?.value || "";
    const callingCode = callingCodeInputRef.current?.value || "";
    const phoneNumber = phoneNoInputRef.current?.value || "";
    const roleId = roleInputRef.current?.value || "";

    console.group("create user");
    console.log(typeof callingCode);
    console.log(typeof phoneNumber);
    console.log(typeof roleId);

    const {
      data,
      errors
    } = await createUser({
      name,
      email,
      roleId,
      callingCode,
      phoneNumber,
      avatarUrl : avatar
    });
    if (!!data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({
        invalidName : errors[UserError.InvalidName],
        invalidEmail : errors[UserError.InvalidEmail],
        duplicatedEmail : errors[UserError.DuplicatedEmail]
      });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (emailInputRef.current) emailInputRef.current.value = "";
    if (callingCodeInputRef.current) callingCodeInputRef.current.value = "";
    if (phoneNoInputRef.current) phoneNoInputRef.current.value = "";

    onClose && onClose();
  };

  const clearFormError = () : void => {
    setFormError({
      invalidName : false,
      invalidEmail : false,
      duplicatedEmail : false
    });
  };

  useEffect(() => {
    onInputChange();
  }, []);

  return (
    <div className="d-flex row g-3">
      <div className="col-12">
        <div className="table-container position-relative">
          <div className="d-flex mx-3 align-items-center mb-5">
            <h4 data-test="user-create-page__heading" className="fw-bold">Create new user</h4>
            <div
              className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
              onClick={ onCancel }>
              <BsChevronLeft />Return
            </div>

            <div className="ms-auto d-flex align-items-center justify-content-end">
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
          </div>
        
          <div className="row">
            <Form className="mx-3 row">
              <div className="col-auto">
                <FormGroup>
                  <Avatar
                    id=""
                    avatarUrl={ avatar }
                    uploadCallback={ setAvatar }
                    imageOnly={ false }
                  />
                </FormGroup>
              </div>
              <div className="col-10">
                <FormGroup>
                  <div className="text-small mb-1">Name</div>
                  <Input
                    data-test="user-details-page__name"
                    type="text"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ nameInputRef }
                    invalid={ formError.invalidName }
                    onChange={ clearFormError }
                    maxLength={ 100 } />
                  { formError.invalidName && <div className="text-small text-danger">Name is required</div> }
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">Email</div>
                  <Input
                    data-test="user-details-page__email"
                    type="text"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ emailInputRef }
                    invalid={ formError.invalidEmail }
                    onChange={ clearFormError }
                    maxLength={ 100 } />
                  { formError.invalidEmail && <div className="text-small text-danger">Email is invalid</div> }
                  { formError.duplicatedEmail && <div className="text-small text-danger">Email is used. Please try another email.</div> }
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">Phone Number</div>
                  <div className="d-flex">
                    <div style={ { width : "80px" } }>
                      <Input
                        data-test="user-details-page__callingCode"
                        type="text"
                        bsSize="lg"
                        className="bg-gray-999 text-white"
                        innerRef={ callingCodeInputRef }
                        onChange={ clearFormError }
                        maxLength={ 4 } />
                    </div>
                    <div
                      style={ {
                        marginLeft : "10px",
                        width : "310px"
                      } }>
                      <Input
                        data-test="user-details-page__phone"
                        type="text"
                        bsSize="lg"
                        className="bg-gray-999 text-white"
                        innerRef={ phoneNoInputRef }
                        onChange={ clearFormError }
                        maxLength={ 20 } />
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">Role</div>
                  <Input
                    type="select"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ roleInputRef }
                    onChange={ clearFormError }
                    maxLength={ 100 }>
                    {
                      Object.keys(SYSTEM_ROLE_ID).map((role : string) => {
                        const id = SYSTEM_ROLE_ID[role];
                        return (
                          <option
                            key={ id }
                            value={ id }>
                            { role }
                          </option>
                        );
                      })
                    }
                  </Input>
                </FormGroup>
              </div>
            </Form>
          </div>
          <LoadingSpinner
            full
            active={ loading } />
        </div>
      </div>
    </div>
  );
}

export default memo(UserCreate);