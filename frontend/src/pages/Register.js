import React, { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../apis/greenServer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../components/PersistentLogin";
import styled from "styled-components";

export default function Login() {
	const nav = useNavigate();
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("");
	const [rptPwd, setRptPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");

	const [isRegister, setIsRegister] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (pwd != rptPwd) {
				setErrMsg("Passwords do not match");
				return;
			}
			const res = await axios.post(
				"/auth/signup",
				JSON.stringify({ username: user, password: pwd, email: email }),
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			console.log(JSON.stringify(res));
			res.status === 201 ? setIsRegister(true) : setIsRegister(false);
			setUser("");
			setPwd("");
			setRptPwd("");
			setEmail("");
		} catch (err) {
			errRef.current.focus();
			console.log(err);
			setErrMsg(err.response.data.error);
		}
	};

	return (
		<Container>
			{isRegister ? (
				<Success>
					<h1>Registration successful</h1>
					<p>
						You can now <Link to="/login">login</Link>
					</p>
				</Success>
			) : (
				<LoginBox>
					<Title>Register</Title>
					<Form onSubmit={handleSubmit}>
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							onChange={(e) => setUser(e.target.value)}
							ref={userRef}
							type="text"
							placeholder="Username"
							required
						/>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							onChange={(e) => setEmail(e.target.value)}
							type="text"
							placeholder="Email"
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
						<Label htmlFor="rptpwd">Repeat Password</Label>
						<Input
							onChange={(e) => setRptPwd(e.target.value)}
							type="password"
							id="rptpwd"
							placeholder="Repeat Password"
							required
						/>
						<Button type="submit">Register</Button>
					</Form>
					{
						<Error ref={errRef} aria-live="assertive">
							{errMsg}
						</Error>
					}
				</LoginBox>
			)}
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
	background: var(--primary-green);
	color: #fff;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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

const Success = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 500px;
	height: 100%;
	max-height: 500px;
	border-radius: 1rem;
	background: var(--primary-green);
	color: #fff;
`;
