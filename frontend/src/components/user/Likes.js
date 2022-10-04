import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../../components/Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item } from "../miscellaneous/List";
import { BiMap } from "react-icons/bi";
import { IoHeartDislikeSharp } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";

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
				<ListBox>
					{likes.map((like, index) => {
						return (
							<Row key={index}>
								<Item>
									<div>{like.name + " " + like.id}</div>
									<Buttons>
										{auth.username == username && (
											<Unlike onClick={() => unLike(like.id)} />
										)}
										<Goto onClick={() => viewOnMap(like)} />
									</Buttons>
								</Item>
							</Row>
						);
					})}
				</ListBox>
			)}
		</>
	);
}

const Buttons = styled.div`
	display: flex;
	gap: 3rem;

	& > * {
		cursor: pointer;
		border-radius: 50%;
		padding: 0.5rem;
		font-size: 3rem;
		transition: all 0.5s ease-in-out;
	}
`;

const Unlike = styled(IoHeartDislikeSharp)`
	color: #ff0000;

	&:hover {
		color: #fff;
		background-color: #ff0000;
	}
`;
const Goto = styled(BiMap)`
	color: #000;

	&:hover {
		color: #fff;
		background-color: #000;
	}
`;

export default Likes;
