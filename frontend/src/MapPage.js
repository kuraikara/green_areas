import React, { Suspense, lazy } from "react";

import Map from "./components/Map";
import styled from "styled-components";
import { Routes, Route, Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

//const Map = lazy(() => import("./components/Map"));

export default function MapPage() {
  return (
    <>
      <BackButton to="/">
        <BackIcon />
      </BackButton>
      <Suspense fallback={<div>LOADING</div>}></Suspense>
      <Map />
    </>
  );
}

const BackButton = styled(Link)`
  text-align: center;
  justify-content: center;
  display: block;
  padding: 1rem 2rem 0.5rem 2rem;
  background: var(--primary-green);
  border-radius: 1rem;
  border: 0;
  color: #fff;
  font-size: 1.5rem;
  text-decoration: none;

  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;

  &:hover {
    transition: all 0.5s ease-in-out;
    background: #fff;
    color: var(--primary-green);
  }
`;

const BackIcon = styled(IoMdArrowRoundBack)`
  //font-size: 1rem;
`;
