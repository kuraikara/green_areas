import axios from "../apis/greenServer";
import useAuth from "./useAuth";

export default function useRefleshToken() {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.post("/auth/token/refresh", {});
		setAuth((prev) => {
			console.log(JSON.stringify(prev));
			console.log(JSON.stringify(response.data.access_token));
			console.log(JSON.stringify(response.data.role));
			console.log(JSON.stringify(response.data.username));
			return {
				...prev,
				accessToken: response.data.access_token,
				role: response.data.role,
				user: response.data.username,
			};
		});
		return response.data.access_token;
	};

	return refresh;
}
