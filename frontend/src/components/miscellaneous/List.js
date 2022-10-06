import React, { useState } from "react";
import styled from "styled-components";
import { Loader } from "../Miscellaneus";

import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const RankList = (state) => {
	console.log(state);

	const children = state.children;

	if (state.rank) {
		return (
			<>
				<ListBox>
					{state.items.map((item, index) => {
						return (
							<Row key={index}>
								<Item first={index == 0 ? 1 : 0}>
									<Rank
										first={index == 0 ? 1 : 0}
										second={index == 1 ? 1 : 0}
										third={index == 2 ? 1 : 0}
									>
										{index + 1}
									</Rank>
									<Name>{item.name}</Name>
									<Score>{item.score}</Score>
								</Item>
							</Row>
						);
					})}
				</ListBox>
			</>
		);
	}
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

export const ListBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin: 0 auto;
`;

export const Row = styled.div`
	padding: 1rem;
	background: #fff;
	border-radius: 1rem;
	margin-top: 1rem;
	width: 100%;
`;

export const Item = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${({ first }) => (first ? " 1rem 3rem;" : "0 3rem")};
`;
