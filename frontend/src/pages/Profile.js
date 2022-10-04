import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Likes from "../components/user/Likes";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ProfileHeader } from "../components/Miscellaneus";
import Navbar from "../components/Navbar";

function Profile() {
	const { username } = useParams();
	const [user, setUser] = useState(null);
	const axiosPrivate = useAxiosPrivate();

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
		fetchUser();
	}, []);

	return (
		<>
			<Navbar back={true} />
			{user && (
				<>
					<ProfileHeader user={user}></ProfileHeader>
					<Likes username={username} />
				</>
			)}
		</>
	);
}

export default Profile;
