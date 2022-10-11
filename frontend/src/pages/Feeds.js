import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Miscellaneus";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {ListBox, Placeholder, Item, Row} from '../components/miscellaneous/List'
import styled from "styled-components";
import Navbar from '../components/Navbar'

function Feeds() {
	const [feeds, setFeeds] = useState([]);
	const [loading, setLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);

	useEffect(() => {
		const controller = new AbortController();
		if (should.current) {
			should.current = false;

			const fetchFeeds = async () => {
				try {
					const response = await axiosPrivate.get(`/social/feeds`, {
						signal: controller.signal,
					});
					setFeeds(response.data.feeds);
					console.log(response.data.feeds);

					setLoading(false);
				} catch (error) {
					console.error(error);
					setLoading(false);
				}
			};
			fetchFeeds();
		} else {
			return () => {
				controller.abort();
			};
		}
	}, []);

	/* return (
		<div>
			<h1>Feeds</h1>
			{loading ? (
				<div>Loading...</div>
			) : (
				<div>
					{console.log(feeds)}
					{feeds.map((feed, index) => {
						return (
							<div key={index}>
								{feed.type == "like" ? (
									<div>
										<p>
											{feed.username} liked {feed.polygon_name} on{" "}
											{new Date(feed.when * 1000).toISOString()}
										</p>
									</div>
								) : (
									<div>
										<p>
											{feed.username} started following {feed.followed} on
											{new Date(feed.when * 1000).toISOString()}
										</p>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	); */



	return(
		<>
		<Navbar back={true} />
		<Title>Feeds</Title>
		{
			loading ? 
			(<Loader />)
			: (
<ListContainer>
				<ListBox>
					{!loading && feeds.length === 0 && (
						<Placeholder>Nothing new...</Placeholder>
					)}
					{!loading &&
						feeds.length > 0 &&
						feeds.map((feed, index) => {
							return (
								<Row key={index}>
									<Item>
									{feed.type == "like" ? (
									<div>
										<p>
											{feed.username} liked {feed.polygon_name} on{" "}
											{new Date(feed.when * 1000).toISOString()}
										</p>
									</div>
								) : (
									<div>
										<p>
											{feed.username} started following {feed.followed} on
											{new Date(feed.when * 1000).toDateString()}
										</p>
									</div>
								)}
									</Item>
								</Row>
							);
						})}
				</ListBox>
			</ListContainer>
			)
		}
		</>
	)
}
const ListContainer = styled.div`
	width: 75%;
	margin: auto;
	margin-bottom: 10vh;
`;

const Title = styled.h1`
text-align: center;

`;
export default Feeds;
