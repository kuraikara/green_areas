import React, { useState, useEffect, useRef, useCallback } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styled from "styled-components";
import { Button, Loader, ProfileLinkImage } from "../Miscellaneus";
import useMap from "../../hooks/useMap";
import { useNavigate } from "react-router-dom";
import { ListBox, Row, Item, Placeholder } from "../miscellaneous/List";
import { BiMap } from "react-icons/bi";
import { IoHeartDislikeSharp } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import useLazyLoader from "../../hooks/useLazyLoader";
import {
	Bar,
	Field,
	Input,
	Icon,
	List,
	ListItemNoHover,
	Separator,
} from "../SearchField";
import {
	AlreadyFollowedButton,
	ButtonGroup,
	FollowButton,
	UnfollowButton,
	ViewProfileButton,
} from "../miscellaneous/Buttons";

function Follows({ username }) {
	const axiosPrivate = useAxiosPrivate();
	const should = useRef(true);
	const { setPolygonDetails } = useMap();
	const nav = useNavigate();
	const { auth } = useAuth();

	/* useEffect(() => {
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
	}, []); */

	const [page, setPage] = useState(0);
	useEffect(() => {
		setLoading(true);
		setPage(0);
		setFollows([]);
	}, [username]);

	const {
		loading,
		setLoading,
		items: follows,
		setItems: setFollows,
		error,
		hasMore,
		reload,
	} = useLazyLoader({
		query: `/social/follows/${username}`,
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
	const unfollow = async (username) => {
		try {
			console.log("unfollow");
			setLoading(true);
			const res = await axiosPrivate.post("/social/unfollow", null, {
				params: {
					username: username,
				},
			});
			console.log(res);
			setFollows(follows.filter((item) => item.username != username));
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	const follow = async (user) => {
		try {
			setLoading(true);
			const res = await axiosPrivate.post("/social/follow", null, {
				params: {
					username: user.username,
				},
			});
			console.log(res);
			setFollows((prev) =>
				prev.map((item) =>
					item.username == user.username ? (item.followed = true) : item
				)
			);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	const addFollow = (new_follow) => {
		setFollows((prev) => [...prev, new_follow]);
	};

	return (
		<>
			{/* {auth.username == username && (
				<SearchContainer>
					<UserSearch followed={follows} addFollow={addFollow} />
				</SearchContainer>
			)} */}

			<ListContainer>
				<ListBox>
					{!loading && follows.length === 0 && (
						<Placeholder>No follow</Placeholder>
					)}
					{follows.length > 0 &&
						follows.map((follow, index) => {
							if (follows.length === index + 1) {
								return (
									<Row ref={lastItem} key={index}>
										<Item>
											<User>
												<ProfileLinkImage src={follow.img} />
												<Name>{follow.username}</Name>
											</User>
											<ButtonGroup>
												{auth.username == username ? (
													<UnfollowButton
														onClick={() => unfollow(follow.username)}
													>
														unfollow
													</UnfollowButton>
												) : (
													<>
														{follow.is_followed ? (
															<AlreadyFollowedButton />
														) : (
															<FollowButton onClick={() => follow(follow)} />
														)}
													</>
												)}
												<ViewProfileButton
													onClick={() => {
														console.log(follow.username);
														nav("/user/" + follow.username);
													}}
												>
													view profile
												</ViewProfileButton>
											</ButtonGroup>
										</Item>
									</Row>
								);
							}
							return (
								<Row key={index}>
									<Item>
										<User>
											<ProfileLinkImage src={follow.img} />
											<Name>{follow.username}</Name>
										</User>
										<ButtonGroup>
											{auth.username == username ? (
												<UnfollowButton
													onClick={() => unfollow(follow.username)}
												>
													unfollow
												</UnfollowButton>
											) : (
												<>
													{follow.is_followed ? (
														<AlreadyFollowedButton />
													) : (
														<FollowButton onClick={() => follow(follow)} />
													)}
												</>
											)}
											<ViewProfileButton
												onClick={() => nav("/user/" + follow.username)}
											>
												view profile
											</ViewProfileButton>
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

const User = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
	gap: 0.5rem;
`;

const Name = styled.p`
	padding-right: 1rem;
`;

const SearchContainer = styled.div`
	margin: 5rem 0 1rem 0;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const UserSearch = ({ addFollow }) => {
	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
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

	const searchUser = async (value) => {
		if (value == "") return;
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

	const follow = async (user) => {
		try {
			setLoading(true);
			const res = await axiosPrivate.post("/social/follow", null, {
				params: {
					username: user.username,
				},
			});
			console.log(res);
			setIsOpen(false);
			addFollow(user);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<UserBar ref={searchRef} open={isOpen && users.length > 0 ? 1 : 0}>
			<Field onClick={() => setIsOpen(true)}>
				<Input
					type="text"
					placeholder="Search an user..."
					onChange={(e) => {
						searchUser(e.target.value) && setSearch(e.target.value);
					}}
					value={search}
				/>
				<Icon />
			</Field>
			{isOpen && (
				<UserList>
					{loading && <Loader />}
					{!loading && search != "" && users.length === 0 && (
						<ListItemNoHover key={0}>No user found</ListItemNoHover>
					)}
					{!loading && users.length > 0 && (
						<>
							{users.map((user, index) => {
								//if (user.username == auth.username) return;
								return (
									<>
										<Separator />
										<ListItemNoHover key={index}>
											<Link
												onClick={() => {
													setIsOpen(false);
													nav("/user/" + user.username);
												}}
											>
												{user.username}
											</Link>
											{user.username != auth.username && user.is_followed ? (
												<AlreadyFollowedButton />
											) : (
												user.username != auth.username && (
													<FollowButton onClick={() => follow(user)}>
														Follow
													</FollowButton>
												)
											)}
										</ListItemNoHover>
									</>
								);
							})}
						</>
					)}
				</UserList>
			)}
		</UserBar>
	);
};

const Link = styled.a`
	color: #000;
	text-decoration: underline;
	cursor: pointer;
	font-weight: 700;

	&:hover {
		color: var(--primary-green);
	}
`;

const UserBar = styled(Bar)`
	position: relative;
	${({ open }) => open && "border-radius: 1rem 1rem 0 0;"}
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

export default Follows;
