import React, { memo } from "react";
import {
  Card,
  CardBody,
  Col,
  Row
} from "reactstrap";

import VerticalBlock from "components/VerticalBlock";

import { LOGIN_PATH } from "data/route-path";

function NotFoundPage() : JSX.Element {
  return <>
    <div id="login-background">
    </div>

    <VerticalBlock position="center">
      <div id="login-form">
        <Card className="auth-card">
          <CardBody>
            <Row className="align-items-center px-2">
              <Col
                xs={ 12 }
                md={ 5 }
                className="d-flex align-items-center justify-content-center">
                <div className="logo">
                  <img src="/assets/images/company-logo.png" />
                </div>
              </Col>
              <Col
                xs={ 12 }
                md={ 7 }
                className="ps-5"
              >
                <h2>
                  404 Not Found
                </h2>
                <a
                  href={ LOGIN_PATH }
                  className="btn btn-lg btn-primary mt-5">
                  Return Home
                </a>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </VerticalBlock>
  </>;
}

export default memo(NotFoundPage);
