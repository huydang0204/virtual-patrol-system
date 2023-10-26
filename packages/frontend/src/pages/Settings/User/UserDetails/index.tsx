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
  Input
} from "reactstrap";
import LoadingSpinner from "components/LoadingSpinner";
import Avatar from "components/Avatar";

import {
  UserError,
  activateUser,
  blockUser,
  deleteUser,
  updateUser
} from "services/user";
import RecentActivities from "../RecentActivities";
import ConfirmationModal from "components/ConfirmationModal";
import NotifyMessageModal from "components/NotificationModal";
import useUserAccount from "../../../../hooks/useUserAccount";

import {
  ConfirmationModalProps,
  NotificationModalProps
} from "model-type/component-style";
import { 
  SYSTEM_ROLE_ID,
  USER_ROLE 
} from "@vps/utils/lib/data";
import { UserStatus } from "@vps/utils/lib/data";
import { UserResponse } from "@vps/utils/lib/dto";

interface UserDetailsProps {
  user : UserResponse,
  onClose : () => void,
  onSuccess : () => void
}

function UserDetails(props : UserDetailsProps) : JSX.Element {
  const { accountId : loginUserId } = useUserAccount();
  const {
    user,
    onClose,
    onSuccess
  } = props;
  const [
    formError,
    setFormError
  ] = useState<{
    invalidName : boolean,
    invalidEmail : boolean,
  }>({
    invalidName : false,
    invalidEmail : false
  });
  const [
    loading,
    setLoading
  ] = useState<boolean>(false);
  const [
    userId,
    setUserId
  ] = useState<string>(null);
  const [
    avatar,
    setAvatar
  ] = useState<string>(null);
  const [
    userStatus,
    setUserStatus
  ] = useState<UserStatus>(null);
  const [
    isEditing,
    setIsEditing
  ] = useState<boolean>(false);
  const [notifyModal,
    setNotifyModal] = useState<NotificationModalProps>({
      color : "primary",
      iconType : "notify",
      header : null,
      message : null,
      isOpen : false
    });
  const [confirmModal,
    setConfirmModal] = useState<ConfirmationModalProps>({
      header : null,
      message : null,
      isOpen : false,
      footerMessage : "",
      confirm : null,
      confirmBtnText : "Add",
      close : null
    });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const callingCodeInputRef = useRef<HTMLInputElement>(null);
  const phoneNoInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () : void => {
    setFormError({
      invalidName : false,
      invalidEmail : false
    });
  };

  const onSubmit = async () : Promise<void> => {
    setLoading(true);
    const name = nameInputRef.current?.value || "";
    const callingCode = callingCodeInputRef.current?.value || "";
    const phoneNumber = phoneNoInputRef.current?.value || "";
    const roleId = roleInputRef.current?.value || "";

    const {
      data,
      errors
    } = await updateUser(user.id, {
      name,
      callingCode,
      phoneNumber,
      roleId,
      avatarUrl : avatar
    });
    if (!!data && !errors) {
      onSuccess && onSuccess();
    } else {
      setFormError({
        invalidName : errors[UserError.InvalidName],
        invalidEmail : errors[UserError.InvalidEmail]
      });
    }
    setLoading(false);
  };

  const onCancel = () : void => {
    if (nameInputRef.current) nameInputRef.current.value = "";
    if (callingCodeInputRef.current) callingCodeInputRef.current.value = "";
    if (phoneNoInputRef.current) phoneNoInputRef.current.value = "";

    setIsEditing(false);
  };

  const clearFormError = () : void => {
    setFormError({
      invalidName : false,
      invalidEmail : false
    });
  };

  const handleUserActivate = async () : Promise<void> => {
    setLoading(true);

    const activated = await activateUser(userId);
    if (activated) {
      setUserStatus(UserStatus.active);
      handleConfirmModalClose();
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Done",
        message : <div className="text-center text-black">User activated successfully.</div>,
        isOpen : true,
        close : () => {
          handleNotifyModalClose();
        }
      });
    }

    setLoading(false);
  };

  const handleUserBlock = async () : Promise<void> => {
    setLoading(true);

    const blocked = await blockUser(userId);
    if (blocked) {
      setUserStatus(UserStatus.blocked);
      handleConfirmModalClose();
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Done",
        message : <div className="text-center text-black">User blocked successfully.</div>,
        isOpen : true,
        close : () => {
          handleNotifyModalClose();
        }
      });
    }

    setLoading(false);
  };

  const handleUserDelete = async () : Promise<void> => {
    setLoading(true);

    const deleted = await deleteUser(userId);
    if (deleted) {
      handleConfirmModalClose();
      setNotifyModal({
        iconType : "success",
        color : "success",
        header : "Done",
        message : <div className="text-center text-black">User deleted successfully.</div>,
        isOpen : true,
        close : () => {
          handleNotifyModalClose();
          onClose();
        }
      });
    }

    setLoading(false);
  };

  const openDeleteConfirmationModal = () : void => {
    setConfirmModal({
      header : "Delete user",
      message : "Are you sure to delete this user?",
      isOpen : true,
      confirmBtnText : "Delete",
      confirm : () => handleUserDelete(),
      close : handleConfirmModalClose
    });
  };

  const openBlockConfirmationModal = () : void => {
    setConfirmModal({
      header : "Block user access",
      message : "Are you sure to block this user?",
      isOpen : true,
      confirmBtnText : "Block",
      confirm : () => handleUserBlock(),
      close : handleConfirmModalClose
    });
  };

  const openActivateConfirmationModal = () : void => {
    setConfirmModal({
      header : "Activate user access",
      message : "Are you sure to activate this user?",
      isOpen : true,
      confirmBtnText : "Activate",
      confirm : () => handleUserActivate(),
      close : handleConfirmModalClose
    });
  };

  const handleNotifyModalClose = () : void => {
    setNotifyModal({
      color : "",
      header : null,
      message : null,
      isOpen : false
    });
  };

  const handleConfirmModalClose = () : void => {
    setConfirmModal({
      header : null,
      message : null,
      isOpen : false,
      footerMessage : "",
      confirmBtnText : "",
      confirm : null
    });
  };

  useEffect(() => {
    onInputChange();
  }, [
    isEditing
  ]);

  useEffect(() => {
    if (!!user) {
      if (nameInputRef.current) nameInputRef.current.value = user.name || "";
      if (emailInputRef.current) emailInputRef.current.value = user.email || "";
      if (roleInputRef.current) roleInputRef.current.value = user?.roleId || SYSTEM_ROLE_ID[USER_ROLE.Officer];
      if (callingCodeInputRef.current) callingCodeInputRef.current.value = user.callingCode || "+65";
      if (phoneNoInputRef.current) phoneNoInputRef.current.value = user.phoneNumber || "";

      setUserId(user?.id);
      setAvatar(user?.avatar);
      setUserStatus(UserStatus[user?.status]);

      if (isEditing) {
        if (nameInputRef.current) nameInputRef.current.value = user.name;
      }
    }
  }, [
    isEditing,
    user
  ]);
  const inputClass = isEditing ? "bg-gray-999 text-white" : "bg-gray-900 text-primary";

  return (
    <div className="d-flex row g-3">
      <div className="col-12 col-lg-8">
        <div className="table-container position-relative">
          <div className="d-flex mx-3 align-items-center mb-5">
            <h4 data-test="user-details-page__heading" className="fw-bold">User Details</h4>
            <div
              className="cursor-pointer text-primary d-flex align-items-center gap-1 ms-1"
              onClick={ () : void => {
                onClose && onClose();
              } }>
              <BsChevronLeft />Return
            </div>

            {
              userId !== loginUserId && <div className="ms-auto d-flex align-items-center justify-content-end">
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
                        data-test="btn-user-delete"
                        className="me-1"
                        color="primary"
                        onClick={ () : void => openDeleteConfirmationModal() }>
                        Delete
                      </Button>
                      { (userStatus === UserStatus.active || userStatus === UserStatus.inactive) && <Button
                        data-test="btn-user-block"
                        className="me-1"
                        color="primary"
                        onClick={ () : void => openBlockConfirmationModal() }>
                        Block
                      </Button> }
                      { (userStatus === UserStatus.blocked) && <Button
                        data-test="btn-user-activate"
                        className="me-1"
                        color="primary"
                        onClick={ () : void => openActivateConfirmationModal() }>
                        Activate
                      </Button> }
                      { (userStatus === UserStatus.active || userStatus === UserStatus.inactive) && <Button
                        data-test="btn-edit"
                        className="me-1"
                        color="primary"
                        onClick={ () : void => setIsEditing(true) }>
                        Edit
                      </Button> }
                    </div>
                }
              </div>
            }
          </div>

          <div className="row">
            <Form className="mx-3 row">
              <div className="col-auto">
                <FormGroup>
                  <Avatar
                    id={ user?.id }
                    avatarUrl={ avatar }
                    uploadCallback={ setAvatar }
                    imageOnly={ !isEditing }
                  />
                </FormGroup>
              </div>
              <div className="col-10">
                <FormGroup>
                  <div className="text-small mb-1">User ID</div>
                  <Input
                    data-test="user-details-page__id"
                    type="text"
                    bsSize="lg"
                    value={ !!userId ? userId : "" }
                    className="bg-gray-900 text-primary"
                    disabled={ true } />
                </FormGroup>
                <FormGroup>
                  <div className="text-small mb-1">Name</div>
                  <Input
                    data-test="user-details-page__name"
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
                    data-test="user-details-page__email"
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
                        data-test="user-details-page__phone"
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
                    data-test="user-details-page__role"
                    type="select"
                    bsSize="lg"
                    className={ inputClass }
                    disabled={ !isEditing }
                    innerRef={ roleInputRef }
                    onChange={ clearFormError }
                    maxLength={ 100 }>
                    {
                      Object.keys(SYSTEM_ROLE_ID).map((role : string) => {
                        const id = SYSTEM_ROLE_ID[role];
                        return (
                          <option
                            key={ id }
                            value={ id || "" }>
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

      <div className="col-12 col-lg-4">
        <RecentActivities
          height={ 390 }
          title="User activities"
          isDateFilterEnabled={ true }
          userId={ userId } />
      </div>

      <NotifyMessageModal
        color={ notifyModal.color }
        iconType={ notifyModal.iconType }
        isOpen={ notifyModal.isOpen }
        message={ notifyModal.message }
        header={ notifyModal.header }
        close={ notifyModal.close }
      />

      <ConfirmationModal
        isOpen={ confirmModal.isOpen }
        message={ confirmModal.message }
        header={ confirmModal.header }
        close={ confirmModal.close }
        confirmBtnText={ confirmModal.confirmBtnText }
        confirm={ confirmModal.confirm }
      />
    </div>
  );
}

export default memo(UserDetails);
