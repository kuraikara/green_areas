import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Likes from "../components/user/Likes";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ProfileHeader, Loader } from "../components/Miscellaneus";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import Tabs from "../components/miscellaneous/Tabs";
import Follows from "../components/user/Follows";
import { useNavigate } from "react-router-dom";

function Profile() {
	const { username } = useParams();
	const [user, setUser] = useState(null);
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const nav = useNavigate();

	const fetchUser = async () => {
		try {
			const response = await axiosPrivate.get(`/social/user/${username}`);
			setUser(response.data);
			console.log(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (username == auth.username) {
			nav("/user", { replace: true });
		}
		fetchUser();
	}, [username]);

	return (
		<>
			<Navbar back={true} />
			{user && (
				<>
					<ProfileHeader user={user}></ProfileHeader>
					<Tabs>
						<Likes tabname={"Likes"} username={username} />
						<Follows tabname={"Follow"} username={username} />
					</Tabs>
				</>
			)}
		</>
	);
}

export default Profile;
