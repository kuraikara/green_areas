import React from "react";
import { Tabs, List } from "../components/Miscellaneus";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { BiMap } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";

function Ranking() {
	const { auth } = useAuth();
	return (
		<>
			<Navbar back={true} />
			<Title>Ranking</Title>
			<Tabs>
				<World50 tabname={"Top 50 World"} />
				{auth && <Followed50 tabname={"Top 50 Followed"} />}
				<City50 tabname={"Top 50 City"} />
			</Tabs>
		</>
	);
}

const World50 = () => {
	return (
		<>
			{/* <List>
				<Row>
					<Item first>
						<Rank first>1</Rank>
						<Name>John Doe</Name>
						<Score>
							100 <Heart />
						</Score>
						<Button />
					</Item>
				</Row>
				<Row>
					<Item>
						<Rank second>2</Rank>
						<Name>John Doe</Name>
						<Score>100</Score>
					</Item>
				</Row>
				<Row>
					<Item>
						<Rank third>3</Rank>
						<Name>John Doe</Name>
						<Score>100 </Score>
					</Item>
				</Row>
			</List> */}
			<List items={[1, 2]}>
				<Rank>ciao</Rank>
			</List>
		</>
	);
};

const Rank = styled.div`
	font-size: 3rem;
	font-weight: 900;
	${({ first }) => (first ? "color: gold;" : "")}
	${({ second }) => (second ? "color: silver;" : "")}
    ${({ third }) => (third ? "color: brown;" : "")}
`;

const Name = styled.div`
	font-size: 1.5rem;
	font-weight: 900;
`;

const Score = styled.div`
	font-size: 1.5rem;
	font-weight: 900;
`;

const Heart = styled(AiFillHeart)`
	color: red;
	margin: 0;
	transform: translateY(0.2rem);
`;

const Button = styled(BiMap)`
	font-size: 3.5rem;
	color: #000;
	cursor: pointer;
	background: #fff;
	border-radius: 50%;
	padding: 0.5rem;
	transition: all 0.5s ease-in-out;
	border: 3px solid #000;

	&:hover {
		color: #fff;
		background: var(--primary-green);
		border: 3px solid var(--primary-green);
	}
`;

const Followed50 = () => {
	return <div>Followed50</div>;
};

const City50 = () => {
	return <div>City50</div>;
};

const Title = styled.h1`
	font-size: 2.5rem;
	text-align: center;
	margin: 2rem;
`;

export default Ranking;
