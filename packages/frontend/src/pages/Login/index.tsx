import React, {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Link,
  RouteComponentProps
} from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import {
  login,
  LoginError
} from "services/auth-account";

import {
  DASHBOARD_PATH,
  FORGOT_PASSWORD_PATH,
  REGISTRATION_PATH,
  TASK_LIST_PATH
} from "data/route-path";
import { LoginType } from "data/user";
import { USER_ROLE } from "@vps/utils/lib/data";

import PageFooter from "components/PageFooter";
import {
  getInfo, retrieveAuthToken 
} from "model/user-account";

type LoginFormError = {
  loginFailure : boolean;
  usernameFailure : boolean;
  passwordFailure : boolean;
  accountBlocked : boolean;
};

function LoginPage({ history } : {
  history : RouteComponentProps["history"]
}) : JSX.Element {
  const [
    authorizing,
    setAuthorizing
  ] = useState<boolean>(false);
  const [
    formError,
    setFormError
  ] = useState<LoginFormError>({
    loginFailure : false,
    usernameFailure : false,
    passwordFailure : false,
    accountBlocked : false
  });

  const usnInput = useRef<HTMLInputElement>(null);
  const pwdInput = useRef<HTMLInputElement>(null);
  const typeInputRef = useRef<HTMLInputElement>(null);
  const _inDirecting = useRef<boolean>(false);
  const _isMounted = useRef<boolean>(false);

  const directToApp = useCallback(() : void => {
    if (!_inDirecting.current) {
      _inDirecting.current = true;

      const currentUser = getInfo();
      if (USER_ROLE.Admin === currentUser.role || USER_ROLE.Client === currentUser.role) {
        history && history.push(DASHBOARD_PATH);
      } else if (USER_ROLE.Officer === currentUser.role) {
        history && history.push(TASK_LIST_PATH);
      }
    }
  }, [history]);

  // callback
  const onAuthenticateCredentialSuccess = () : void => {
    if (_isMounted.current) {
      directToApp();
      setAuthorizing(false);
    }
  };

  const onAuthenticateCredentialFail = (error : LoginFormError) : void => {
    if (_isMounted.current) {
      const {
        usernameFailure,
        passwordFailure,
        loginFailure
      } = error;
      setFormError((prevError : LoginFormError) => (
        {
          ...prevError,
          usernameFailure,
          passwordFailure,
          loginFailure
        }
      ));
      setAuthorizing(false);
    }
  };

  const onUserLogin = async (e : FormEvent<HTMLFormElement>) : Promise<void> => {
    e && e.preventDefault();

    setAuthorizing(true);
    const email = usnInput.current?.value;
    const password = pwdInput.current?.value;
    const loginType = typeInputRef.current.value;
    const { errors } = await login(email, password, LoginType[loginType]);
    if (!errors) {
      onAuthenticateCredentialSuccess();
    } else {
      const loginError : LoginFormError = {
        loginFailure : errors[LoginError.LOGIN_FAILED],
        usernameFailure : errors[LoginError.INVALID_USERNAME],
        passwordFailure : errors[LoginError.INVALID_PASSWORD],
        accountBlocked : errors[LoginError.ACCOUNT_BLOCKED]
      };
      onAuthenticateCredentialFail(loginError);
    }
  };

  const onEmailChanged = () : void => {
    const error = {
      emailFailure : false,
      loginFailure : false
    };

    setFormError((prevState : LoginFormError) => ({
      ...prevState,
      ...error
    }));
  };

  const onPasswordChanged = () : void => {
    const error = {
      passwordFailure : false,
      loginFailure : false
    };

    setFormError((prevState : LoginFormError) => ({
      ...prevState,
      ...error
    }));
  };

  useEffect(
    () => {
      const token = retrieveAuthToken();
      if (!!token) {
        directToApp();
      }
    },
    [directToApp]
  );

  useEffect(() => {
    _isMounted.current = true;

    return function clean() {
      _isMounted.current = false;

      setFormError({
        loginFailure : false,
        usernameFailure : false,
        passwordFailure : false,
        accountBlocked : false
      });
    };
  }, []);

  const {
    loginFailure,
    usernameFailure,
    passwordFailure,
    accountBlocked
  } = formError;
  let invalidEmailError = null,
    invalidPasswordError = null,
    wrongCredentialError = null,
    accountBlockedError = null;
  if (usernameFailure) {
    invalidEmailError = <div>Invalid Email</div>;
  }
  if (passwordFailure) {
    invalidPasswordError = <div>Password Required</div>;
  }
  if (loginFailure) {
    wrongCredentialError = <div>Invalid Email or Password!</div>;
  }
  if (accountBlocked) {
    accountBlockedError = <div>This account has been blocked by admin!</div>;
  }

  const emailInputInvalid = usernameFailure || loginFailure || accountBlocked;
  const passwordInputInvalid = passwordFailure || loginFailure || accountBlocked;

  return (
    <div className="login-page">
      <div id="login-background">
      </div>

      <Container>
        <Row>
          <Col md="6">
            <div id="login-form">
              <div className="company-logo">
                <img
                  className="logo"
                  src="/assets/images/company-logo.png" />
              </div>

              <div className="login-form-container">
                <Form onSubmit={ onUserLogin }>
                  <FormGroup className="mb-4">
                    <h3>Login</h3>
                    <span className="text-gray d-block mt-1">Sign in to your account to continue</span>
                  </FormGroup>
                  <FormGroup className="form-group float-label mb-4">
                    <Label className="text-muted">
                      Username
                    </Label>
                    <Input
                      autoFocus
                      name="email"
                      bsSize="lg"
                      type="text"
                      innerRef={ usnInput }
                      onChange={ onEmailChanged }
                      invalid={ emailInputInvalid }>
                    </Input>
                    <FormFeedback>
                      { invalidEmailError }
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup className="form-group float-label mb-4">
                    <Label className="text-muted">
                      Password
                    </Label>
                    <Input
                      name="password"
                      bsSize="lg"
                      type="password"
                      innerRef={ pwdInput }
                      onChange={ onPasswordChanged }
                      invalid={ passwordInputInvalid } />
                    <FormFeedback>
                      { invalidPasswordError }
                      { wrongCredentialError }
                      { accountBlockedError }
                    </FormFeedback>
                  </FormGroup>
                  <FormGroup className="form-group float-label mb-4">
                    <Label className="text-muted">
                      Login Type
                    </Label>
                    <Input
                      bsSize="lg"
                      type="select"
                      innerRef={ typeInputRef }>
                      <option value={ LoginType.NormalLogin }>Normal Login</option>
                      <option value={ LoginType.NxLogin }>NX Witness Login</option>
                    </Input>
                  </FormGroup>
                  <FormGroup className="mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link
                          to={ FORGOT_PASSWORD_PATH }
                          className="text-primary">
                          Forgot password?
                        </Link>
                        <br />
                        <Link
                          to={ REGISTRATION_PATH }
                          className="text-muted text-small">
                          Not a member?
                        </Link>
                      </div>
                    </div>
                  </FormGroup>
                  <Button
                    type="submit"
                    className="w-100 rounded rounded-3"
                    size="lg"
                    disabled={ authorizing }
                    color="primary">
                    { authorizing ? "Login..." : "Login" }
                  </Button>
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

export default memo(LoginPage);
