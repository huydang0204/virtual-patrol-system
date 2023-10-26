import React, { memo } from "react";
import { useHistory } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";

import useRouteScreen from "hooks/useRouteScreen";

interface ComponentProps {
  title : string;
  canGoBackToPrevious? : boolean;
  redirect? : {
    label? : string;
    path? : string;
    action?: () => void;
  };
  ActionComponents? : JSX.Element;
}

function PageHeaderTitle(props : ComponentProps) : JSX.Element {
  const {
    title,
    canGoBackToPrevious = true,
    redirect,
    ActionComponents
  } = props;
  const history = useHistory();
  const route = useRouteScreen();

  const canGoBack = canGoBackToPrevious && (!!redirect || route.subMenuKey.split("/").length > 4);

  const handleRedirect = () : void => {
    if (!!history) {
      if (!!redirect && !!redirect.path) {
        history.push(redirect.path);
      } else if (!!redirect.action) {
        redirect.action();
      } else if (canGoBack && history.length > 0) {
        history.go(-1);
      }
    }
  };

  return (
    <div className="page-header-title mb-3 text-white d-flex align-items-center justify-content-between gap-3">
      <div className="d-flex">
        <h2 data-test="page-header-title">{ title }</h2>
        {
          canGoBack ? <div
            data-test="app__btn-return-prev-page"
            className="redirect-label text-primary d-flex align-items-center gap-2 mt-1"
            onClick={ handleRedirect }>
            <BsChevronLeft /> { `Return ${ (!!redirect && redirect?.label !== "") ? "" : `to ${ redirect?.label }` }` }
          </div> : null
        }
      </div>

      { !!ActionComponents && ActionComponents }
    </div>
  );
}

export default memo(PageHeaderTitle);
