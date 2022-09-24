import { Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import useRefleshToken from "../hooks/useRefleshToken";
import useAuth from "../hooks/useAuth";

export default function PersistentLogin() {
	const { auth } = useAuth();
	const [loading, setLoading] = useState(true);
	const reflesh = useRefleshToken();
	const should = useRef(true);

	useEffect(() => {
		if (should.current) {
			should.current = false;
			const verifyRefleshToken = async () => {
				try {
					await reflesh();
				} catch (error) {
					console.error(error);
				} finally {
					setLoading(false);
				}
			};
			!auth?.accessToken ? verifyRefleshToken() : setLoading(false);
		}
	}, []);

	useEffect(() => {
		console.log(`loading: ${loading}`);
		console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
	}, [loading]);

	return <>{loading ? <p>Loading...</p> : <Outlet />}</>;
}
