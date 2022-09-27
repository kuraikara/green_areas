import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../../components/Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";

function Likes() {
	const [likes, setLikes] = useState([]);
	const [loading, setLoading] = useState(true);
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);
	const { setPolygonDetails } = useMap();
	const nav = useNavigate();

	useEffect(() => {
		const controller = new AbortController();
		if (should.current) {
			should.current = false;

			const fetchLikes = async () => {
				try {
					const response = await axiosPrivate.get("/social/likes", {
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
			response.data.success &&
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
		<LikesBox>
			<SubTitle>Your liked places</SubTitle>
			{loading && <Loader />}
			{!loading && likes.length === 0 && <div>No likes</div>}
			{!loading && likes.length > 0 && (
				<ul>
					{likes.map((like) => (
						<Like key={like.properties.id} like={like}>
							<div>{like.properties.id + " Name"}</div>
							<div>
								<Button onClick={() => unLike(like.properties.id)}>
									Unlike
								</Button>
								<Button onClick={() => viewOnMap(like)}>View Park</Button>
							</div>
						</Like>
					))}
				</ul>
			)}
		</LikesBox>
	);
}
const LikesBox = styled.div`
	background-color: #fff;
`;
const SubTitle = styled.h3`
	padding: 2rem 0;
	text-align: center;
	background-color: #fff;
`;

const Like = styled.li`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
	padding: 0.5rem;
	border-bottom: 1px solid #ccc;
	background-color: #fff;
`;

export default Likes;
