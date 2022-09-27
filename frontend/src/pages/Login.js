import React, { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../apis/greenServer";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../components/PersistentLogin";

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
			setAuth({ user, role, accessToken });
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
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username</label>
				<input
					id="username"
					onChange={(e) => setUser(e.target.value)}
					ref={userRef}
					type="text"
					placeholder="Username"
					value={user}
					required
				/>
				<label htmlFor="pwd">Password</label>
				<input
					onChange={(e) => setPwd(e.target.value)}
					type="password"
					id="pwd"
					placeholder="Password"
					required
				/>
				<button type="submit">Login</button>
			</form>
			{
				<p ref={errRef} aria-live="assertive">
					{errMsg}
				</p>
			}
		</div>
	);
}
