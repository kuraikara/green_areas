import React, { useState, useCallback, useRef } from "react";
import useLazyLoader from "../../hooks/useLazyLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import ListLazy from "../miscellaneous/ListLazy";

import useAuth from "../../hooks/useAuth";

import {
	ButtonGroup,
	UnlikeButton,
	GoToButton,
} from "../miscellaneous/Buttons";

function LikeLazy({ username }) {
	const axiosPrivate = useAxiosPrivate();
	const { redirectTo } = useMap();
	const nav = useNavigate();
	const { auth } = useAuth();

	const LikeItem = ({ item: like, items, setItems, setLoading }) => {
		const unLike = async (id) => {
			setLoading(true);
			try {
				const response = await axiosPrivate.post("/social/unlike", null, {
					params: { polygon_id: id },
				});
				console.log(response.data);
				setItems(items.filter((like) => like.id !== id));
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		return (
			<>
				<div> {like.name + " " + like.id} </div>
				<ButtonGroup>
					{auth.username == username && (
						<UnlikeButton onClick={() => unLike(like.id)} />
					)}
					<GoToButton onClick={() => redirectTo(like.id)} />
				</ButtonGroup>
			</>
		);
	};

	return <ListLazy api={`/social/likes/${username}`} element={LikeItem} />;
}

const ListContainer = styled.div`
	width: 75%;
	margin: auto;
`;

export default LikeLazy;
