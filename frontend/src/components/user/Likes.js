import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../../components/Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item } from "../miscellaneous/List";

import useAuth from "../../hooks/useAuth";

import { ButtonGroup, UnlikeButton, GoToButton} from '../miscellaneous/Buttons'

function Likes({ username }) {
	const [likes, setLikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);
	const { setPolygonDetails } = useMap();
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
		try {
			const response = await axiosPrivate.post("/social/unlike", null, {
				params: { polygon_id: id },
			});
			console.log(response.data);
			setLikes(likes.filter((like) => like.properties.id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	const viewOnMap = (poly) => {
		console.log(poly);
		setPolygonDetails(poly);
		nav("/map");
	};

	return (
		<>
			{loading && <Loader />}
			{!loading && likes.length === 0 && <div>No likes</div>}
			{!loading && likes.length > 0 && (
				<ListContainer>
				<ListBox>
					{likes.map((like, index) => {
						return (
							<Row key={index}>
								<Item>
									<div>{like.name + " " + like.id}</div>
									<ButtonGroup>
										{auth.username == username && (
											<UnlikeButton onClick={() => unLike(like.id)} />
										)}
										<GoToButton onClick={() => viewOnMap(like)} />
									</ButtonGroup>
								</Item>
							</Row>
						);
					})}
				</ListBox>
				</ListContainer>
			)}
		</>
	);
}



const ListContainer = styled.div`
	width: 75%;
	margin: auto;
`;



export default Likes;
