import moment from "moment-timezone";
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from "react";
import {
  useParams,
  useLocation,
  useHistory
} from "react-router-dom";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

import VpsAppPage from "components/VpsAppPage";
import VpsAppBodyContainer from "components/VpsAppBodyContainer";
import Avatar from "components/Avatar";
import PageHeaderTitle from "components/PageHeaderTitle";
import LoadingSpinner from "components/LoadingSpinner";
import NotificationModal from "components/NotificationModal";
import ConfirmationModal from "components/ConfirmationModal";

import {
  changePassword,
  ChangePasswordError,
  fetchUserById,
  updateUserSelf,
  UserError
} from "services/user";
import { updateAccountProfile } from "model/user-account";
import {
  ConfirmationModalProps,
  NotificationModalProps
} from "model-type/component-style";
import { USER_LOGOUT_PATH } from "data/route-path";
import { UserResponse } from "@vps/utils/lib/dto";

function UserProfile() : JSX.Element {
  const history = useHistory();
  const { id } = useParams();
  const { isOwner } = useLocation().state;

  const [
    userProfile,
    setUserProfile
  ] = useState<UserResponse>(null);
  const [
    avatar,
    setAvatar
  ] = useState<string>(null);
  const [
    lastPwdChange,
    setLastPwdChange
  ] = useState<string>(null);
  const [
    changePwdError,
    setChangePwdError
  ] = useState<{
    invalidOldPwd : boolean,
    invalidNewPwd : boolean,
    wrongNewPwd : boolean,
    wrongOldOwd : boolean,
    unknown : boolean
  }>({
    invalidOldPwd : false,
    invalidNewPwd : false,
    wrongNewPwd : false,
    wrongOldOwd : false,
    unknown : false
  });
  const [
    formError,
    setFormError
  ] = useState<{
    invalidName : boolean,
    invalidEmail : boolean
  }>({
    invalidName : false,
    invalidEmail : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    isChangingPassword,
    setIsChangingPassword
  ] = useState<boolean>(false);
  const [
    isEditing,
    setIsEditing
  ] = useState<boolean>(false);
  const [
    notifyModal,
    setNotifyModal
  ] = useState<NotificationModalProps>({
    iconType : "notify",
    header : null,
    message : null,
    isOpen : false
  });
  const [
    confirmModal,
    setConfirmModal
  ] = useState<ConfirmationModalProps>({
    header : null,
    message : null,
    isOpen : false,
    confirm : null
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const callingCodeInputRef = useRef<HTMLInputElement>(null);
  const phoneNoInputRef = useRef<HTMLInputElement>(null);
  const oldPwdInputRef = useRef<HTMLInputElement>(null);
  const newPwdInputRef = useRef<HTMLInputElement>(null);
  const confirmNewPwdInputRef = useRef<HTMLInputElement>(null);

  const clearFormError = () : void => {
    setFormError({
      invalidName : false,
      invalidEmail : false
    });
  };

  const clearChangePwdError = () : void => {
    setChangePwdError({
      invalidOldPwd : false,
      invalidNewPwd : false,
      wrongNewPwd : false,
      wrongOldOwd : false,
      unknown : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    if (!isOwner) return;

    setLoading(true);

    if (isEditing) {
      const name = nameInputRef.current?.value;
      const callingCode = callingCodeInputRef.current?.value;
      const phoneNumber = phoneNoInputRef.current?.value;

      const {
        data : success,
        errors
      } = await updateUserSelf({
        name,
        callingCode,
        phoneNumber,
        avatarUrl : avatar
      });
      if (!success || errors) {
        setFormError({
          invalidName : errors[UserError.InvalidName],
          invalidEmail : errors[UserError.InvalidEmail]
        });
      } else {
        openNotifyModal("Edit Profile", "Profile has been updated!");
        setIsEditing(false);
        loadUser(id);
      }
    } else if (isChangingPassword) {
      const oldPwd = oldPwdInputRef.current?.value;
      const newPwd = newPwdInputRef.current?.value;
      const confirmNewPwd = confirmNewPwdInputRef.current?.value;

      const {
        data : success,
        errors
      } = await changePassword(oldPwd, newPwd, confirmNewPwd);
      if (!success || errors) {
        setChangePwdError({
          invalidOldPwd : errors[ChangePasswordError.InvalidOldPassword],
          invalidNewPwd : errors[ChangePasswordError.InvalidNewPassword],
          wrongOldOwd : errors[ChangePasswordError.WrongOldPassword],
          wrongNewPwd : errors[ChangePasswordError.NewPasswordNotMatch],
          unknown : errors[ChangePasswordError.Unknown]
        });
      } else {
        openNotifyModal("Change Password", "Password has been changed successfully!");
        setIsChangingPassword(false);
        loadUser(id);
      }
    }

    setLoading(false);
  };

  const openNotifyModal = (header : string, message : string, danger? : boolean) : void => {
    closeConfirmationModal();
    setNotifyModal({
      iconType : "success",
      color : "success",
      header,
      message : <div className="text-center text-black">{ message }</div>,
      isOpen : true,
      danger
    });
  };

  const closeNotifyModal = () : void => {
    setNotifyModal({
      header : null,
      message : null,
      isOpen : false,
      danger : false
    });
  };

  const openConfirmationModal = (header : string, message : string, onConfirm : () => void) : void => {
    closeNotifyModal();
    setConfirmModal({
      header,
      message,
      isOpen : true,
      confirm : () => {
        closeConfirmationModal();
        onConfirm && onConfirm();
      }
    });
  };

  const closeConfirmationModal = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      confirm : null
    });
  };

  const onCancel = () : void => {
    if (isEditing) {
      setIsEditing(false);
      clearFormError();
    }
    if (isChangingPassword) {
      setIsChangingPassword(false);
      clearChangePwdError();
    }
  };

  const openLogoutConfirmation = () : void => {
    openConfirmationModal("Logging out", "Are you sure to continue logging out?", onLogout);
  };

  const onLogout = () : void => {
    closeConfirmationModal();
    history && history.push(USER_LOGOUT_PATH);
  };

  const loadUser = async (userId : string, requiredLoading ? : boolean) : Promise<void> => {
    if (!userId) return;
    // load user
    requiredLoading && setLoading(true);
    const userProfile : UserResponse = await fetchUserById(userId);
    if (!!userProfile) {
      setUserProfile(userProfile);
      if (nameInputRef.current) nameInputRef.current.value = userProfile.name || "-";
      if (emailInputRef.current) emailInputRef.current.value = userProfile.email || "-";
      if (roleInputRef.current) roleInputRef.current.value = userProfile.role || "-";
      if (callingCodeInputRef.current) callingCodeInputRef.current.value = userProfile.callingCode || "-";
      if (phoneNoInputRef.current) phoneNoInputRef.current.value = userProfile.phoneNumber || "-";
      setLastPwdChange(userProfile.latestChangePassword);

      setAvatar(userProfile.avatar);
      updateAccountProfile(userProfile.name, userProfile.avatar);
    }
    requiredLoading && setLoading(false);
  };

  useEffect(() => {
    loadUser(id, true);
  }, [id]);

  useEffect(() => {
    if (!!userProfile && !isChangingPassword) {
      if (nameInputRef.current) nameInputRef.current.value = userProfile.name || "-";
      if (emailInputRef.current) emailInputRef.current.value = userProfile.email || "-";
      if (roleInputRef.current) roleInputRef.current.value = userProfile.role || "-";
      if (callingCodeInputRef.current) callingCodeInputRef.current.value = userProfile.callingCode || "-";
      if (phoneNoInputRef.current) phoneNoInputRef.current.value = userProfile.phoneNumber || "-";
    }
  }, [userProfile,
    isChangingPassword]);

  const inputClass = isEditing ? "bg-gray-999 text-white" : "bg-gray-900 text-primary";

  return (
    <VpsAppPage>
      <VpsAppBodyContainer id="user-profile-page">
        <PageHeaderTitle
          title="User Information"
          redirect={ { action : () => history.goBack() } } />

        <div className="table-container container">
          <div className="ms-auto d-flex align-items-center justify-content-end me-3">
            {
              !isEditing && !isChangingPassword ? (
                <div>
                  <Button
                    className="me-1"
                    color="primary"
                    onClick={ () : void => setIsEditing(true) }>
                    Edit
                  </Button>
                  <Button
                    className="me-1 text-white"
                    color="warning"
                    onClick={ () : void => setIsChangingPassword(true) }>
                    Change Password
                  </Button>
                  <Button
                    className="text-white"
                    color="gray"
                    onClick={ openLogoutConfirmation }>
                    Logout
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    className="me-1"
                    color="success"
                    onClick={ onSubmit }>
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    onClick={ onCancel }>
                    Cancel
                  </Button>
                </div>
              )
            }
          </div>

          {
            !isChangingPassword ? (
              <Form className="mx-3 row">
                <div className="col-auto">
                  <FormGroup>
                    <Avatar
                      id={ id }
                      avatarUrl={ avatar }
                      uploadCallback={ setAvatar }
                      imageOnly={ !isEditing }
                    />
                  </FormGroup>
                </div>
                <div className="col-10">
                  <FormGroup>
                    <div className="text-small mb-1">Name</div>
                    <Input
                      type="text"
                      bsSize="lg"
                      className={ inputClass }
                      disabled={ !isEditing }
                      innerRef={ nameInputRef }
                      invalid={ formError.invalidName }
                      onChange={ clearFormError }
                      maxLength={ 100 } />
                    { isEditing && formError.invalidName &&
                      <div className="text-small text-danger">Name is required</div> }
                  </FormGroup>
                  <FormGroup>
                    <div className="text-small mb-1">Email</div>
                    <Input
                      type="text"
                      bsSize="lg"
                      className="bg-gray-900 text-primary"
                      disabled={ true }
                      innerRef={ emailInputRef }
                      invalid={ formError.invalidEmail }
                      onChange={ clearFormError }
                      maxLength={ 100 } />
                    { isEditing && formError.invalidEmail &&
                      <div className="text-small text-danger">Email is invalid</div> }
                  </FormGroup>
                  <FormGroup>
                    <div className="text-small mb-1">Phone Number</div>
                    <div className="d-flex">
                      <div style={ { width : "80px" } }>
                        <Input
                          type="text"
                          bsSize="lg"
                          className={ inputClass }
                          disabled={ !isEditing }
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
                          type="text"
                          bsSize="lg"
                          className={ inputClass }
                          disabled={ !isEditing }
                          innerRef={ phoneNoInputRef }
                          onChange={ clearFormError }
                          maxLength={ 20 } />
                      </div>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="text-small mb-1">Role</div>
                    <Input
                      type="text"
                      bsSize="lg"
                      className="bg-gray-900 text-primary"
                      disabled={ true }
                      innerRef={ roleInputRef } />
                  </FormGroup>
                </div>
              </Form>
            ) : (
              <Form className="mx-3">
                <Label className="h4 mb-2">Change Password</Label>
                <FormGroup>
                  <div className="text-small mb-1">Old password</div>
                  <Input
                    type="password"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ oldPwdInputRef }
                    placeholder={ lastPwdChange ? `Last change at ${ moment(lastPwdChange).format("DD/MM/YYYY HH:mm") }` : "-" }
                    invalid={ changePwdError.invalidOldPwd || changePwdError.wrongOldOwd || changePwdError.unknown }
                    onChange={ clearChangePwdError }
                    maxLength={ 25 } />
                  {
                    changePwdError.invalidOldPwd &&
                    <div className="text-small text-danger">Old password is required</div>
                  }
                  {
                    changePwdError.wrongOldOwd &&
                    <div className="text-small text-danger">Old password is not correct!</div>
                  }
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">New password</div>
                  <Input
                    type="password"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ newPwdInputRef }
                    invalid={ changePwdError.invalidNewPwd || changePwdError.unknown }
                    onChange={ clearChangePwdError }
                    maxLength={ 25 } />
                  {
                    changePwdError.invalidNewPwd &&
                    <div className="text-small text-danger">Invalid New Password</div>
                  }
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">Confirm Password</div>
                  <Input
                    type="password"
                    bsSize="lg"
                    className="bg-gray-999 text-white"
                    innerRef={ confirmNewPwdInputRef }
                    invalid={ changePwdError.wrongNewPwd || changePwdError.unknown }
                    onChange={ clearChangePwdError }
                    maxLength={ 25 } />
                  {
                    changePwdError.wrongNewPwd &&
                    <div className="text-small text-danger">New password is not match!</div>
                  }
                  {
                    changePwdError.unknown &&
                    <div className="text-small text-danger">Somethings wrong...</div>
                  }
                </FormGroup>
                <div
                  className="mt-2 ml-2 text-success fw-bold"
                  style={ { lineHeight : "18px" } }>
                  MUST Include:
                  <ul
                    style={ {
                      listStyle : "disc",
                      marginLeft : "20px"
                    } }>
                    <li>Length between 8-25 characters</li>
                    <li>Upper case alphabet (A - Z)</li>
                    <li>Lower case alphabet (a - z)</li>
                    <li>Digits (0 - 9)</li>
                    <li>Special characters [ ! $ # % & @ ]</li>
                  </ul>
                </div>
              </Form>
            )
          }
        </div>

        <LoadingSpinner
          full
          active={ loading } />

        <NotificationModal
          color={ notifyModal.color }
          iconType={ notifyModal.iconType }
          isOpen={ notifyModal.isOpen }
          close={ closeNotifyModal }
          header={ notifyModal.header }
          message={ notifyModal.message }
        />

        <ConfirmationModal
          isOpen={ confirmModal.isOpen }
          close={ closeConfirmationModal }
          header={ confirmModal.header }
          message={ confirmModal.message }
          confirm={ confirmModal.confirm }
          confirmBtnText="Confirm"
        />
      </VpsAppBodyContainer>
    </VpsAppPage>
  );
}

export default memo(UserProfile);