import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

axios.defaults.withCredentials = true;

export default axios.create({
	baseURL: BASE_URL,
	//withCredentials: true,
	//credentials: "same-origin",
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		//credentials: "same-origin",
	},
	withCredentials: true,
});
