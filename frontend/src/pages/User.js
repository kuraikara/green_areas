import React, { useState } from "react";
import Likes from "../components/user/Likes";
import styled from "styled-components";
import { Tab, Tabs, ProfileHeader, Loader } from "../components/Miscellaneus";
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
				<Tab onClick={() => setTab(0)} selected={tab == 0 ? 1 : 0}>
					Likes
				</Tab>
				<Tab onClick={() => setTab(1)} selected={tab == 1 ? 1 : 0}>
					Follow
				</Tab>
				<Tab onClick={() => setTab(2)} selected={tab == 2 ? 1 : 0}>
					Follow
				</Tab>
			</Tabs>
			{tab === 0 && <Likes />}

			{tab === 1 && <div>Follow</div>}
			{tab === 2 && <Loader />}
		</>
	);
}

export default User;
