import React from "react";
import Navbar from "./components/Navbar";
import MapPage from "./pages/MapPage";
import Login from "./pages/Login";
import styled from "styled-components";
import RequireAuth from "./components/RequireAuth";
import Admin from "./pages/Admin";
import User from "./pages/User";
import RedirectMap from "./pages/RedirectMap";
import Ranking from "./pages/Ranking";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Feeds from "./pages/Feeds";
import Home from "./pages/Home";

import Layout from "./components/Layout";

import useAuth from "./hooks/useAuth";
import PersistentLogin from "./components/PersistentLogin";

import "./App.css";

import { Routes, Route, Link } from "react-router-dom";

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route element={<PersistentLogin />}>
						<Route path="/" element={<Home />} />
						<Route path="map" element={<MapPage />} />
						<Route path="about" element={<About />} />
						<Route path="login" element={<Login />} />
						<Route path="register" element={<Register />} />
						<Route path="redirect" element={<RedirectMap />} />
						<Route path="unauthorized" element={<Unauthorized />} />
						<Route path="tops" element={<Ranking />} />
						<Route element={<RequireAuth allowedRoles={["admin"]} />}>
							<Route path="admin" element={<Admin />} />
						</Route>

						<Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
							<Route path="/user" element={<User />} />
							<Route path="/user/:username" element={<Profile />} />
							<Route path="/feeds" element={<Feeds />} />
						</Route>
					</Route>
				</Route>
			</Routes>
		</>
	);
}

function Unauthorized() {
	return (
		<>
			<Navbar back={true} />
			<main
				style={{
					textAlign: "center",
					marginTop: "8rem",
				}}
			>
				<h2 style={{ fontSize: "3rem" }}>Unauthorized</h2>
				<p style={{ marginTop: "2rem" }}>
					You are not authorized to view this page.
				</p>
				<Button to="/">Home</Button>
			</main>
		</>
	);
}

const Button = styled.button`
	padding: 0.6rem 2rem;
	border: none;
	border-radius: 0.5rem;
	background-color: var(--primary-green);
	color: #fff;
	font-weight: 700;
	margin: 2rem 0;
	cursor: pointer;
`;

function About() {
	return (
		<>
			<Navbar back={true} />
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
