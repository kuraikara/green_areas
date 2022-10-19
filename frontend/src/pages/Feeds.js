import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	Loader,
	ProfileLinkImage,
	ProfileLinkWithImage,
} from "../components/Miscellaneus";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useMap from "../hooks/useMap";
import {
	ListBox,
	Placeholder,
	Item,
	Row,
} from "../components/miscellaneous/List";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import useLazyLoader from "../hooks/useLazyLoader";

function Feeds() {
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);

	const [page, setPage] = useState(0);

	const {
		loading,
		items: feeds,
		error,
		hasMore,
		reload,
	} = useLazyLoader({
		query: "/social/feeds",
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

	const reloadItems = () => {
		reload();
		setPage(0);
	};

	return (
		<>
			<Navbar back={true} />
			<Title>Feeds</Title>
			<button onClick={() => reloadItems()}>Reload</button>

			<ListContainer>
				<ListBox>
					{!loading && feeds.length === 0 && (
						<Placeholder>Nothing new...</Placeholder>
					)}
					{feeds.length > 0 &&
						feeds.map((feed, index) => {
							if (feeds.length === index + 1) {
								return (
									<Row ref={lastItem} key={index}>
										<Item>
											<ItemContent feed={feed} />
										</Item>
									</Row>
								);
							}
							return (
								<Row key={index}>
									<Item>
										<ItemContent feed={feed} />
									</Item>
								</Row>
							);
						})}
				</ListBox>
			</ListContainer>
			{loading && <Loader />}
		</>
	);
}

const ItemContent = ({ feed }) => {
	const nav = useNavigate();
	const { redirectTo } = useMap();
	return (
		<>
			{feed.type == "like" ? (
				<>
					<Text>
						<ProfileLinkImage
							src={feed.img ? feed.img : "https://i.imgur.com/6VBx3io.png"}
						/>
						<Link onClick={() => nav("/user/" + feed.username)}>
							{feed.username}
						</Link>{" "}
						liked
						<Link onClick={() => redirectTo(feed.polygon_id)}>
							{feed.polygon_name}
						</Link>
					</Text>

					<When>{timestampToWhen(feed.when)}</When>
				</>
			) : (
				<>
					<Text>
						<ProfileLinkImage
							src={feed.img ? feed.img : "https://i.imgur.com/6VBx3io.png"}
						/>
						<Link onClick={() => nav("/user/" + feed.username)}>
							{feed.username}
						</Link>
						started following
						<Link onClick={() => nav("/user/" + feed.followed)}>
							{feed.followed}
						</Link>
					</Text>
					<When>{timestampToWhen(feed.when)}</When>
				</>
			)}
		</>
	);
};

const timestampToWhen = (timestamp) => {
	const date = new Date(timestamp * 1000);
	const now = new Date();
	const diff = now - date;
	const diffInSeconds = Math.floor(diff / 1000);
	const diffInMinutes = Math.floor(diff / 1000 / 60);
	const diffInHours = diff / 1000 / 60 / 60;
	if (diffInSeconds < 60) {
		return "Just now";
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} minutes ago`;
	} else if (diffInHours < 24) {
		return `${Math.floor(diffInHours)} hours ago`;
	} else {
		return `${Math.floor(diffInHours / 24)} days ago`;
	}
};

const Text = styled.div`
	display: flex;
	flex-direction: row;
	font-size: 1.2rem;
	gap: 0.5rem;
	align-items: center;
`;

const Link = styled.a`
	color: #000;
	text-decoration: underline;
	cursor: pointer;
	font-weight: bold;

	&:hover {
		color: var(--hover-green);
	}
`;

const When = styled.div`
	color: #000;
	font-size: 0.8rem;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ListContainer = styled.div`
	width: 75%;
	margin: auto;
	margin-bottom: 10vh;
`;

const Title = styled.h1`
	text-align: center;
	margin-top: 5vh;
`;
export default Feeds;
