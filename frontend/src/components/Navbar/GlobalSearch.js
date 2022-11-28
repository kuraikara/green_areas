import React, { useState, useEffect, useRef, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader, ProfileLinkImage } from "../Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { BiMap } from "react-icons/bi";
import { IoHeartDislikeSharp } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import useLazyLoader from "../../hooks/useLazyLoader";
import { IoIosSearch } from "react-icons/io";
import {
	AlreadyFollowedButton,
	ButtonGroup,
	FollowButton,
	UnfollowButton,
	ViewProfileButton,
} from "../miscellaneous/Buttons";

import { MdPark, MdKeyboardArrowRight } from "react-icons/md";

export default function GlobalSearch({ addFollow }) {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const searchRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const should = useRef(true);
	const nav = useNavigate();

	useEffect(() => {
		if (should.current) {
			should.current = false;
			console.log("search");
			document.addEventListener("mousedown", (event) => {
				if (
					searchRef.current != null &&
					!searchRef.current.contains(event.target)
				) {
					setIsOpen(false);
				}
			});
		}
		return () => {
			document.removeEventListener("mousedown", (event) => {});
		};
	}, []);

	const fetchSearch = async (value) => {
		if (value == "") return;
		try {
			setLoading(true);
			const response = await axiosPrivate.get("/social/search/" + value);
			console.log(response.data);
			setResults(response.data.results);
			/* let data = response.data.results;
			setResults([
				data[data.length - 1],
				{ type: "park", name: "Parco nazionale del Gran Paradiso" },
			]); */
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const handleClick = (item) => {
		item.type == "user"
			? nav("/user/" + item.name)
			: nav("/redirect?id=" + item.id);
	};

	return (
		<Bar ref={searchRef} open={isOpen && results.length > 0 ? 1 : 0}>
			<Field onClick={() => setIsOpen(true)}>
				<Input
					type="text"
					placeholder="Search..."
					onChange={(e) => {
						fetchSearch(e.target.value) && setSearch(e.target.value);
					}}
					value={search}
				/>
				<Icon />
			</Field>
			{isOpen && (
				<List>
					{loading && <Loader />}
					{!loading && search != "" && results.length === 0 && (
						<ListItemNoHover key={0}>No results found</ListItemNoHover>
					)}
					{!loading && results.length > 0 && (
						<>
							{results.map((item, index) => {
								//if (user.username == auth.username) return;
								return (
									<ListItem key={index}>
										<Separator />
										<Item
											onClick={() => {
												setIsOpen(false);
												handleClick(item);
											}}
										>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.5rem",
												}}
											>
												{item.type === "user" ? (
													<ProfileLinkImage src={item.img} />
												) : (
													<PolyIcon />
												)}
												<Text>{item.name}</Text>
												<ArrowIcon />
											</div>
										</Item>
									</ListItem>
								);
							})}
						</>
					)}
				</List>
			)}
		</Bar>
	);
}

const Icon = styled(IoIosSearch)``;

const PolyIcon = styled(MdPark)`
	min-width: 50px;
	min-height: 50px;
	color: var(--primary-green);
`;

const ArrowIcon = styled(MdKeyboardArrowRight)`
	min-height: 50px;
	min-width: 30px;
	color: var(--primary-green);
`;

export const Bar = styled.div`
	z-index: 100;
	background: #fff;
	border-radius: ${({ open }) => (open ? "1rem 1rem 0 0" : "1rem")};
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	position: relative;
	margin: 0.5rem 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

export const List = styled.div`
	max-height: 25vh;
	overflow-y: scroll;
	position: absolute;
	width: 100%;
	height: max-content;
	background: #fff;
	border-radius: 0 0 1rem 1rem;
	top: 100%;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

	::-webkit-scrollbar {
		width: 0.5rem;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	::-webkit-scrollbar-thumb {
		background: var(--hover-green);
		border-radius: 0.5rem;
	}
`;

export const Separator = styled.div`
	height: 2px;
	background: var(--primary-green);
	opacity: 0.2;
`;

export const ListItem = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ListItemNoHover = styled.div`
	padding: 0.5rem 1rem 0.5rem 1.5rem;
	font-size: 1rem;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

export const Field = styled.div`
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem 0.5rem 1rem;

	color: var(--primary-green);
	font-size: 1.5rem;
	text-decoration: none;

	&:hover {
		color: var(--primary-green);
	}
`;

export const Input = styled.input`
	border: 0;
	font-size: 1rem;
	padding: 0.5rem;

	&:focus {
		outline: none;
	}
`;

const Item = styled.div`
	padding: 0.5rem 0.5rem;
	font-size: 1rem;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	&:hover {
		background: var(--green4);
	}
`;

const Text = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2; /* number of lines to show */
	line-clamp: 2;
	-webkit-box-orient: vertical;
`;

const UserBar = styled(Bar)`
	position: relative;
	${({ open }) => open && "border-radius: 1rem 1rem 0 0;"}
	height: fit-content;
`;

const UserList = styled(List)`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	z-index: 1;
	background-color: #fff;
	border-radius: 0 0 1rem 1rem;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const ListContainer = styled.div`
	width: 70%;
	margin: auto;
`;

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
