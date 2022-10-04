import React, { useState } from "react";
import Likes from "../components/user/Likes";
import Follows from "../components/user/Follows";
import styled from "styled-components";
import { ProfileHeader, Loader } from "../components/Miscellaneus";
import Tabs from "../components/miscellaneous/Tabs";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar";

function User() {
	const [tab, setTab] = useState(0);
	const { auth } = useAuth();
	return (
		<>
			<Navbar back={true} />
			<ProfileHeader user={auth} />
			<Tabs>
				<Likes tabname={"Likes"} username={auth.username} />
				<Follows tabname={"Follow"} username={auth.username} />
				<Loader tabname={"Prova"} />
			</Tabs>
		</>
	);
}

export default User;
