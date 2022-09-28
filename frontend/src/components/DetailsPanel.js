import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IoMdClose, IoMdExpand } from "react-icons/io";
import { AiFillLike, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import useMap from "../hooks/useMap";
import { Loader } from "./Miscellaneus";

import { BASE_URL } from "../apis/greenServer";

import {
	MdOutlineExpandLess,
	MdOutlineExpandMore,
	MdClose,
} from "react-icons/md";

export default function DetailsPanel() {
	const [expanded, setExpanded] = useState(false);
	const panelRef = useRef();
	const should = useRef(true);
	const axiosPrivate = useAxiosPrivate();
	const { polygonDetails, setPolygonDetails } = useMap();
	const [likes, setLikes] = useState(0);
	const [liked, setLiked] = useState(false);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);

	const fetchLikes = async () => {
		try {
			const response = await axiosPrivate.get("/social/polylikes", {
				params: { polygon_id: polygonDetails.properties.id },
			});

			setLikes(response.data.likes);
			setLiked(response.data.liked);
			console.log(response.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (polygonDetails) {
			setLoading(true);
			setLikes(null);
			setLiked(false);
			fetchLikes();
		}
	}, [polygonDetails]);

	useEffect(() => {
		if (should.current) {
			should.current = false;
			fetchLikes();
			console.log(polygonDetails);
			document.addEventListener("mousedown", (event) => {
				if (
					panelRef.current != null &&
					!panelRef.current.contains(event.target)
				) {
					setExpanded(false);
				}
			});
		}
		return () => {
			document.removeEventListener("mousedown", (event) => {});
		};
	}, []);

	const like = async (id) => {
		try {
			const response = await axiosPrivate.post("/social/like", null, {
				params: { polygon_id: id },
			});
			console.log(response.data);
			response.data.success &&
				console.log("liked") &&
				setLikes(response.data.likes);
			setLiked(true);
		} catch (error) {
			console.error(error);
		}
	};

	const unlike = async (id) => {
		try {
			const response = await axiosPrivate.post("/social/unlike", null, {
				params: { polygon_id: id },
			});
			console.log(response.data);
			response.data.success &&
				console.log("unliked") &&
				setLikes(response.data.likes);
			setLiked(false);
		} catch (error) {
			console.error(error);
		}
	};

	const share = (id) => {
		navigator.clipboard.writeText("http://localhost:3000/redirect?id=" + id);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<CollapsiblePanel ref={panelRef} expanded={expanded}>
			<CloseIcon
				onClick={() => {
					setPolygonDetails(null);
					setLikes(null);
				}}
			/>
			{!expanded ? (
				<ExpandIcon
					onClick={() => {
						setExpanded(true);
					}}
				/>
			) : (
				<CollapseIcon
					onClick={() => {
						setExpanded(false);
					}}
				/>
			)}
			{loading ? (
				<Loader />
			) : (
				<>
					<div>{polygonDetails.properties.id}</div>
					<LikeShareButtons>
						<Button>
							{liked ? (
								<LikedIcon
									onClick={() => unlike(polygonDetails.properties.id)}
								/>
							) : (
								<LikeIcon onClick={() => like(polygonDetails.properties.id)} />
							)}
						</Button>
						<Button>
							<ShareIcon onClick={() => share(polygonDetails.properties.id)} />
							{copied && <SharedAlert>Copied!</SharedAlert>}
						</Button>
					</LikeShareButtons>
				</>
			)}
		</CollapsiblePanel>
	);
}

const CollapsiblePanel = styled.div`
	z-index: 100;
	background-color: #fff;
	position: absolute;
	right: 20px;
	bottom: 1.5rem;
	border-radius: 1rem;
	width: 35%;
	height: calc(100vh - 2.5rem);
	text-align: center;
	padding-top: 1rem;
	animation-duration: 1s;
	animation-name: slidein;
	animation-direction: horizontal;
	overflow: hidden;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	transition: height 1s;

	@keyframes slidein {
		from {
			width: 0%;
		}

		to {
			width: 35%;
		}
	}

	@media screen and (max-width: 1000px) {
		width: calc(100vw - 1rem);
		left: 0.5rem;
		height: ${({ expanded }) => (expanded ? "85%" : "40%")};
		animation-direction: vertical;

		@keyframes slidein {
			from {
				height: 0%;
			}

			to {
				height: 40%;
			}
		}
	}
`;

const CloseIcon = styled(MdClose)`
	position: absolute;
	top: 5px;
	left: 10px;
	font-size: 4rem;
	color: var(--primary-green);
	cursor: pointer;
`;

const ExpandIcon = styled(MdOutlineExpandLess)`
	position: absolute;
	top: 5px;
	right: 10px;
	font-size: 4rem;
	color: var(--primary-green);
	cursor: pointer;
	@media screen and (min-width: 1000px) {
		display: none;
	}
`;

const CollapseIcon = styled(MdOutlineExpandMore)`
	position: absolute;
	top: 5px;
	right: 10px;
	font-size: 4rem;
	color: var(--primary-green);
	cursor: pointer;
	@media screen and (min-width: 1000px) {
		display: none;
	}
`;

const LikeShareButtons = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 3rem;
	margin-bottom: 1rem;
`;

const Button = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-grow: 1;
	cursor: pointer;
	padding: 1rem 0;
	font-size: 3rem;
	transition: all 0.5s ease-in-out;
	&:hover {
		transform: scale(1.2);
	}
`;

const LikeIcon = styled(AiOutlineHeart)`
	font-size: 3rem;
`;

const LikedIcon = styled(AiFillHeart)`
	font-size: 3rem;
	color: var(--primary-green);
`;

const ShareIcon = styled(FaShareAlt)`
	font-size: 2.5rem;
	color: black;
`;

const SharedAlert = styled.div`
	position: absolute;
	width: 50%;
	top: 100%;
	left: 25%;
	font-size: 1rem;
	font-weight: 900;
	padding: 0.5rem 0;
	color: var(--primary-green);
	background-color: #000;
	animation-duration: 2s;
	animation-name: slideinout;
	animation-direction: horizontal;
	animation-iteration-count: 1;
	border-radius: 0.5rem;
	@keyframes slideinout {
		from {
			opacity: 0%;
		}

		to {
			opacity: 0%;
		}

		50% {
			opacity: 100%;
		}
	}
`;
