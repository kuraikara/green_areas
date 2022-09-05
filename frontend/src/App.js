import React from "react";
import Navbar from "./components/Navbar";
import MapPage from "./MapPage";
import styled from "styled-components";
import "./App.css";

import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="map" element={<MapPage />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
}

function Home() {
  return (
    <>
      <BackgroundImage></BackgroundImage>
      <Navbar />
      <main style={{ alignItems: "center" }}>
        <Title style={{ marginTop: "5rem" }}>Welcome to the homepage!</Title>
        <SubTitle>You can do this, I elieve in you.</SubTitle>
        <MapButton to="/map">Visualizza la mappa</MapButton>
      </main>
    </>
  );
}

const BackgroundImage = styled.div`
  width: 100%;
  height: 75%;
  position: absolute;
  z-index: -1;
  background: var(--hover-green);
`;

const Title = styled.h1`
  text-align: center;
  font-weight: 900;
  font-size: 3rem;
  color: #fff;
`;

const SubTitle = styled.h3`
  text-align: center;
  margin-top: 2rem;
`;

const MapButton = styled(Link)`
  text-align: center;
  justify-content: center;
  margin: 2rem auto 0 auto;
  display: block;
  padding: 1rem 0;
  width: 20%;
  background: var(--primary-green);
  border-radius: 1rem;
  border: 0;
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;

  &:hover {
    transition: all 0.5s ease-in-out;
    background: #fff;
    color: var(--primary-green);
  }
`;

function About() {
  return (
    <>
      <Navbar />
      <main>
        <h2>Who are we?</h2>
        <p>That feels like an existential question, don't you think?</p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}
