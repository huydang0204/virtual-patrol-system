import React from "react";

function LoadingSpinner(props : {
  active : boolean,
  full?,
  app?
}) {
  const {
    active,
    full,
    app
  } = props;

  let loadingContainerClass = full ? "loading-full-spinner" : "loading-block-spinner";
  if (app) {
    loadingContainerClass += " app";
  }

  return (
    !active ? null :
      <div className={ loadingContainerClass } data-test="page-loading-spinner">
        <div className="d-table h-100 w-100">
          <div className="d-table-cell align-middle">
            <div className="spinner mx-auto" />
          </div>
        </div>
      </div>
  );
}

export default LoadingSpinner;
