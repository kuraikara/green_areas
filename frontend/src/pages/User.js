import React, { useState } from "react";
import Likes from "../components/user/Likes";
import styled from "styled-components";
import { Tabs, ProfileHeader, Loader } from "../components/Miscellaneus";
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
				<Likes tabname={"Likes"} />
				<div tabname={"Follow"}>Follow</div>
				<Loader tabname={"Prova"} />
			</Tabs>
		</>
	);
}

export default User;
