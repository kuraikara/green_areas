import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import React, { useState, useEffect } from "react";
import { ColorRing } from "react-loader-spinner";
import { UnfollowButton, FollowButton } from "./miscellaneous/Buttons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FaShareAlt } from "react-icons/fa";

export const ProfileHeader = ({ user }) => {
	console.log(user);
	const [profileUser, setProfileUser] = useState(null);
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setProfileUser(user);
	}, [user]);

	const unfollow = async (username) => {
		try {
			console.log("unfollow");
			const res = await axiosPrivate.post("/social/unfollow", null, {
				params: {
					username: username,
				},
			});

			console.log(res);
			setProfileUser(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const follow = async (username) => {
		try {
			console.log("unfollow");
			const res = await axiosPrivate.post("/social/follow", null, {
				params: {
					username: username,
				},
			});
			console.log(res);
			setProfileUser(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const share = () => {
		navigator.clipboard.writeText(
			"http://localhost:3000/user/" + profileUser.username
		);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	};

	return (
		<>
			{profileUser ? (
				<ProfileBox>
					<ProfileImage
						img={profileUser.img}
						width={"150px"}
						height={"150px"}
					/>
					<ProfileName>{profileUser.username}</ProfileName>
					<ProfileNumbers>
						Followed {profileUser.followed} - Followers {profileUser.followers}
					</ProfileNumbers>
					{auth.username != profileUser.username && (
						<ProfileFollow>
							{profileUser.is_followed ? (
								<UnfollowButton onClick={() => unfollow(user.username)} />
							) : (
								<FollowButton onClick={() => follow(user.username)} />
							)}
						</ProfileFollow>
					)}
					<ProfileShare>
						<ShareIcon onClick={() => share()}>
							<FaShareAlt />
						</ShareIcon>
						{copied && <SharedAlert> Copied to clipboard!</SharedAlert>}
					</ProfileShare>
				</ProfileBox>
			) : (
				<Loader />
			)}
		</>
	);
};

export const ProfileLinkImage = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 1px solid black;
`;

const ShareIcon = styled.div`
	color: #000;
	font-size: 3rem;
	width: 4rem;
	height: 4rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	transition: all 0.5s ease-in-out;
	cursor: pointer;

	&:hover {
		background: #000;
		color: var(--green5);
	}
`;

const ProfileShare = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 10vw;
	top: 2rem;
	right: 2rem;
`;

const ProfileFollow = styled.div`
	margin-top: 1rem;
`;

const ProfileBox = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 1rem;
	margin-bottom: 2rem;
	position: relative;
`;

const ProfileNumbers = styled.div`
	font-size: 1rem;
	color: #999;
	margin-top: 1rem;
`;

export const ProfileImage = ({ img, width, height }) => {
	return (
		<ImgBox width={width} height={height}>
			{img ? (
				<img src={img} alt="Profile" />
			) : (
				<img src="https://via.placeholder.com/150" alt="Profile" />
			)}
		</ImgBox>
	);
};

const ImgBox = styled.div`
	${({ width }) => "width: " + width + ";"};
	${({ height }) => "height: " + height + ";"};
	border-radius: 50%;
	overflow: hidden;
	margin: 1rem 2rem;
	border: black solid 2px;
	background: var(--primary-white);
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const ProfileName = styled.h1`
	font-size: 2rem;
	text-align: center;
	margin: 0;
`;

export const Button = styled.button`
	background-color: ${({ primary }) =>
		primary ? "var(--primary-green)" : "#fff"};
	color: ${({ primary }) => (primary ? "#fff" : "#000")};
	padding: 0.8rem 1rem;
	border: 1px solid #ccc;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease-in-out;
	&:hover {
		background-color: ${({ primary }) =>
			primary ? "#fff" : "var(--primary-green)"};
		color: ${({ primary }) => (primary ? "#000" : "#fff")};
	}
	margin-right: 1rem;
`;

export const Loader = () => {
	return (
		<LoaderBox>
			<ColorRing
				visible={true}
				height="100"
				width="100"
				ariaLabel="blocks-loading"
				wrapperStyle={{}}
				wrapperClass="blocks-wrapper"
				colors={["#849b87", "#849b87", "#849b87", "#849b87", "#849b87"]}
			/>
		</LoaderBox>
	);
};

const LoaderBox = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
`;

export const SharedAlert = styled.div`
	position: absolute;
	width: 100%;
	top: 100%;
	left: 0;
	font-size: 1rem;
	font-weight: 900;
	padding: 0.5rem 0;
	color: var(--green5);
	background-color: #000;
	animation-duration: 2s;
	animation-name: slideinout;
	animation-direction: horizontal;
	animation-iteration-count: 1;
	border-radius: 0.5rem;
	text-align: center;
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
