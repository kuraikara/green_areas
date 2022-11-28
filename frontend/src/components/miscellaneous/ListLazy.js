import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { Loader } from "../Miscellaneus";

import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GoToButton } from "./Buttons";
import { AiFillHeart } from "react-icons/ai";

import useLazyLoader from "../../hooks/useLazyLoader";

const ListLazy = ({ api, element: Element }) => {
	const [page, setPage] = useState(0);

	const { loading, setLoading, items, setItems, error, hasMore, reload } =
		useLazyLoader({
			query: api,
			page: page,
		});

	const observer = useRef();
	const lastItem = useCallback(
		(node) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	return (
		<>
			<ListBox>
				{items.map((item, index) => {
					if (items.length === index + 1) {
						return (
							<Row ref={lastItem} key={index}>
								<Item>
									<Element
										item={item}
										items={items}
										setItems={setItems}
										loading={loading}
										setLoading={setLoading}
									></Element>
								</Item>
							</Row>
						);
					}
					return (
						<Row key={index}>
							<Item>
								<Element
									item={item}
									items={items}
									setItems={setItems}
									loading={loading}
									setLoading={setLoading}
								></Element>
							</Item>
						</Row>
					);
				})}
			</ListBox>
		</>
	);
};

export default ListLazy;

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
