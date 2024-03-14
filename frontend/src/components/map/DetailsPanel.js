import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { IoMdClose, IoMdExpand } from "react-icons/io";
import { AiFillLike, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import useMap from "../../hooks/useMap";
import { Loader } from "../Miscellaneus";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/greenServer";
import { SharedAlert } from "../Miscellaneus";

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
	const [followedLiking, setFollowedLiking] = useState([]);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState(false);
	const { auth } = useAuth();
	const nav = useNavigate();

	const fetchLikes = async () => {
		try {
			setLoading(true);
			const axiosInstance = auth ? axiosPrivate : axios;
			const response = await axiosInstance.get("/social/polylikes", {
				params: { polygon_id: polygonDetails.properties.id },
			});

			setLikes(response.data.likes);
			setLiked(response.data.liked);
			setFollowedLiking(response.data.followed_liking);
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
		if (auth) {
			try {
				const response = await axiosPrivate.post("/social/like", null, {
					params: { polygon_id: id },
				});
				console.log(response);
				response.status == 200 && console.log("liked");
				setLikes(response.data.likes);
				setLiked(true);
			} catch (error) {
				console.error(error);
			}
		} else {
			nav("/login");
		}
	};

	const unlike = async (id) => {
		try {
			const response = await axiosPrivate.post("/social/unlike", null, {
				params: { polygon_id: id },
			});
			console.log(response);
			response.status == 200 && console.log("unliked");
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
					{/* <div>{polygonDetails.properties.id}</div> */}
					<Name>{polygonDetails.properties.name}</Name>
					<LikeShareButtons>
						<Button>
							{liked ? (
								<LikedIcon
									onClick={() => unlike(polygonDetails.properties.id)}
								/>
							) : (
								<LikeIcon onClick={() => like(polygonDetails.properties.id)} />
							)}
							<p>{likes}</p>
						</Button>
						<Button>
							<ShareIcon onClick={() => share(polygonDetails.properties.id)} />
							{copied && <SharedAlert>Copied!</SharedAlert>}
						</Button>
					</LikeShareButtons>
					{
						/* followedLiking */ ["umcgourty9"].length > 0 && (
							<>
								<FollowedLiking>
									{
										/* followedLiking */ ["umcgourty9"].map((user, index) => (
											<>
												{index != 0 && <>{", "}</>}
												<FollowedLikingUser
													key={index}
													onClick={() => nav("/user/" + user)}
												>
													{user}
												</FollowedLikingUser>
											</>
										))
									}
									{" like this place"}
								</FollowedLiking>
							</>
						)
					}
					<Description>
						Il parco del Valentino è un famoso parco pubblico di Torino, sito
						lungo le rive del Po. È situato nel quartiere di San Salvario, a
						ridosso del centro storico torinese. Confina: a est con la sponda
						sinistra del fiume Po; a nord con corso Vittorio Emanuele II, dove
						terminano i Murazzi;{" "}
						<a href="https://it.wikipedia.org/wiki/Parco_del_Valentino">
							Wikipedia
						</a>
					</Description>
					<Info>
						<Text>
							<b>Indirizzo:</b> Corso Massimo d'Azeglio, 10126 Torino TO
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Reparti:</b> Area cani
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Orari:</b> Aperto 24 ore su 24
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Provincia:</b> Città Metropolitana di Torino
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Superficie:</b> 42,10 ettari
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Apertura:</b> Tutti i giorni
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Gestore:</b> Città di Torino
						</Text>
					</Info>
					<Info>
						<Text>
							<b>Stato:</b> Italia
						</Text>
					</Info>
				</>
			)}
		</CollapsiblePanel>
	);
}

const Description = styled.div`
	margin: 2rem 3rem;
	text-align: left;
`;

const Label = styled.div`
	margin: 10px 0;
`;

const Info = styled.div`
	margin: 2rem 3rem;
	text-align: left;
`;

const Text = styled.p``;

const FollowedLiking = styled.div`
	font-size: 1rem;
	padding: 0.5rem;
`;

const FollowedLikingUser = styled.a`
	font-weight: 600;
	color: #000;
	text-decoration: underline;
	cursor: pointer;

	&:hover {
		color: var(--primary-green);
	}
`;

const Name = styled.div`
	font-size: 1.5rem;
	font-weight: 600;
	margin: 1rem 0;
`;

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

	position: relative;

	&:hover {
		& > svg {
			transition: all 0.5s ease-in-out;
			transform: scale(1.2);
		}
	}

	& > p {
		font-size: 1.2rem;
		position: absolute;
		top: 80%;
		width: 100%;
		text-align: center;
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
