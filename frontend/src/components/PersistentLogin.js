import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

export default function PersistentLogin() {
	const { auth } = useAuth();
	const [loading, setLoading] = useState(true);
	const reflesh = useRefreshToken();
	const should = useRef(true);

	useEffect(() => {
		if (should.current) {
			should.current = false;
			const verifyRefreshToken = async () => {
				try {
					await reflesh();
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};
			!auth?.accessToken ? verifyRefreshToken() : setLoading(false);
		}
	}, []);

	useEffect(() => {
		console.log(`loading: ${loading}`);
		console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
	}, [loading]);

	return <>{loading ? <p>Loading...</p> : <Outlet />}</>;
}
