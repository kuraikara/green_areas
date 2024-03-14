import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";

function Home() {
	const { auth } = useAuth();
	return (
		<>
			<BackgroundImage
				src={process.env.PUBLIC_URL + "/cityimg.jpg"}
			></BackgroundImage>
			<Navbar back={false} />

			<main style={{ alignItems: "center" }}>
				<Title>
					{auth ? "Welcome back " + auth.username + "!" : "Welcome"}
				</Title>
				<SubTitle>
					Now you can explore the map for new areas, see what your friends like
					or relive your favorite places.
				</SubTitle>
				<MapButton to="/map">Go to Map</MapButton>
			</main>
			<MapImg src={process.env.PUBLIC_URL + "/mappapc.png"}></MapImg>
		</>
	);
}

const MapImg = styled.img`
	position: absolute;
	top: 55%;
	right: 25%;
	width: 50%;
	object-fit: cover;
	border-radius: 0.5rem;
	box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.7);
`;

const BackgroundImage = styled.img`
	width: 100%;
	height: 80%;
	position: absolute;
	z-index: -1;
	background: var(--home-hover-green);
	opacity: 0.8;
	object-fit: cover;
`;

const Title = styled.h1`
	text-align: center;
	font-weight: bold;
	font-size: 3rem;
	color: #000;
	padding: 0 1rem;
	margin-top: 8rem;

	@media screen and (max-width: 768px) {
		font-size: 2rem;
	}

	@media screen and (max-width: 300px) {
		font-size: 2rem;
		margin-top: 2rem;
	}
`;

const SubTitle = styled.h3`
	text-align: center;
	margin-top: 2rem;
	padding: 0 1rem;
`;

const MapButton = styled(Link)`
	text-align: center;
	justify-content: center;
	margin: 3rem auto 0 auto;
	display: block;
	width: fit-content;
	padding: 1rem 1rem;
	background: #eff7ea;
	border-radius: 1rem;
	border: 0;
	color: var(--home-primary-green);
	font-size: 1.2rem;
	font-weight: bold;
	text-decoration: none;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
	transition: all 0.5s ease-in-out;

	&:hover {
		background: var(--home-primary-green);
		color: #eff7ea;
	}
`;

export default Home;
