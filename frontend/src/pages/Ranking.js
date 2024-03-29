import React from "react";
import Tabs from "../components/miscellaneous/Tabs";
import { RankList } from "../components/miscellaneous/List";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import { BiMap } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import useAxios from "../hooks/useAxios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Loader } from "../components/Miscellaneus";

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
	const axiosPrivate = useAxiosPrivate();
	const [ranks, error, loading, refetch] = useAxios({
		axiosInstance: axiosPrivate,
		url: "/social/top",
		method: "get",
	});
	const testranks = [
		{
			id: 11,
			name: "Parco del Valentino",
			score: 100,
			position: 1,
		},
		{
			id: 21,
			name: "Parco Giacomo Leopardi",
			score: 90,
			position: 1,
		},
		{
			id: 12,
			name: "Parco La Tesoreria",
			score: 80,
			position: 1,
		},
		{
			id: 59,
			name: "Il Giardino Roccioso",
			score: 70,
			position: 2,
		},
		{
			id: 42,
			name: "National Park",
			score: 11,
			position: 2,
		},
	];
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
			{loading && <Loader />}
			{!loading && (
				<ListContainer>
					<RankList rank items={ranks}></RankList>
				</ListContainer>
			)}
		</>
	);
};

const Followed50 = () => {
	const axiosPrivate = useAxiosPrivate();
	const [ranks, error, loading, refetch] = useAxios({
		axiosInstance: axiosPrivate,
		url: "/social/topfollowed",
		method: "get",
	});

	return (
		<>
			{loading && <Loader />}
			{!loading && (
				<ListContainer>
					<RankList rank items={ranks}></RankList>
				</ListContainer>
			)}
		</>
	);
};

const ListContainer = styled.div`
	width: 75%;
	margin: 0 auto;
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

const City50 = () => {
	return <div>City50</div>;
};

const Title = styled.h1`
	font-size: 2.5rem;
	text-align: center;
	margin: 2rem;
`;

export default Ranking;
