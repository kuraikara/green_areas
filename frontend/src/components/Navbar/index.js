import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { NavLink as Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { MdAccountBox, MdPerson } from "react-icons/md";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import GlobalSearch from "./GlobalSearch";

export default function Navbar({ back }) {
	const { auth } = useAuth();
	const [openAccount, setOpenAccount] = useState(false);
	const should = useRef(true);
	const accountRef = useRef();
	const nav = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		if (should.current) {
			should.current = false;
			document.addEventListener("mousedown", (event) => {
				if (
					accountRef.current != null &&
					!accountRef.current.contains(event.target)
				) {
					setOpenAccount(false);
				}
			});
		}
		return () => {
			document.removeEventListener("mousedown", (event) => {});
		};
	}, []);

	const logOut = async () => {
		const response = await axiosPrivate.post("/auth/logout");
		console.log(response);
		if (response.status === 200) {
			window.location.reload();
		}
	};
	return (
		<Nav back={back ? 1 : 0}>
			<NavLink back={back ? 1 : 0} to="/">
				<h1>Green Areas</h1>
			</NavLink>
			<Bars />
			<NavMenu>
				<NavLink back={back ? 1 : 0} to="/">
					Home
				</NavLink>
				{/* <NavLink back={back ? 1 : 0} to="/about">
					About
				</NavLink> */}
				<NavLink back={back ? 1 : 0} to="/tops">
					Tops
				</NavLink>
				{auth && (
					<NavLink back={back ? 1 : 0} to="/feeds">
						Feeds
					</NavLink>
				)}
			</NavMenu>
			<GlobalSearch />
			<div style={{ display: "flex", flexDirection: "row" }}>
				<NavBtn>
					<NavBtnLink back={back ? 1 : 0} to="/map">
						Map
					</NavBtnLink>
				</NavBtn>
				{!auth ? (
					<NavBtn>
						<NavBtnLink back={back ? 1 : 0} to="/login">
							Log In
						</NavBtnLink>
					</NavBtn>
				) : (
					<NavBtn>
						<AccountBox ref={accountRef}>
							<AccountBtn
								openaccount={openAccount ? 1 : 0}
								onClick={() => setOpenAccount(true)}
							>
								{auth?.img ? (
									<AccountImg src={auth?.img} />
								) : (
									<AccountIcon openaccount={openAccount ? 1 : 0} />
								)}
							</AccountBtn>

							<AccountOptions openaccount={openAccount ? 1 : 0}>
								<AccountOption onClick={() => nav("/user")}>
									My Profile
								</AccountOption>
								<Separator />
								{auth?.role == "admin" && (
									<>
										<AccountOption onClick={() => nav("/admin")}>
											Admin Page
										</AccountOption>
										<Separator />
									</>
								)}
								<AccountOption onClick={() => nav("/settings")}>
									Settings
								</AccountOption>
								<Separator />
								<AccountOption onClick={() => logOut()}>Log Out</AccountOption>
							</AccountOptions>
						</AccountBox>
					</NavBtn>
				)}
			</div>
		</Nav>
	);
}

const Nav = styled.nav`
	background: rgba(0, 0, 0, 0.2);
	background: ${({ back }) => (back ? "#000" : "rgba(0, 0, 0, 0.2)")};
	border-radius: 0px 0px 10px 10px;
	height: 80px;
	display: flex;
	justify-content: space-between;
	padding: 0.5rem calc((100vw - 1500px) / 2);
	z-index: 10;
	position: sticky;
	top: 0;
`;

const NavLink = styled(Link)`
	font-size: 1.2em;
	font-weight: 700;
	color: ${({ back }) =>
		back == true ? "var(--hover-green);" : "var(--home-primary-green);"};
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 1rem;
	cursor: pointer;
	text-decoration: none;
	transition: all 0.5s ease-in-out;

	&.active {
		color: var(--primary-white);
	}

	&:hover {
		color: var(--primary-white);
		transform: scale(1.1);
		font-weight: 900;
	}
`;

const Bars = styled(FaBars)`
	color: #fff;
	display: none;

	@media screen and (max-width: 768px) {
		display: block;
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(-100%, 75%);
		font-size: 1.8rem;
		cursor: pointer;
	}
`;
const NavMenu = styled.div`
	display: flex;
	align-items: center;
	//margin-right: -24px;

	@media screen and (max-width: 768px) {
		display: none;
	}
`;

const NavBtn = styled.nav`
	display: flex;
	align-items: center;
	//margin-right: 24px;

	@media screen and (max-width: 768px) {
		display: none;
	}
`;

const NavBtnLink = styled(Link)`
	padding: 15px 22px;
	color: #fff;
	background: ${({ back }) =>
		back == true ? "var(--primary-green);" : "var(--home-primary-green);"};

	outline: none;
	border-radius: 1rem;
	margin-right: 1rem;
	cursor: pointer;
	transition: all 0.5s ease-in-out;
	text-decoration: none;
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
	font-weight: 700;
	border: ${({ back }) => (!back ? "1px solid var(--primary-white);" : "none")};

	&:hover {
		background: var(--primary-white);
		color: ${({ back }) =>
			back == true ? "var(--primary-green);" : "var(--home-primary-green);"};
	}

	&:active {
		color: red;
	}
`;

const AccountBtn = styled.div`
	width: 50px;
	height: 50px;
	border-radius: ${({ openaccount }) =>
		openaccount == true ? "50% 50% 0 0" : "50%"};
	background: ${({ openaccount }) =>
		openaccount == false ? "var(--primary-green);" : "#fff"};
	margin-left: 1rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.5s ease-in-out;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

	&:hover {
		background: #fff;
	}
`;

const AccountImg = styled.img`
	width: 50px;
	height: 50px;
	border-radius: 50%;
`;

const AccountIcon = styled(MdPerson)`
	color: ${({ openaccount }) =>
		openaccount == true ? "var(--primary-green);" : "#fff"};
	font-size: 2.5rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		color: var(--primary-green);
	}
`;

const AccountOptions = styled.div`
	width: 12vw;
	position: absolute;
	top: 100%;
	left: calc(0.5rem - 4vw);
	overflow: hidden;
	transform: ${({ openaccount }) => (openaccount ? "scaleY(1)" : "scaleY(0)")};
	transform-origin: top;
	background: #fff;
	border-radius: 1rem;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	transition: transform 0.1s ease-out;
	transition-delay: 0.3s;
`;

const AccountBox = styled.div`
	position: relative;
	margin-right: 1rem;
`;

const AccountOption = styled.div`
	width: 100%;
	text-align: center;
	cursor: pointer;
	padding: 0.5rem;
	white-space: nowrap;

	&:hover {
		background: var(--primary-green);
		color: #fff;
	}
`;

const Separator = styled.div`
	width: 100%;
	height: 1px;
	background: #ccc;
`;
