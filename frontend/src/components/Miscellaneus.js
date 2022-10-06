import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import React, { useState } from "react";
import { ColorRing } from "react-loader-spinner";

export const ProfileHeader = ({ user }) => {
	console.log(user);
	return (
		<ProfileBox>
			<ProfileImage img={user?.img} width={"150px"} height={"150px"} />
			<ProfileName>{user?.username}</ProfileName>
		</ProfileBox>
	);
};

const ProfileBox = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 1rem;
	margin-bottom: 2rem;
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
