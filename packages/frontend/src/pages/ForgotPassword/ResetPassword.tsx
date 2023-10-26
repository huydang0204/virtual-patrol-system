import PageFooter from "components/PageFooter";
import React, {
  FormEvent, useEffect, useRef, useState 
} from "react";
import {
  useLocation,
  Link,
  RouteComponentProps
} from "react-router-dom";
import {
  Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row 
} from "reactstrap";

import NotifyMessageModal from "components/NotificationModal";

import { LOGIN_PATH } from "data/route-path";
import { NotificationModalProps } from "model-type/component-style";
import {
  ResetPasswordError, getForgotPasswordUserData, resetPassword 
} from "services/auth-account";

type ResetPasswordFormError = {
    passwordFailure : boolean;
    failed : boolean;
    notFound : boolean;
  };

function ResetPassword({ history } : {
    history : RouteComponentProps["history"]
  }) : JSX.Element {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [
    authorizing,
    setAuthorizing
  ] = useState<boolean>(false);
  const [userId,
    setUserId] = useState<string>("");
  const [
    formError,
    setFormError
  ] = useState<ResetPasswordFormError>({
    passwordFailure : false,
    failed : false,
    notFound : false 
  });
  const [notifyModal,
    setNotifyModal] = useState<NotificationModalProps>({
      color : "success",
      iconType : "success",
      header : null,
      message : null,
      isOpen : false,
      closeButtonLabel : "Back to Login"
    });

  const pwdInput = useRef<HTMLInputElement>(null);

  const onPasswordChanged = () : void => {
    const error = {
      passwordFailure : false,
      loginFailure : false
    };
    
    setFormError((prevState : ResetPasswordFormError) => ({
      ...prevState,
      ...error
    }));
  };

  const {
    passwordFailure, failed, notFound 
  } = formError;
  let invalidPasswordError = null, 
    getForgotPasswordUserDataFailedError = null, 
    invalidForgotPasswordIdError = null;
  if (passwordFailure) {
    invalidPasswordError = <div className="text-small text-danger">New password must follow the above rules.</div>;
  } else if (failed) {
    getForgotPasswordUserDataFailedError = <div className="text-small text-danger">Your request has been expired. Please try again.</div>;
  } else if (notFound) {
    invalidForgotPasswordIdError = <div className="text-small text-danger">Forgot password not found. Please try again.</div>;
  }

  const onChangePassword = async (e : FormEvent<HTMLFormElement>) : Promise<void> => {
    e && e.preventDefault();
    
    setAuthorizing(true);
    const password = pwdInput.current?.value;
    const data = await getForgotPasswordUserData(id);

    if (!data) {
      const resetPasswordError : ResetPasswordFormError = {
        passwordFailure : false,
        failed : true,
        notFound : false 
      };
      onResetPasswordFail(resetPasswordError);
    } else {
      const { errors } = await resetPassword(password, id, data.userId);
      if (!errors) {
        onResetPasswordSuccess();
      } else {
        const resetPasswordError : ResetPasswordFormError = {
          passwordFailure : errors[ResetPasswordError.INVALID_PASSWORD],
          failed : false,
          notFound : false 
        };
        onResetPasswordFail(resetPasswordError);
      }
    }
  };

  const onResetPasswordSuccess = () : void => {
    setAuthorizing(false);

    setNotifyModal({
      iconType : "success",
      color : "success",
      header : "Password Changed",
      message : <div className="text-center text-black">Your new password has been successfully changed!</div>,
      isOpen : true,
      closeButtonLabel : "Back to Login"
    }); 
  };

  const onResetPasswordFail = (error : ResetPasswordFormError) : void => {
    const {
      passwordFailure, failed, notFound 
    } = error;
    setFormError((prevError : ResetPasswordFormError) => (
      {
        ...prevError,
        passwordFailure,
        failed,
        notFound
      }
    ));
    setAuthorizing(false);
  };

  const handleNotifyModalClose = () : void => {
    setNotifyModal({
      color : "",
      header : null,
      message : null,
      isOpen : false
    });

    history && history.push(LOGIN_PATH);
  };

  const loadForgotPasswordUserData = async (forgotPwdId : string) : Promise<void> => {
    const data = await getForgotPasswordUserData(forgotPwdId);
    if (data && data.userId) {
      setUserId(data.userId);
    }
  };

  useEffect(() => {
    loadForgotPasswordUserData(id);
  }, [id]);

  return (
    <div className="login-page">
      <div id="login-background">
      </div>

      <Container>
        <Row>
          <Col md="6">
            <div id="login-form">
              <div className="company-logo">
                <img className="logo" src="/assets/images/company-logo.png" />
              </div>

              <div className="login-form-container">
                <Form onSubmit={ onChangePassword }>
                  <FormGroup className="mb-4">
                    <h3>Change Password</h3>
                    {userId && <span className="text-gray d-block mt-1">Please create a new password that follows the below rules.</span>}
                  </FormGroup>
                  {userId ? <><FormGroup className="form-group float-label mb-4">
                    <Label className="text-muted">
                    New Password
                    </Label>
                    <Input
                      bsSize="lg"
                      type="password"
                      innerRef={ pwdInput }
                      onChange={ onPasswordChanged }
                      invalid={ passwordFailure } />
                    <div className="mt-2 ml-2" style={{
                      lineHeight : "18px",
                      color : "rgba(112, 111, 120, 1)" 
                    }}>
                        MUST Include:
                      <ul style={{
                        listStyle : "disc",
                        marginLeft : "20px" 
                      }}>
                        <li>Length between 8-25 characters</li>
                        <li>Upper case alphabet (A - Z)</li>
                        <li>Lower case alphabet (a - z)</li>
                        <li>Digits (0 - 9)</li>
                        <li>Special characters [ ! $ # % & @ ] </li>
                      </ul>
                    </div>
                    <FormFeedback>
                      { invalidPasswordError }
                    </FormFeedback>
                    { getForgotPasswordUserDataFailedError }
                    { invalidForgotPasswordIdError }
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={ LOGIN_PATH }>Back to Login</Link>
                    <Button
                      className="w-80 rounded rounded-3"
                      size="lg"
                      disabled={ authorizing }
                      color="primary">
                      { authorizing ? "Change password..." : "Change password" }
                    </Button>
                  </div>
                  </> :
                    <>
                      <div>Your request has been expired. Please try again.</div>
                      <div className="mt-3">
                        <Link to={ LOGIN_PATH }>Back to Login</Link>
                      </div>
                    </>
                  }
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <NotifyMessageModal
        color={ notifyModal.color }
        iconType={ notifyModal.iconType }
        isOpen={ notifyModal.isOpen }
        message={ notifyModal.message }
        header={ notifyModal.header }
        closeButtonLabel={ notifyModal.closeButtonLabel }
        close={ handleNotifyModalClose }
      />

      <PageFooter />
    </div>
  );
}

export default ResetPassword;