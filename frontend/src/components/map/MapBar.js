import React from "react";
import { useLocation } from "react-router-dom";
import BackButton from "./BackButton";
import SearchField from "../SearchField";
import styled from "styled-components";

function MapBar() {
	const location = useLocation();
	const from = location?.state?.from?.pathname || "/";
	return (
		<Container>
			<BackButton to={from} />
			<SearchField />
		</Container>
	);
}

const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;

	z-index: 100;
	display: flex;
	align-items: center;
	padding: 1rem;
	gap: 2rem;
	flex-direction: row;
	max-height: max-content;
`;

export default MapBar;
