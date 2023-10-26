import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  Col, Container, FormGroup, Row 
} from "reactstrap";
  
import PageFooter from "components/PageFooter";
import { LOGIN_PATH } from "data/route-path";
  
function EmailRequestSuccess() : JSX.Element {
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
                <FormGroup className="mb-4">
                  <h3>Change Password</h3>
                  <span className="text-gray d-block mt-1">Account recovery mail has been sent to your email. If it does not appear in your inbox within 15 minutes, please check your junk mail.</span>
                </FormGroup>
                <Link to={ LOGIN_PATH }>Back to Login</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  
      <PageFooter />
    </div>
  );
}
  
export default memo(EmailRequestSuccess);