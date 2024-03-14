import React, { useState } from "react";
import styled from "styled-components";
import { Loader } from "../Miscellaneus";

import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GoToButton } from "./Buttons";
import { AiFillHeart } from "react-icons/ai";

export const RankList = (state) => {
	console.log(state);

	const items = state.items;

	for (let i = 0; i < items.length; i++) {
		const element = items[i];
		if (i === 0) {
			element.position = 1;
		} else if (element.score === items[i - 1].score) {
			element.position = items[i - 1].position;
		} else {
			element.position = items[i - 1].position + 1;
		}
	}

	if (state.rank) {
		return (
			<>
				<ListBox>
					{items.map((item, index) => {
						return (
							<Row key={index}>
								<Item first={item.position == 1 ? 1 : 0}>
									<Rank
										first={item.position == 1 ? 1 : 0}
										second={item.position == 2 ? 1 : 0}
										third={item.position == 3 ? 1 : 0}
									>
										{item.position}
									</Rank>
									<Name>{item.name}</Name>
									<ScoreBox>
										<Score>
											{item.score} <Heart />
										</Score>
										<GoToButton></GoToButton>
									</ScoreBox>
								</Item>
							</Row>
						);
					})}
				</ListBox>
			</>
		);
	}
};

const ScoreBox = styled.div`
	display: flex;
	flex-direction: row;
	gap: 6rem;
	align-items: center;
`;

const Heart = styled(AiFillHeart)`
	color: #ff0000;
	padding-top: 0.3rem;
`;

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

export const ListBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin: 0 auto 2rem auto;
`;

//TODO: Add a prop to change the color of the row

export const Row = styled.div`
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	margin-top: 2rem;
	width: 100%;
	box-shadow: 0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.1);
`;

export const Item = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${({ first }) => (first ? " 1rem 3rem;" : "0 3rem")};
	gap: 1rem;

	@media screen and (max-width: 500px) {
		flex-direction: column;
		padding: ${({ first }) => (first ? " 1rem 3rem;" : "0 3rem")};

		& > p {
			margin: 0;
			padding: 0;
		}
	}
`;

export const Placeholder = (state) => {
	return (
		<Row>
			<Item>
				<PlaceholderContainer>{state.children}</PlaceholderContainer>
			</Item>
		</Row>
	);
};

const PlaceholderContainer = styled.div`
	width: 100%;
	text-align: center;
	font-size: 1rem;
`;
