import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import React, { useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { UnfollowButton, FollowButton } from "./miscellaneous/Buttons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FaShareAlt } from "react-icons/fa";

export const ProfileHeader = ({ user }) => {
	console.log(user);
	const [profileUser, setProfileUser] = useState(user);
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();

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

	return (
		<ProfileBox>
			<ProfileImage img={profileUser.img} width={"150px"} height={"150px"} />
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
				<FaShareAlt />
			</ProfileShare>
		</ProfileBox>
	);
};

const ProfileShare = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 2rem;
	right: 2rem;
	font-size: 2rem;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 50%;
	transition: all 0.5s ease-in-out;

	&:hover {
		background: #000;
		color: #fff;
	}
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
