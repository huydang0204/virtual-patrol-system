import React from "react";

type ApiStatus = "idle" | "pending" | "success" | "rejected";

type TableLoadingProps = {
  status: ApiStatus;
  handleReload: () => void;
};

const Loading = (props: TableLoadingProps): JSX.Element => {
  const {
    status, handleReload 
  } = props;

  return <div onClick={handleReload}>Status - {status}</div>;
};

export default Loading;
