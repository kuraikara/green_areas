import React from "react";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>Logo</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/">Mappa</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to="/map">Mappa</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
}

const Nav = styled.nav`
  background: transparent;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1000px) / 2);
  z-index: 10;
`;

const NavLink = styled(Link)`
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  text-decoration: none;

  &.active {
    color: var(--primary-green);
  }

  &:hover {
    color: var(--primary-green);
  }
`;

const Bars = styled(FaBars)`
  color: #000;
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
  border-radius: 1rem;
  //background: #256c31;
  background: var(--blue);
  padding: 10px 22px;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #fff;
    color: #010606;
  }
`;
