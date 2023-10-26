import React from "react";
import { render } from "react-dom";

import App from "route/App";

import { createBrowserHistory } from "history";
import { MenuProvider } from "contexts/MenuContext";

const history = createBrowserHistory();

const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
if (path) {
  history.replace(path);
}

function Main() : React.ReactElement {
  return (
    <MenuProvider>
      <App />
    </MenuProvider>
  );
}

render(<Main />, document.getElementById("root"));
