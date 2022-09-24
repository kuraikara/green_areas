import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Users from "../components/admin/Users";
import Reviews from "../components/admin/Reviews";
import Database from "../components/admin/Database";
export default function Admin() {
	const { auth } = useAuth();
	const [select, setSelect] = useState(0);
	return (
		<>
			<Navbar back={true} />
			<main>
				<Title>{auth.user}'s administration page</Title>
				<ButtonBar>
					<Button selected={select === 0} onClick={() => setSelect(0)}>
						Users
					</Button>
					<Button selected={select === 1} onClick={() => setSelect(1)}>
						Reviews
					</Button>
					<Button selected={select === 2} onClick={() => setSelect(2)}>
						Database
					</Button>
				</ButtonBar>
				<Content>
					{select === 0 && <Users />}
					{select === 1 && <Reviews />}
					{select === 2 && <Database />}
				</Content>
			</main>
		</>
	);
}

const Title = styled.h1`
	font-size: 2em;
	text-align: center;
	padding: 0.5em;
`;

const ButtonBar = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 1rem;
`;

const Button = styled.button`
	padding: 15px 22px;
	font-size: 1.2rem;
	color: #fff;
	background: ${({ selected }) => (selected ? "var(--primary-green)" : "#000")};
	border: none;
	outline: none;
	border-radius: 1rem;
	margin-left: 1rem;
	cursor: pointer;
	transition: all 0.5s ease-in-out;
	text-decoration: none;

	&:hover {
		${({ selected }) =>
			selected
				? ""
				: "transition: all 0.3s ease-in-out; background: var(--hover-green);color: #fff;"}
	}
`;

const Content = styled.div`
	padding: 1rem;
	margin: 1rem;
	background: var(--hover-green);
	border-radius: 1rem;
`;
