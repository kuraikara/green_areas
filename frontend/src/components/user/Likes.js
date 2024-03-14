import React, { useState, useCallback, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../../components/Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item, Placeholder } from "../miscellaneous/List";

import useAuth from "../../hooks/useAuth";
import useLazyLoader from "../../hooks/useLazyLoader";

import {
	ButtonGroup,
	UnlikeButton,
	GoToButton,
} from "../miscellaneous/Buttons";

function Likes({ username }) {
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);
	const { redirectTo } = useMap();
	const nav = useNavigate();
	const { auth } = useAuth();

	const [page, setPage] = useState(0);

	const {
		loading,
		setLoading,
		items: likes,
		setItems: setLikes,
		error,
		hasMore,
		reload,
	} = useLazyLoader({
		query: `/social/likes/${username}`,
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

	/* useEffect(() => {
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
	}, []); */

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
			<ListContainer>
				<ListBox>
					{!loading && likes.length === 0 && (
						<Placeholder>No likes</Placeholder>
					)}
					{likes.length > 0 &&
						likes.map((like, index) => {
							if (likes.length === index + 1) {
								return (
									<Row ref={lastItem} key={index}>
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
							}
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
			{loading && <Loader />}
		</>
	);
}

const ListContainer = styled.div`
	width: 75%;
	margin: auto;
`;

export default Likes;
