import axios from "../apis/greenServer";
import useAuth from "./useAuth";

export default function useRefreshToken() {
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
				username: response.data.username,
				img: response.data.img,
			};
		});
		return response.data.access_token;
	};

	return refresh;
}
