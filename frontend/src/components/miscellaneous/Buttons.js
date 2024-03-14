import styled from "styled-components";
import { BiMap } from "react-icons/bi";
import { IoHeartDislikeSharp } from "react-icons/io5";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import {
	RiUserHeartFill,
	RiUserLocationFill,
	RiUserUnfollowFill,
	RiUserFollowFill,
} from "react-icons/ri";

export const ButtonGroup = styled.div`
	display: flex;
	gap: 1rem;
`;

export const UnlikeButton = ({ onClick }) => {
	return (
		<Container onClick={() => onClick()} color={"#ff5147"}>
			<UnlikeIcon />
			<Text>unlike</Text>
		</Container>
	);
};

export const UnfollowButton = ({ onClick }) => {
	return (
		<Container onClick={() => onClick()} color={"#ff5147"}>
			<UnfollowIcon />
			<Text>unfollow</Text>
		</Container>
	);
};

export const FollowButton = ({ onClick }) => {
	return (
		<Container onClick={() => onClick()} color={"#4CAF50"}>
			<FollowIcon />
			<Text>follow</Text>
		</Container>
	);
};

export const AlreadyFollowedButton = () => {
	return (
		<AlreadyContainer>
			<AlreadyFollowedIcon />
			<Text>following</Text>
		</AlreadyContainer>
	);
};

export const GoToButton = ({ onClick }) => {
	return (
		<Container onClick={() => onClick()} color={"#424242"}>
			<GoToIcon />
			<Text>view on map</Text>
		</Container>
	);
};

export const ViewProfileButton = ({ onClick }) => {
	return (
		<Container onClick={() => onClick()} color={"#424242"}>
			<ViewProfileIcon />
			<Text>view profile</Text>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0.75rem;
	${({ color }) => "border: 1px solid " + color + ";"}
	border-radius: 0.5rem;
	gap: 0.25rem;
	cursor: pointer;
	transition: all 0.5s ease-in-out;

	& > * {
		${({ color }) => "color: " + color + ";"}
	}

	&:hover {
		${({ color }) => "background: " + color + ";"}

		& > * {
			color: #fff;
		}
	}
`;
const AlreadyContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0.5rem;
	border-radius: 0.5rem;
	gap: 0.1rem;
	transition: all 0.5s ease-in-out;
	user-select: none;
	& > * {
		color: blue;
	}
`;
const UnlikeIcon = styled(IoHeartDislikeSharp)`
	font-size: 1.5rem;
`;

const UnfollowIcon = styled(RiUserUnfollowFill)`
	font-size: 1.5rem;
`;

const ViewProfileIcon = styled(RiUserLocationFill)`
	font-size: 1.5rem;
`;

const FollowIcon = styled(RiUserHeartFill)`
	font-size: 1.5rem;
`;

const AlreadyFollowedIcon = styled(RiUserFollowFill)`
	font-size: 1.5rem;
`;

const Text = styled.p`
	font-size: 1rem;
	font-weight: 700;

	@media (max-width: 768px) {
		display: none;
	}

	@media (max-width: 500px) {
		display: inline;
	}
`;

const GoToIcon = styled(BiMap)`
	font-size: 1.5rem;
`;
