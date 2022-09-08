import React, { useState } from "react";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function Navbar({ back }) {
  return (
    <>
      <Nav back={back ? 1 : 0}>
        <NavLink back={back ? 1 : 0} to="/">
          <h1>Logo</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink back={back ? 1 : 0} to="/">
            Mappa
          </NavLink>
          <NavLink back={back ? 1 : 0} to="/about">
            ABOUT
          </NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink back={back ? 1 : 0} to="/map">
            Mappa
          </NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  background: ${({ back }) => (back ? "#000" : "transparent")};
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
`;

const NavLink = styled(Link)`
  font-size: 1.2em;
  font-weight: bold;
  color: ${({ back }) =>
    back == true ? "var(--hover-green);" : "var(--primary-green);"};
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  text-decoration: none;

  &.active {
    color: #fff;
  }

  &:hover {
    transition: all 0.5s ease-in-out;
    color: #fff;
  }
`;

const Bars = styled(FaBars)`
  color: #fff;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;
const NavMenu = styled.div`
  display: flex;
  align-items: center;
  //margin-right: -24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  //margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavBtnLink = styled(Link)`
  padding: 15px 22px;
  color: #fff;
  background: var(--primary-green);
  border: none;
  outline: none;
  border-radius: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: var(--primary-green);
  }
`;
