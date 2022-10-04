import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader } from "../Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item } from "../miscellaneous/List";
import { BiMap } from "react-icons/bi";
import { IoHeartDislikeSharp } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import {
	Bar,
	Field,
	Input,
	Icon,
	List,
	ListItem,
	Separator,
} from "../SearchField";

function Follows({ username }) {
	const [follows, setFollows] = useState([]);
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

			const fetchFollows = async () => {
				try {
					const response = await axiosPrivate.get(
						`/social/follows/${username}`,
						{
							signal: controller.signal,
						}
					);
					setFollows(response.data.follows);
					console.log(response.data);

					setLoading(false);
				} catch (error) {
					console.error(error);
					setLoading(false);
				}
			};
			fetchFollows();
		} else {
			return () => {
				controller.abort();
			};
		}
	}, []);

	/* const unLike = async (id) => {
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
	}; */

	return (
		<>
			{!loading && (
				<SearchContainer>
					<UserSearch followed={follows} />
				</SearchContainer>
			)}
			{loading && <Loader />}
			{!loading && follows.length === 0 && <div>No follow</div>}
			{!loading && follows.length > 0 && (
				<>
					<ListBox>
						{follows.map((follow, index) => {
							return (
								<Row key={index}>
									<Item>
										<div>{follow.username}</div>
									</Item>
								</Row>
							);
						})}
					</ListBox>
				</>
			)}
		</>
	);
}

const SearchContainer = styled.div`
	margin: 2rem 0 5rem 0;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const UserSearch = ({ followed }) => {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const searchRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const should = useRef(true);

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

	const searchUser = async (value) => {
		try {
			setLoading(true);
			const response = await axiosPrivate.get("/social/searchuser/" + value);
			console.log(response.data);
			setUsers(response.data.users);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	return (
		<Bar ref={searchRef} open={isOpen ? 1 : 0}>
			<Field onClick={() => setIsOpen(true)}>
				<Input
					type="text"
					placeholder="Search an user..."
					onChange={(e) => {
						e.target.value != "" &&
							searchUser(e.target.value) &&
							setSearch(e.target.value);
					}}
				/>
				<Icon />
			</Field>
			{isOpen && (
				<List>
					{loading && <Loader />}
					{!loading && search != "" && users.length === 0 && (
						<ListItem key={0}>No user found</ListItem>
					)}
					{!loading && users.length > 0 && (
						<>
							{users.map((user, index) => {
								return (
									<>
										<Separator />
										<ListItem key={index}>
											<div>{user.username}</div>
											{user.username !== auth.username && (
												<Button
													onClick={() => {
														console.log(user.username);
													}}
												>
													Follow
												</Button>
											)}
										</ListItem>
									</>
								);
							})}
						</>
					)}
				</List>
			)}
		</Bar>
	);
};

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

export default Follows;
