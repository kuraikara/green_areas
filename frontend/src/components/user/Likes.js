import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../../components/Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item, Placeholder } from "../miscellaneous/List";

import useAuth from "../../hooks/useAuth";

import {
	ButtonGroup,
	UnlikeButton,
	GoToButton,
} from "../miscellaneous/Buttons";

function Likes({ username }) {
	const [likes, setLikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);
	const { redirectTo } = useMap();
	const nav = useNavigate();
	const { auth } = useAuth();

	useEffect(() => {
		const controller = new AbortController();
		if (should.current) {
			should.current = false;

			const fetchLikes = async () => {
				try {
					const response = await axiosPrivate.get(`/social/likes/${username}`, {
						signal: controller.signal,
					});
					setLikes(response.data.likes);
					console.log(response.data);

					setLoading(false);
				} catch (error) {
					console.error(error);
					setLoading(false);
				}
			};
			fetchLikes();
		} else {
			return () => {
				controller.abort();
			};
		}
	}, []);

	const unLike = async (id) => {
		setLoading(true);
		try {
			const response = await axiosPrivate.post("/social/unlike", null, {
				params: { polygon_id: id },
			});
			console.log(response.data);
			console.log(likes);
			setLikes(likes.filter((like) => like.id !== id));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <Loader />}

			<ListContainer>
				<ListBox>
					{!loading && likes.length === 0 && (
						<Placeholder>No likes</Placeholder>
					)}
					{!loading &&
						likes.length > 0 &&
						likes.map((like, index) => {
							return (
								<Row key={index}>
									<Item>
										<div>{like.name + " " + like.id}</div>
										<ButtonGroup>
											{auth.username == username && (
												<UnlikeButton onClick={() => unLike(like.id)} />
											)}
											<GoToButton onClick={() => redirectTo(like.id)} />
										</ButtonGroup>
									</Item>
								</Row>
							);
						})}
				</ListBox>
			</ListContainer>
		</>
	);
}

const ListContainer = styled.div`
	width: 75%;
	margin: auto;
`;

export default Likes;
