import React from "react";
import { Container } from "@material-ui/core";
import { Header } from "./Header";
import { RouteComponentProps } from "react-router-dom";

export interface ShellProps extends RouteComponentProps {
  Component: React.FC<RouteComponentProps>;
}

export function Shell(props: ShellProps) {
  const { Component, ...routeProps } = props;

  return (
    <>
    <Container id="main" style={{ paddingTop: "40px" }}>
      <Component {...routeProps} />
    </Container>
    </>
  );
}
