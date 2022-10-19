import React, { useState, useEffect } from "react";
import Likes from "../components/user/Likes";
import Follows from "../components/user/Follows";
import styled from "styled-components";
import { ProfileHeader, Loader } from "../components/Miscellaneus";
import Tabs from "../components/miscellaneous/Tabs";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function User() {
	const [tab, setTab] = useState(0);
	const { auth } = useAuth();
	const [user, setUser] = useState(null);
	const axiosPrivate = useAxiosPrivate();

	const fetchUser = async () => {
		try {
			const response = await axiosPrivate.get(`/social/user/${auth.username}`);
			setUser(response.data);
			console.log(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<>
			<Navbar back={true} />
			{user ? (
				<>
					<ProfileHeader user={user} />
					<Tabs>
						<Likes tabname={"Likes"} username={user.username} />
						<Follows tabname={"Follow"} username={user.username} />
						<Loader tabname={"Prova"} />
					</Tabs>
				</>
			) : (
				<Loader />
			)}
		</>
	);
}

export default User;
