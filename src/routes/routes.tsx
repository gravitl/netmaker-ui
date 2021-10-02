import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Header } from "./Header";

import Home from "./pages/home";
import { Login } from "./pages/Login";
import { Networks } from "./pages/network"

function NoMatch() {
  const location = useLocation();
  return (
    <div>
      No match for <code>{location.pathname}</code>
    </div>
  );
}

function Routes() {
  let location = useLocation();

  // This piece of state is set when one of the
  // gallery links is clicked. The `background` state
  // is the location that we were at when one of
  // the gallery links was clicked. If it's there,
  // use it as the location for the <Switch> so
  // we show the gallery in the background, behind
  // the modal.
  const background = (location.state as any)?.background;

  return (
    <>
      <Header />
      <Switch location={background || location}>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/networks">
          <Networks />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/login" children={<Login />} />}
    </>
  );
}
export default Routes;
