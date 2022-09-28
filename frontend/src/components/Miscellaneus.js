import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import React, { useState } from "react";
import { ColorRing } from "react-loader-spinner";

export const Tabs = (state) => {
	const children = state.children;
	const [selected, setSelected] = useState(0);
	return (
		<>
			<TabsContainer>
				{children.map((child, index) => {
					return (
						<Tab
							key={index}
							onClick={() => setSelected(index)}
							selected={selected == index ? 1 : 0}
						>
							{child.props.tabname}
						</Tab>
					);
				})}
			</TabsContainer>
			{children[selected]}
		</>
	);
};

export const List = (state) => {
	console.log(state);
	let children = [];
	if (children instanceof Array) {
		children = state.children;
	} else {
		children.push(state.children);
	}
	return (
		<>
			<ListBox>
				{children instanceof Array ? (
					children.map((element) => {
						console.log(element);
						return (
							<Row>
								<Item>{element}</Item>
							</Row>
						);
					})
				) : (
					<Row>
						<Item>{children}</Item>
					</Row>
				)}
			</ListBox>
		</>
	);
};

const ListBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 70%;
	margin: 0 auto;
`;

const Row = styled.div`
	width: 100%;
	padding: 1.5rem 3rem;
	background: #fff;
	border-radius: 1rem;
	margin-top: 1rem;
`;

const Item = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	${({ first }) => (first ? "padding: 1rem 0;" : "")}
`;

export const TabsContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	margin-bottom: 1rem;
	font-size: 1.2rem;
	font-weight: bold;
`;

export const Tab = styled.div`
	background-color: ${({ selected }) =>
		selected == 1 ? "var(--primary-green)" : "#fff"};
	color: ${({ selected }) => (selected == 1 ? "#fff" : "#000")};
	flex-grow: 1;
	text-align: center;
	padding: 1rem;
	border-bottom: 1px solid #ccc;
	cursor: pointer;
	transition: all 0.5s ease-in-out;

	&:hover {
		${({ selected }) =>
			selected == 1 ? "" : "background-color: var(--hover-green)"}
	}
`;

export const ProfileHeader = ({ user }) => {
	console.log(user);
	return (
		<ProfileBox>
			<ProfileImage img={user?.img} width={"150px"} height={"150px"} />
			<ProfileName>{user?.user}</ProfileName>
		</ProfileBox>
	);
};

const ProfileBox = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: row;
	padding: 1rem;
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
	margin: 2rem;
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
