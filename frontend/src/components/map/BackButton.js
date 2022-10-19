import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function BackButton({ to }) {
	return (
		<Button to={to}>
			<IoMdArrowRoundBack />
		</Button>
	);
}
const Button = styled(Link)`
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
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
	position: static;

	&:hover {
		transition: all 0.5s ease-in-out;
		background: #fff;
		color: var(--primary-green);
	}
`;
