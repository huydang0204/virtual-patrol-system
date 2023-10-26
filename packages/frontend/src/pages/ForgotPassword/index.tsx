import React, {
  FormEvent, memo, useCallback, useEffect, useRef, useState 
} from "react";
import {
  Link,
  RouteComponentProps
} from "react-router-dom";
import {
  Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row 
} from "reactstrap";

import PageFooter from "components/PageFooter";

import {
  FORGOT_PASSWORD_EMAIL_REQ_SUCCESS_PATH, LOGIN_PATH 
} from "data/route-path";
import {
  ForgotPasswordError, forgotPassword
} from "services/auth-account";

type ForgotPasswordFormError = {
  usernameFailure : boolean;
  accountBlocked : boolean;
};

function ForgetPassword({ history } : {
  history : RouteComponentProps["history"]
}) : JSX.Element {
  const [
    authorizing,
    setAuthorizing
  ] = useState<boolean>(false);
  const [
    formError,
    setFormError
  ] = useState<ForgotPasswordFormError>({
    usernameFailure : false,
    accountBlocked : false
  });

  const usnInput = useRef<HTMLInputElement>(null);
  const _isMounted = useRef<boolean>(false);
  const _inDirecting = useRef<boolean>(false);

  const onEmailChanged = () : void => {
    const error = { usernameFailure : false };
    
    setFormError((prevState : ForgotPasswordFormError) => ({
      ...prevState,
      ...error
    }));
  };

  const onUserRequestNewResetPasswordLink = async (e : FormEvent<HTMLFormElement>) : Promise<void> => {
    e && e.preventDefault();
    
    setAuthorizing(true);
    const email = usnInput.current?.value;
    
    const { errors } = await forgotPassword(email);
    if (!errors) {
      onResetEmailRequestSuccess();
    } else {
      const loginError : ForgotPasswordFormError = { 
        usernameFailure : errors[ForgotPasswordError.INVALID_USERNAME], 
        accountBlocked : errors[ForgotPasswordError.ACCOUNT_BLOCKED]
      };
      onResetEmailRequestFail(loginError);
    }
  };

  const onResetEmailRequestSuccess = () : void => {
    if (_isMounted.current) {
      directToResetEmailRequestSuccessPage();
      setAuthorizing(false);
    }
  };

  const onResetEmailRequestFail = (error : ForgotPasswordFormError) : void => {
    if (_isMounted.current) {
      const {
        usernameFailure,
        accountBlocked
      } = error;
      setFormError((prevError : ForgotPasswordFormError) => (
        {
          ...prevError,
          usernameFailure,
          accountBlocked
        }
      ));
      setAuthorizing(false);
    }
  };

  const directToResetEmailRequestSuccessPage = useCallback(() : void => {
    if (!_inDirecting.current) {
      _inDirecting.current = true;

      history && history.push(FORGOT_PASSWORD_EMAIL_REQ_SUCCESS_PATH);
    }
  }, [history]);

  useEffect(() => {
    _isMounted.current = true;

    return function clean() {
      _isMounted.current = false;

      setFormError({
        usernameFailure : false,
        accountBlocked : false
      });
    };
  }, []);

  const {
    usernameFailure,
    accountBlocked
  } = formError;
  let invalidEmailError = null,
    accountBlockedError = null;
  if (usernameFailure) {
    invalidEmailError = <div>User not found!</div>;
  }
  if (accountBlocked) {
    accountBlockedError = <div>This account has been blocked by admin!</div>;
  }
  const emailInputInvalid = usernameFailure || accountBlocked;

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
                <Form onSubmit={ onUserRequestNewResetPasswordLink }>
                  <FormGroup className="mb-4">
                    <h3>Change Password</h3>
                    <span className="text-gray d-block mt-1">A password reset link will be sent to your email. If you do not recieve it within a few minutes, please try submitting again.</span>
                  </FormGroup>
                  <FormGroup className="form-group float-label mb-4">
                    <Label className="text-muted">
                    Email
                    </Label>
                    <Input
                      bsSize="lg"
                      type="text"
                      innerRef={ usnInput }
                      onChange={ onEmailChanged }
                      invalid={ emailInputInvalid }>
                    </Input>
                    <FormFeedback>
                      { invalidEmailError }
                      { accountBlockedError }
                    </FormFeedback>
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={ LOGIN_PATH }>Back to Login</Link>
                    <Button
                      className="w-80 rounded rounded-3"
                      size="lg"
                      disabled={ authorizing }
                      color="primary">
                      { authorizing ? "Submit..." : "Submit" }
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <PageFooter />
    </div>
  );
}

export default memo(ForgetPassword);