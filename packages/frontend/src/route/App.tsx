import "/assets/style/index.scss";
import "react-perfect-scrollbar/dist/css/styles.css";

import React from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import LoginPage from "pages/Login";
import NotFoundPage from "pages/NotFound";
import ManagerApp from "route/ManagerApp";

import {
  FORGOT_PASSWORD_EMAIL_REQ_SUCCESS_PATH,
  FORGOT_PASSWORD_PATH,
  LOGIN_PATH,
  PAGE_NOT_FOUND_PATH,
  RESET_PASSWORD_PATH,
  TEMPLATE_PREFIX_PATH
} from "data/route-path";
import ForgotPasswordPage from "pages/ForgotPassword";
import EmailRequestSuccessPage from "pages/ForgotPassword/EmailRequestSuccess";
import ResetPasswordPage from "pages/ForgotPassword/ResetPassword";

function App() : JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={ TEMPLATE_PREFIX_PATH }
          component={ ManagerApp } />

        <Route
          path={ LOGIN_PATH }
          component={ LoginPage }
          exact />
        
        {/* Forgot password */}
        <Route
          path={ FORGOT_PASSWORD_PATH }
          component={ ForgotPasswordPage }
          exact />
        <Route
          path={ FORGOT_PASSWORD_EMAIL_REQ_SUCCESS_PATH }
          component={ EmailRequestSuccessPage }
          exact />
        <Route
          path={ RESET_PASSWORD_PATH }
          component={ ResetPasswordPage }
          exact />
        {/* End - Forgot password */}

        <Route
          exact
          path={ PAGE_NOT_FOUND_PATH }
          component={ NotFoundPage } />

        <Redirect to={ PAGE_NOT_FOUND_PATH } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
