import React, { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../apis/greenServer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../components/PersistentLogin";
import styled from "styled-components";

export default function Login() {
	const { auth, setAuth } = useAuth();

	const nav = useNavigate();
	const location = useLocation();
	const from = location?.state?.from?.pathname || "/";
	console.log(location);
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"/auth/login",
				JSON.stringify({ username: user, password: pwd }),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			console.log(JSON.stringify(res));
			const accessToken = res?.data?.access_token;
			const role = res?.data?.role;
			const img = res?.data?.img;
			setAuth({ username: user, role, accessToken, img });
			console.log(auth);
			setUser("");
			setPwd("");
			console.log("from", from);
			nav(from, { replace: true });
		} catch (err) {
			if (!err.response) {
				setErrMsg("Server is not responding");
			} else if (err.response.status === 401) {
				setErrMsg("Invalid username or password");
			} else if (err.response.status === 500) {
				setErrMsg("Server error");
			} else if (err.response.status === 403) {
				setErrMsg("Access denied");
			} else {
				setErrMsg("Unknown error");
			}
			errRef.current.focus();
		}
	};

	return (
		<Container>
			<LoginBox>
				<Title>Login</Title>
				<Form onSubmit={handleSubmit}>
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						onChange={(e) => setUser(e.target.value)}
						ref={userRef}
						type="text"
						placeholder="Username"
						value={user}
						required
					/>
					<Label htmlFor="pwd">Password</Label>
					<Input
						onChange={(e) => setPwd(e.target.value)}
						type="password"
						id="pwd"
						placeholder="Password"
						required
					/>
					<Button type="submit">Login</Button>
				</Form>

				{
					<Error ref={errRef} aria-live="assertive">
						{errMsg}
					</Error>
				}
				<Link to="/register">You dont have an account?</Link>
			</LoginBox>
		</Container>
	);
}
const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
`;

const LoginBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 500px;
	height: 100%;
	max-height: 500px;
	border-radius: 1rem;
	background: var(--hover-green);
	color: #fff;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 1rem;
`;

const Title = styled.h1`
	font-size: 2.5rem;
	font-weight: 700;
	margin-bottom: 3rem;
`;

const Input = styled.input`
	width: 100%;
	padding: 0.5rem;
	margin-bottom: 1rem;
	border: 1px solid #ccc;
	border-radius: 0.25rem;
`;

const Label = styled.label`
	display: block;
	margin-bottom: 0.5rem;
`;

const Button = styled.button`
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 0.25rem;
	background-color: #333;
	color: #fff;
	font-weight: 700;
	cursor: pointer;
`;

const Error = styled.p`
	color: red;
`;
